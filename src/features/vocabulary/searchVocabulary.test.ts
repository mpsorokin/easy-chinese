import { expect, it } from 'vitest';
import { vocabulary } from '@/data/vocabulary.ts';
import { searchVocabulary } from '@/features/vocabulary/searchVocabulary.ts';

const words = (query: string) => searchVocabulary(query).map(({ w }) => w);

it('returns the whole vocabulary for an empty query', () => {
  expect(searchVocabulary('  ')).toBe(vocabulary);
});

it('finds hanzi, ignoring spaces', () => {
  expect(words('朋友')[0]).toBe('朋友');
  expect(words(' 朋 友 ')[0]).toBe('朋友');
});

it('matches pinyin with tone marks, tone numbers or none', () => {
  for (const query of ['péngyou', 'peng2you', 'pengyou', 'Peng You'])
    expect(words(query)[0]).toBe('朋友');
});

it('accepts v and u: for ü', () => {
  expect(words('nv3')).toContain('女');
  expect(words('nu:')).toContain('女');
});

it('matches English meanings', () => {
  expect(words('teacher')[0]).toBe('老师');
  expect(words('xyzzy')).toEqual([]);
});

it('ranks an exact match before a prefix before a substring', () => {
  // Rank of a result by its English meanings only: 0 exact, 1 prefix, 2 substring.
  const rank = (en: string) =>
    Math.min(
      ...en.split(/[,;/]/).map((meaning) => {
        const m = meaning.trim().toLowerCase();
        return m === 'friend' ? 0 : m.startsWith('friend') ? 1 : 2;
      }),
    );
  const ranks = searchVocabulary('friend').map(({ en }) => rank(en));
  expect(ranks[0]).toBe(0);
  expect(ranks).toEqual([...ranks].sort((a, b) => a - b));
});
