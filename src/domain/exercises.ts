// Lesson exercises: ids and question generators. Pure TypeScript, no React.
// Randomness comes in as `rng` (Math.random by default) so tests can fix it.
import type { HskChar, HskWord } from './types.ts';

export const EXERCISES = ['write', 'meaning', 'pinyin', 'words'] as const;
export type ExerciseId = (typeof EXERCISES)[number];

export const isExercise = (x: unknown): x is ExerciseId =>
  typeof x === 'string' && (EXERCISES as readonly string[]).includes(x);

export type Rng = () => number;

// What the speaker button pronounces. `afterAnswer`: only once answered, when hearing it
// would give the answer away (the reading in the pinyin quiz, the word to build).
export type Audio = { text: string; afterAnswer?: boolean };

// One multiple-choice question: `prompt` is shown big (a character or word), `hint` under it.
// Options are shown as text; for 'build' questions they are characters to tap in order.
export type ChoiceQuestion = {
  kind: 'choice';
  prompt: string;
  hint?: string;
  options: string[];
  answer: number; // index into options
  // Shown after answering: the full entry, so a wrong answer still teaches.
  reveal: string;
  audio?: Audio;
};

// Build a word from character tiles: tap the tiles in order.
export type BuildQuestion = {
  kind: 'build';
  prompt: string; // the meaning (and pinyin) to build
  hint?: string;
  tiles: string[]; // the word's characters plus distractors, shuffled
  answer: string; // the word
  reveal: string;
  audio?: Audio;
};

export type Question = ChoiceQuestion | BuildQuestion;

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

// Lesson words, two kinds mixed: word → meaning (any word) and building multi-character
// words from tiles (the word's characters plus two from `tilePool`).
export function wordQuiz(
  words: readonly HskWord[],
  pool: readonly HskWord[],
  tilePool: readonly string[],
  rng: Rng = Math.random,
): Question[] {
  return shuffle(words, rng).map((w, i): Question => {
    const chars = [...w.w];
    if (chars.length > 1 && i % 2 === 1) {
      const extra = pick([tilePool], 2, new Set(chars), rng);
      return {
        kind: 'build',
        prompt: w.en,
        hint: w.py,
        tiles: shuffle([...chars, ...extra], rng),
        answer: w.w,
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
      prompt: w.w,
      hint: w.py,
      ...choice(w.en, wrong, rng),
      reveal: wordReveal(w),
      audio: { text: w.w },
    };
  });
}
