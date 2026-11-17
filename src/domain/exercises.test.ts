import { describe, expect, it } from 'vitest';
import {
  OPTIONS,
  meaningQuiz,
  pinyinQuiz,
  WORD_WRITE_MAX,
  shuffle,
  splitPinyin,
  wordSyllables,
  toneVariants,
  wordQuiz,
  wordWriteQuiz,
  pickQuiz,
  PICK_TILES,
  EXERCISES,
  availableExercises,
  buildQuiz,
} from './exercises.ts';
import type { BuildQuestion, ChoiceQuestion, QuizId } from './exercises.ts';
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

describe('splitPinyin', () => {
  it.each([
    ['xuéxí', 2, ['xué', 'xí']],
    ['xuéshēng', 2, ['xué', 'shēng']],
    ['bàngōng', 2, ['bàn', 'gōng']],
    ['zhōngguó', 2, ['zhōng', 'guó']],
    ['érzi', 2, ['ér', 'zi']],
    ["Xī'ān", 2, ['xī', 'ān']],
    ['shēngrì', 2, ['shēng', 'rì']],
    ['bàba', 2, ['bà', 'ba']],
    ['xiǎojiě', 2, ['xiǎo', 'jiě']],
    ['wǒmen', 2, ['wǒ', 'men']],
  ])('%s', (py, n, out) => {
    expect(splitPinyin(py, n)).toEqual(out);
  });

  it('returns null when the count does not fit', () => {
    expect(splitPinyin('hǎo', 3)).toBeNull();
  });

  // Erhua words (哪儿 nǎr) have fewer syllables than characters; they get other questions.
  it('splits every multi-character HSK 1 word except erhua', () => {
    const skipped = HSK1_LEVEL.words
      .filter((w) => [...w.w].length > 1 && !wordSyllables(w))
      .map((w) => w.w);
    expect(skipped.sort()).toEqual(
      ['好玩儿', '哪儿', '那儿', '一点儿', '有点儿', '这儿', '面条儿'].sort(),
    );
    expect(wordSyllables({ w: '女儿', py: 'nǚ’ér', en: '' })).toEqual([
      'nǚ',
      'ér',
    ]);
  });
});

describe('wordQuiz', () => {
  const known = HSK1_LEVEL.lessons.slice(0, 3).flatMap((l) => l.chars);
  const words = lessonWords(HSK1_LEVEL, 2);

  it('mixes question kinds with valid options and tiles', () => {
    const modes = new Set<string>();
    for (let seed = 1; seed < 30; seed++) {
      const qs = wordQuiz(words, HSK1_LEVEL.words, known, seeded(seed));
      expect(qs).toHaveLength(words.length);
      for (const q of qs) {
        if (q.kind === 'write') throw new Error('no writing in the word quiz');
        if (q.kind === 'choice') {
          modes.add(q.mode ?? 'show');
          checkChoice(q);
          continue;
        }
        modes.add(q.mode);
        // Every blank's answer is among the tiles, each tile used once.
        const tiles = [...q.tiles];
        for (const cell of q.blanks) {
          const at = tiles.indexOf(q.cells[cell]!);
          expect(
            at,
            `${q.cells.join('')}: ${q.cells[cell]}`,
          ).toBeGreaterThanOrEqual(0);
          tiles.splice(at, 1);
        }
        if (q.mode === 'gap') checkPick(q);
        else expect(tiles).toHaveLength(2);
        if (q.mode === 'reading') expect(q.tileLang).toBe('pinyin');
      }
    }
    expect([...modes].sort()).toEqual(
      ['build', 'gap', 'listen', 'reading', 'show', 'toWord'].sort(),
    );
  });

  it('asks for the word among words of the same length', () => {
    for (let seed = 1; seed < 20; seed++)
      for (const q of wordQuiz(words, HSK1_LEVEL.words, known, seeded(seed)))
        if (q.kind === 'choice' && q.mode === 'toWord') {
          const len = [...q.options[q.answer]!].length;
          for (const o of q.options) expect([...o]).toHaveLength(len);
        }
  });
});

// Nothing pre-filled, the word among 5–7 distinct-enough tiles.
function checkPick(q: BuildQuestion) {
  expect(q.blanks).toEqual(q.cells.map((_, k) => k));
  expect(q.tiles.length).toBeGreaterThanOrEqual(
    Math.max(PICK_TILES.min, q.cells.length + 2),
  );
  expect(q.tiles.length).toBeLessThanOrEqual(
    Math.max(PICK_TILES.max, q.cells.length + 2),
  );
  const extra = q.tiles.filter((c) => !q.cells.includes(c));
  expect(new Set(extra).size).toBe(extra.length);
}

describe('pickQuiz', () => {
  it('asks every multi-character word with all slots empty', () => {
    const idx = 2;
    const words = lessonWords(HSK1_LEVEL, idx);
    const tilePool = lessonChars(HSK1_LEVEL, idx).map((c) => c.c);
    for (let seed = 1; seed < 20; seed++) {
      const qs = pickQuiz(words, tilePool, HSK1_LEVEL.words, seeded(seed));
      expect(qs).toHaveLength(words.filter((w) => [...w.w].length > 1).length);
      qs.forEach(checkPick);
    }
  });
});

describe('wordWriteQuiz', () => {
  it('only multi-character words, a few per round', () => {
    const qs = wordWriteQuiz(HSK1_LEVEL.words, seeded(4));
    expect(qs).toHaveLength(WORD_WRITE_MAX);
    for (const q of qs) expect([...q.answer].length).toBeGreaterThan(1);
    expect(wordWriteQuiz([{ w: '好', py: 'hǎo', en: 'good' }])).toEqual([]);
  });
});

describe('buildQuiz', () => {
  const idx = 2;
  const chars = lessonChars(HSK1_LEVEL, idx);
  const words = lessonWords(HSK1_LEVEL, idx);
  const known = HSK1_LEVEL.lessons.slice(0, idx + 1).flatMap((l) => l.chars);
  const input = { chars, words, pool: HSK1_LEVEL, known };

  it('builds each quiz exactly as its generator does', () => {
    const direct = {
      meaning: meaningQuiz(chars, pool, seeded(5)),
      pinyin: pinyinQuiz(chars, pool, seeded(5)),
      pick: pickQuiz(
        words,
        chars.map((c) => c.c),
        HSK1_LEVEL.words,
        seeded(5),
      ),
      wordWrite: wordWriteQuiz(words, seeded(5)),
      words: wordQuiz(words, HSK1_LEVEL.words, known, seeded(5)),
    };
    for (const [ex, questions] of Object.entries(direct))
      expect(buildQuiz(ex as QuizId, input, seeded(5))).toEqual(questions);
  });
});

describe('availableExercises', () => {
  it('offers every exercise when there are multi-character words', () => {
    expect(availableExercises({ hasWords: true, hasMultiWords: true })).toEqual(
      [...EXERCISES],
    );
  });

  it('drops word writing and picking without multi-character words', () => {
    expect(
      availableExercises({ hasWords: true, hasMultiWords: false }),
    ).toEqual(['write', 'meaning', 'pinyin', 'words']);
  });

  it('drops every word exercise without words', () => {
    expect(
      availableExercises({ hasWords: false, hasMultiWords: false }),
    ).toEqual(['write', 'meaning', 'pinyin']);
  });
});
