// @vitest-environment jsdom
import { beforeEach, expect, it, vi } from 'vitest';

const KEY = 'hanzi:vocabulary';

// The store caches its snapshot per module, so each test loads a fresh copy.
const load = () => import('@/features/vocabulary/vocabularyStore.ts');
const saved = (): unknown => JSON.parse(localStorage.getItem(KEY) ?? 'null');

beforeEach(() => {
  localStorage.clear();
  vi.resetModules();
});

it('stores learning and known words and forgets words set back to new', async () => {
  const { setWordStatus } = await load();
  setWordStatus('朋友', 'learning');
  setWordStatus('老师', 'known');
  expect(saved()).toEqual({ 朋友: 'learning', 老师: 'known' });
  setWordStatus('朋友', 'new');
  expect(saved()).toEqual({ 老师: 'known' });
});

it('ignores words outside the vocabulary', async () => {
  const { setWordStatus } = await load();
  setWordStatus('不是词', 'known');
  expect(saved()).toBeNull();
});

it('drops invalid statuses but keeps words missing from the vocabulary', async () => {
  localStorage.setItem(
    KEY,
    JSON.stringify({ 朋友: 'known', 老师: 'new', 学生: 7, 旧词: 'learning' }),
  );
  const { setWordStatus } = await load();
  setWordStatus('中文', 'learning');
  expect(saved()).toEqual({
    朋友: 'known',
    旧词: 'learning',
    中文: 'learning',
  });
});

it.each([null, '[]', '"x"', '{bad json'])(
  'starts empty when the stored value is %s',
  async (raw) => {
    if (raw !== null) localStorage.setItem(KEY, raw);
    const { setWordStatus } = await load();
    setWordStatus('朋友', 'known');
    expect(saved()).toEqual({ 朋友: 'known' });
  },
);
