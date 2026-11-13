import { describe, expect, it } from 'vitest';
import {
  OPTIONS,
  meaningQuiz,
  pinyinQuiz,
  shuffle,
  toneVariants,
  wordQuiz,
} from './exercises.ts';
import type { ChoiceQuestion } from './exercises.ts';
import { HSK1_LEVEL, lessonChars, lessonWords } from '../data/hsk.ts';

// Deterministic generator (mulberry32) so runs can be compared.
function seeded(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let x = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    x = (x + Math.imul(x ^ (x >>> 7), 61 | x)) ^ x;
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

const pool = HSK1_LEVEL.chars;
const lessonCount = HSK1_LEVEL.lessons.length;

function checkChoice(q: ChoiceQuestion) {
  expect(q.options).toHaveLength(OPTIONS);
  expect(new Set(q.options).size).toBe(OPTIONS);
  expect(q.answer).toBeGreaterThanOrEqual(0);
  expect(q.answer).toBeLessThan(OPTIONS);
}

describe('shuffle', () => {
  it('keeps the elements and does not mutate the input', () => {
    const a = [1, 2, 3, 4, 5];
    const b = shuffle(a, seeded(1));
    expect([...b].sort()).toEqual(a);
    expect(a).toEqual([1, 2, 3, 4, 5]);
  });
});

describe('toneVariants', () => {
  it('puts the tone mark on the right vowel', () => {
    expect(toneVariants('hǎo')).toEqual(['hāo', 'háo', 'hǎo', 'hào', 'hao']);
    expect(toneVariants('liù')).toContain('liú');
    expect(toneVariants('guì')).toContain('guī');
    expect(toneVariants('nǚ')).toContain('nǜ');
    expect(toneVariants('ma')).toContain('mā');
    expect(toneVariants('zǒu')).toContain('zóu');
  });
});

describe('meaningQuiz', () => {
  it('asks every lesson character once with 4 distinct options', () => {
    for (let i = 0; i < lessonCount; i++) {
      const chars = lessonChars(HSK1_LEVEL, i);
      const qs = meaningQuiz(chars, pool, seeded(i));
      expect(qs.map((q) => q.prompt).sort()).toEqual(
        chars.map((e) => e.c).sort(),
      );
      for (const q of qs) {
        checkChoice(q);
        const e = chars.find((x) => x.c === q.prompt);
        expect(q.options[q.answer]).toBe(e?.en);
      }
    }
  });

  it('is deterministic for a fixed rng', () => {
    const chars = lessonChars(HSK1_LEVEL, 2);
    expect(meaningQuiz(chars, pool, seeded(7))).toEqual(
      meaningQuiz(chars, pool, seeded(7)),
    );
  });
});

describe('pinyinQuiz', () => {
  it('offers the right reading among distinct options', () => {
    for (let i = 0; i < lessonCount; i++) {
      const chars = lessonChars(HSK1_LEVEL, i);
      for (const q of pinyinQuiz(chars, pool, seeded(i))) {
        checkChoice(q);
        const e = chars.find((x) => x.c === q.prompt);
        expect(q.options[q.answer]).toBe(e?.py);
      }
    }
  });

  it('includes two other tones of the same syllable', () => {
    const good = [{ c: '好', py: 'hǎo', en: 'good' }];
    const [q] = pinyinQuiz(good, pool, seeded(3));
    const tones = toneVariants('hǎo');
    expect(q?.options.filter((o) => tones.includes(o))).toHaveLength(3);
  });
});

describe('wordQuiz', () => {
  it('mixes meaning questions and word building with valid tiles', () => {
    const known = HSK1_LEVEL.lessons.slice(0, 3).flatMap((l) => l.chars);
    const words = lessonWords(HSK1_LEVEL, 2);
    const qs = wordQuiz(words, HSK1_LEVEL.words, known, seeded(5));
    expect(qs).toHaveLength(words.length);
    expect(qs.some((q) => q.kind === 'build')).toBe(true);
    for (const q of qs) {
      if (q.kind === 'choice') {
        checkChoice(q);
        continue;
      }
      const tiles = [...q.tiles];
      for (const c of q.answer) {
        const at = tiles.indexOf(c);
        expect(at, `${q.answer}: ${c}`).toBeGreaterThanOrEqual(0);
        tiles.splice(at, 1);
      }
      expect(tiles).toHaveLength(2);
    }
  });
});
