// Lesson exercises: ids and question generators. Pure TypeScript, no React.
// Randomness comes in as `rng` (Math.random by default) so tests can fix it.
import type { HskChar, HskWord } from './types.ts';

export const EXERCISES = [
  'write',
  'wordWrite',
  'pick',
  'meaning',
  'pinyin',
  'words',
] as const;
export type ExerciseId = (typeof EXERCISES)[number];

export const isExercise = (x: unknown): x is ExerciseId =>
  typeof x === 'string' && (EXERCISES as readonly string[]).includes(x);

export type Rng = () => number;

// What the speaker button pronounces. `afterAnswer`: only once answered, when hearing it
// would give the answer away (the reading in the pinyin quiz, the word to build).
export type Audio = { text: string; afterAnswer?: boolean };

// One multiple-choice question: `prompt` is shown big (a character or word), `hint` under it.
// Options are shown as text; for 'build' questions they are characters to tap in order.
// Modes: 'show' — the prompt is shown (default); 'listen' — only its sound until answered;
// optionLang 'zh' — the options are Chinese words (shown with a CJK font).
export type ChoiceQuestion = {
  kind: 'choice';
  mode?: 'show' | 'listen' | 'toWord';
  optionLang?: 'zh';
  prompt: string;
  hint?: string;
  options: string[];
  answer: number; // index into options
  // Shown after answering: the full entry, so a wrong answer still teaches.
  reveal: string;
  audio?: Audio;
};

// Tile questions, all shown with the "Build the word" layout:
//  build   — meaning + pinyin given, tap the word's characters in order;
//  listen  — only the sound is given, tap the characters (dictation);
//  reading — the word is given, tap its syllables in order (tone practice);
//  gap     — pick the word's characters from 5–7 tiles, all slots empty.
export type BuildMode = 'build' | 'listen' | 'reading' | 'gap';

export type BuildQuestion = {
  kind: 'build';
  mode: BuildMode;
  prompt: string; // the meaning, or the word itself for 'reading'
  hint?: string;
  cells: string[]; // the full answer, one cell per character or syllable
  blanks: number[]; // indexes of the cells to fill, in order; the rest are shown
  tiles: string[]; // the missing cells plus distractors, shuffled
  tileLang: 'zh' | 'pinyin';
  reveal: string;
  audio?: Audio;
};

// Write a whole word by hand, several passes with a fading outline.
export type WriteQuestion = {
  kind: 'write';
  prompt: string; // the meaning
  hint: string; // pinyin
  answer: string; // the word
  reveal: string;
  audio: Audio;
};

export type Question = ChoiceQuestion | BuildQuestion | WriteQuestion;

export const OPTIONS = 4;

