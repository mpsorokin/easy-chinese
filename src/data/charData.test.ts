import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { charFile } from '../domain/charFile.ts';
import {
  _resetCharDataCache,
  charUrl,
  getCachedCharData,
  loadCharData,
} from './charData.ts';

const DATA = { strokes: ['M0 0'], medians: [[[0, 0]]] };
const response = (
  body: unknown,
  {
    status = 200,
    type = 'application/json',
  }: { status?: number; type?: string } = {},
) => ({
  ok: status >= 200 && status < 300,
  status,
  headers: new Headers({ 'content-type': type }),
  json: () => Promise.resolve(body),
});

describe('charData', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    _resetCharDataCache();
    fetchMock = vi.fn(() => Promise.resolve(response(DATA)));
    vi.stubGlobal('fetch', fetchMock);
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it('names files by code point', () => {
    expect(charFile('人')).toBe('4eba.json');
    expect(charUrl('人')).toBe('/hanzi/4eba.json');
  });

  it('joins GitHub Pages base paths correctly, with or without the trailing slash', () => {
    vi.stubEnv('BASE_URL', '/easy-chinese');
    expect(charUrl('一')).toBe('/easy-chinese/hanzi/4e00.json');
    vi.stubEnv('BASE_URL', '/easy-chinese/');
    expect(charUrl('一')).toBe('/easy-chinese/hanzi/4e00.json');
    vi.stubEnv('BASE_URL', '/');
    expect(charUrl('一')).toBe('/hanzi/4e00.json');
  });

  it('loads data and caches it for sync access', async () => {
    expect(getCachedCharData('人')).toBeUndefined();
    await expect(loadCharData('人')).resolves.toEqual(DATA);
    expect(fetchMock).toHaveBeenCalledWith('/hanzi/4eba.json');
    expect(getCachedCharData('人')).toEqual(DATA);
  });

  it('shares one request between concurrent and later calls', async () => {
    await Promise.all([loadCharData('人'), loadCharData('人')]);
    await loadCharData('人');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('does not cache failures, so the next call retries', async () => {
    fetchMock.mockResolvedValueOnce(response(null, { status: 404 }));
    await expect(loadCharData('人')).rejects.toThrow('404');
    expect(getCachedCharData('人')).toBeUndefined();

    await expect(loadCharData('人')).resolves.toEqual(DATA);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('rejects an HTML fallback page served for a missing file', async () => {
    fetchMock.mockResolvedValueOnce(response(null, { type: 'text/html' }));
    await expect(loadCharData('人')).rejects.toThrow('not found');
    expect(getCachedCharData('人')).toBeUndefined();
  });

  it('does not cache network errors either', async () => {
    fetchMock.mockRejectedValueOnce(new TypeError('offline'));
    await expect(loadCharData('人')).rejects.toThrow('offline');
    await expect(loadCharData('人')).resolves.toEqual(DATA);
  });
});
