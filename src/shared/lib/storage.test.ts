import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createStore, migratePrefix } from '@/shared/lib/storage.ts';

function memoryStorage() {
  const data = new Map<string, string>();
  return {
    data,
    get length() {
      return data.size;
    },
    key: (i: number) => [...data.keys()][i] ?? null,
    getItem: vi.fn((k: string) => data.get(k) ?? null),
    setItem: vi.fn((k: string, v: string) => {
      data.set(k, v);
    }),
  };
}

type Schema = { best: Record<string, number>; n: number; s: string };
const store = createStore<Schema>('hanzi:');
const num = (raw: unknown) => (typeof raw === 'number' ? raw : 42);
const str = (raw: unknown) => (typeof raw === 'string' ? raw : 'fb');

describe('createStore', () => {
  let ls: ReturnType<typeof memoryStorage>;
  beforeEach(() => {
    ls = memoryStorage();
    vi.stubGlobal('localStorage', ls);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('round-trips JSON values under a prefixed key', () => {
    store.set('best', { 人: 3 });
    expect([...ls.data.keys()]).toEqual(['hanzi:best']);
    expect(store.get('best', (raw) => raw as Schema['best'])).toEqual({
      人: 3,
    });
  });

  it('passes the parsed value through the normalizer', () => {
    store.set('n', 7);
    const normalize = vi.fn(num);
    expect(store.get('n', normalize)).toBe(7);
    expect(normalize).toHaveBeenCalledWith(7);
  });

  it('gives the normalizer undefined for a missing key', () => {
    expect(store.get('n', num)).toBe(42);
  });

  it('gives the normalizer undefined for broken JSON', () => {
    ls.data.set('hanzi:s', '{not json');
    expect(store.get('s', str)).toBe('fb');
  });

  it('gives the normalizer undefined when localStorage throws', () => {
    ls.getItem.mockImplementation(() => {
      throw new Error('denied');
    });
    expect(store.get('s', str)).toBe('fb');
  });

  it('does not throw when setItem fails (quota, private mode)', () => {
    ls.setItem.mockImplementation(() => {
      throw new Error('QuotaExceededError');
    });
    expect(() => store.set('n', 1)).not.toThrow();
  });
});

describe('migratePrefix', () => {
  let ls: ReturnType<typeof memoryStorage>;
  beforeEach(() => {
    ls = memoryStorage();
    vi.stubGlobal('localStorage', ls);
  });
  afterEach(() => vi.unstubAllGlobals());

  it('copies keys to the new prefix and keeps the old ones', () => {
    ls.data.set('propis:last', '"人"');
    ls.data.set('propis:progress', '{}');
    ls.data.set('other', '1');
    migratePrefix('propis:', 'hanzi:');
    expect(Object.fromEntries(ls.data)).toEqual({
      'propis:last': '"人"',
      'propis:progress': '{}',
      other: '1',
      'hanzi:last': '"人"',
      'hanzi:progress': '{}',
    });
  });

  it('does not overwrite existing keys under the new prefix', () => {
    ls.data.set('propis:last', '"人"');
    ls.data.set('hanzi:last', '"大"');
    migratePrefix('propis:', 'hanzi:');
    expect(ls.data.get('hanzi:last')).toBe('"大"');
  });

  it('does not throw when localStorage throws', () => {
    ls.getItem.mockImplementation(() => {
      throw new Error('denied');
    });
    ls.data.set('propis:last', '"人"');
    expect(() => migratePrefix('propis:', 'hanzi:')).not.toThrow();
  });
});
