// @vitest-environment jsdom
import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { _resetCharDataCache } from './charData.ts';
import { useCharData } from './useCharData.ts';

const DATA = { strokes: ['M0 0'], medians: [[[0, 0]]] };
const ok = () => ({
  ok: true,
  status: 200,
  headers: new Headers({ 'content-type': 'application/json' }),
  json: () => Promise.resolve(DATA),
});

describe('useCharData', () => {
  let fetchMock: ReturnType<typeof vi.fn>;
  beforeEach(() => {
    _resetCharDataCache();
    fetchMock = vi.fn(() => Promise.resolve(ok()));
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('goes from loading to ready', async () => {
    const { result } = renderHook(() => useCharData('人'));
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('ready'));
    expect(result.current.data).toEqual(DATA);
  });

  it('reports an error and recovers after retry()', async () => {
    fetchMock.mockRejectedValue(new TypeError('offline'));
    const { result } = renderHook(() => useCharData('人'));
    await waitFor(() => expect(result.current.status).toBe('error'));

    fetchMock.mockResolvedValue(ok());
    act(() => result.current.retry());
    expect(result.current.status).toBe('loading');
    await waitFor(() => expect(result.current.status).toBe('ready'));
  });
});