export function shuffle<T>(list: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

// `n` distinct values from `pool` (in priority order: earlier sources first, each shuffled),
// skipping `exclude` and duplicates.
function pick(
  sources: readonly (readonly string[])[],
  n: number,
  exclude: ReadonlySet<string>,
  rng: Rng,
): string[] {
  const out: string[] = [];
  const seen = new Set(exclude);
  for (const src of sources)
    for (const v of shuffle(src, rng)) {
      if (out.length >= n) return out;
      if (seen.has(v)) continue;
      seen.add(v);
      out.push(v);
    }
  return out;
}

// Options with the right answer at a random place.
function choice(
  right: string,
  wrong: string[],
  rng: Rng,
): { options: string[]; answer: number } {
  const options = shuffle([right, ...wrong], rng);
  return { options, answer: options.indexOf(right) };
}

const reveal = (e: HskChar) => `${e.c} · ${e.py} — ${e.en}`;

// Character → meaning. Distractors come from the lesson first, then from the whole level.
export function meaningQuiz(
  chars: readonly HskChar[],
  pool: readonly HskChar[],
  rng: Rng = Math.random,
): ChoiceQuestion[] {
  return shuffle(chars, rng).map((e) => {
    const wrong = pick(
      [chars.map((x) => x.en), pool.map((x) => x.en)],
      OPTIONS - 1,
      new Set([e.en]),
      rng,
    );
    return {
      kind: 'choice',
      prompt: e.c,
      ...choice(e.en, wrong, rng),
      reveal: reveal(e),
      audio: { text: e.c },
    };
  });
}

const TONES: Record<string, string[]> = {
  a: ['a', 'ā', 'á', 'ǎ', 'à'],
  e: ['e', 'ē', 'é', 'ě', 'è'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù'],
  ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ'],
};
const BASE = new Map(
  Object.entries(TONES).flatMap(([base, forms]) =>
    forms.map((f) => [f, base] as const),
  ),
);

// Vowel that carries the tone mark in a toneless syllable (standard placement rules).
function markIndex(syl: string): number {
  for (const v of ['a', 'e']) {
    const i = syl.indexOf(v);
    if (i >= 0) return i;
  }
  const ou = syl.indexOf('ou');
  if (ou >= 0) return ou;
  for (let i = syl.length - 1; i >= 0; i--) if (TONES[syl[i]!]) return i;
  return -1;
}

// The same one-syllable pinyin with each of the tones 1–4 plus neutral: "hǎo" → hāo, háo, hǎo, hào, hao.
export function toneVariants(py: string): string[] {
  const plain = [...py].map((ch) => BASE.get(ch) ?? ch).join('');
  const i = markIndex(plain);
  if (i < 0 || /\s/.test(py)) return [py];
  const forms = TONES[plain[i]!]!;
  return [1, 2, 3, 4, 0].map(
    (t) => plain.slice(0, i) + forms[t] + plain.slice(i + 1),
  );
}

// Character → pinyin. Distractors: the same syllable with other tones first (tone practice),
// then readings of other characters in the lesson and level.
export function pinyinQuiz(
  chars: readonly HskChar[],
  pool: readonly HskChar[],
  rng: Rng = Math.random,
): ChoiceQuestion[] {
  return shuffle(chars, rng).map((e) => {
    const tones = toneVariants(e.py).filter((p) => p !== e.py);
    const wrong = pick(
      [tones.slice(0, 2), chars.map((x) => x.py), pool.map((x) => x.py)],
      OPTIONS - 1,
      new Set([e.py]),
      rng,
    );
    return {
      kind: 'choice',
      prompt: e.c,
      hint: e.en,
      ...choice(e.py, wrong, rng),
      reveal: reveal(e),
      audio: { text: e.c, afterAnswer: true },
    };
  });
}

const wordReveal = (w: HskWord) => `${w.w} · ${w.py} — ${w.en}`;

const SYLLABLE =
  /^(?:zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?[aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+(?:ng|n|r)?$/;
const startsWithVowel = (s: string) => !/^[bcdfghjklmnpqrstvwxyz]/.test(s);

// Splits a word's pinyin ("xuéshēng", "Xī'ān") into `n` syllables, or null if it can't.
// Of the possible splits, one where no later syllable starts with a vowel wins
// ("bàngōng" → bàn gōng, not bàng ōng).
export function splitPinyin(py: string, n: number): string[] | null {
  const chunks = py
    .toLowerCase()
    .trim()
    .split(/[\s'’]+/)
    .filter(Boolean);
  const found: string[][] = [];
  const walk = (ci: number, rest: string, acc: string[]) => {
    if (found.length > 20) return;
    if (!rest) {
      if (ci + 1 < chunks.length) walk(ci + 1, chunks[ci + 1]!, acc);
      else if (acc.length === n) found.push(acc);
      return;
    }
    if (acc.length >= n) return;
    for (let len = 1; len <= rest.length; len++) {
      const syl = rest.slice(0, len);
      if (SYLLABLE.test(syl)) walk(ci, rest.slice(len), [...acc, syl]);
    }
  };
  if (chunks.length) walk(0, chunks[0]!, []);
  return (
    found.find((f) => f.slice(1).every((s) => !startsWithVowel(s))) ??
    found[0] ??
    null
  );
}

// A word's syllables, one per character; null for erhua words (面条儿 miàntiáor), where
// 儿 is only an "r" on the syllable before it.
export function wordSyllables(w: HskWord): string[] | null {
  const chars = [...w.w];
  const syllables = splitPinyin(w.py, chars.length);
  // A real 儿 syllable reads ér (女儿 nǚ'ér); anything else is an erhua split.
  if (chars.at(-1) === '儿' && !/^[eēéěè]r$/.test(syllables?.at(-1) ?? ''))
    return null;
  return syllables;
}

export const PICK_TILES = { min: 5, max: 7 } as const;

// "Pick the characters": the meaning and pinyin are given, every slot is empty, and the
// word's characters hide among 5–7 tiles. Distractors: the part's characters first, then
// characters of the level's words.
function pickQuestion(
  w: HskWord,
  tilePool: readonly string[],
  poolChars: readonly string[],
  rng: Rng,
): BuildQuestion {
  const chars = [...w.w];
  const size =
    PICK_TILES.min + Math.floor(rng() * (PICK_TILES.max - PICK_TILES.min + 1));
  const extra = pick(
    [tilePool, poolChars],
    Math.max(2, size - chars.length),
    new Set(chars),
    rng,
  );
  return {
    kind: 'build',
    mode: 'gap',
    prompt: w.en,
    hint: w.py,
    cells: chars,
    blanks: chars.map((_, k) => k),
    tiles: shuffle([...chars, ...extra], rng),
    tileLang: 'zh',
    reveal: wordReveal(w),
    audio: { text: w.w, afterAnswer: true },
  };
}

// One "Pick the characters" question per multi-character word.
export function pickQuiz(
  words: readonly HskWord[],
  tilePool: readonly string[],
  pool: readonly HskWord[],
  rng: Rng = Math.random,
): BuildQuestion[] {
  const poolChars = pool.flatMap((x) => [...x.w]);
  return shuffle(
    words.filter((w) => [...w.w].length > 1),
    rng,
  ).map((w) => pickQuestion(w, tilePool, poolChars, rng));
}

const WORD_MODES = [
  'build',
  'choice',
  'listen',
  'toWord',
  'gap',
  'hear',
  'reading',
] as const;

// Lesson words, several kinds mixed: single characters are word → meaning; longer words
// rotate through meaning, building from tiles (the word's characters plus distractors from
// `tilePool`), dictation, a missing character and building the reading from syllables.
export function wordQuiz(
  words: readonly HskWord[],
  pool: readonly HskWord[],
  tilePool: readonly string[],
  rng: Rng = Math.random,
): Question[] {
  const offset = Math.floor(rng() * WORD_MODES.length);
  let multi = 0;
  const poolChars = pool.flatMap((x) => [...x.w]);
  return shuffle(words, rng).map((w): Question => {
    const chars = [...w.w];
    const mode =
      chars.length > 1
        ? WORD_MODES[(offset + multi++) % WORD_MODES.length]!
        : 'choice';
    const all = chars.map((_, k) => k);
    const base = {
      kind: 'build' as const,
      reveal: wordReveal(w),
      tileLang: 'zh' as const,
    };
    if (mode === 'build' || mode === 'listen') {
      const extra = pick([tilePool], 2, new Set(chars), rng);
      return {
        ...base,
        mode,
        prompt: w.en,
        hint: w.py,
        cells: chars,
        blanks: all,
        tiles: shuffle([...chars, ...extra], rng),
        audio: { text: w.w, afterAnswer: mode === 'build' },
      };
    }
    if (mode === 'gap') return pickQuestion(w, tilePool, poolChars, rng);
    const syllables = mode === 'reading' ? wordSyllables(w) : null;
    if (syllables) {
      const tones = syllables.flatMap((s) => toneVariants(s));
      const extra = pick([tones], 2, new Set(syllables), rng);
      return {
        ...base,
        mode: 'reading',
        prompt: w.w,
        hint: w.en,
        cells: syllables,
        blanks: syllables.map((_, k) => k),
        tiles: shuffle([...syllables, ...extra], rng),
        tileLang: 'pinyin',
        audio: { text: w.w, afterAnswer: true },
      };
    }
    if (mode === 'toWord') {
      // Meaning → the word: other words of the same length look most alike.
      const same = (x: HskWord) => [...x.w].length === chars.length;
      const taken = new Set([
        w.w,
        ...words.filter((x) => x.en === w.en).map((x) => x.w),
      ]);
      const wrong = pick(
        [words.filter(same).map((x) => x.w), pool.filter(same).map((x) => x.w)],
        OPTIONS - 1,
        taken,
        rng,
      );
      if (wrong.length === OPTIONS - 1)
        return {
          kind: 'choice',
          mode: 'toWord',
          optionLang: 'zh',
          prompt: w.en,
          ...choice(w.w, wrong, rng),
          reveal: wordReveal(w),
          audio: { text: w.w, afterAnswer: true },
        };
    }
    const wrong = pick(
      [words.map((x) => x.en), pool.map((x) => x.en)],
      OPTIONS - 1,
      new Set([w.en]),
      rng,
    );
    return {
      kind: 'choice',
      ...(mode === 'hear' ? { mode: 'listen' as const } : {}),
      prompt: w.w,
      hint: w.py,
      ...choice(w.en, wrong, rng),
      reveal: wordReveal(w),
      audio: { text: w.w },
    };
  });
}

// Outline visibility for each pass of "Write the word": traced, faint, then from memory.
export const WORD_PASSES = [0.7, 0.25, 0] as const;
export const WORD_WRITE_MAX = 4;

// Multi-character words to write by hand, a few per round.
export function wordWriteQuiz(
  words: readonly HskWord[],
  rng: Rng = Math.random,
): WriteQuestion[] {
  return shuffle(
    words.filter((w) => [...w.w].length > 1),
    rng,
  )
    .slice(0, WORD_WRITE_MAX)
    .map((w) => ({
      kind: 'write',
      prompt: w.en,
      hint: w.py,
      answer: w.w,
      reveal: wordReveal(w),
      audio: { text: w.w },
    }));
}
