// Questions about words and dialogue lines: tiles, dictation, readings and writing.
import type { HskWord } from '@/domain/types.ts';
import { OPTIONS } from '@/domain/exercises/types.ts';
import type {
  BuildQuestion,
  Question,
  Rng,
  WriteQuestion,
} from '@/domain/exercises/types.ts';
import { choice, pick, shuffle } from '@/domain/exercises/random.ts';
import { toneVariants, wordSyllables } from '@/domain/exercises/pinyin.ts';

const wordReveal = (w: HskWord) => `${w.w} · ${w.py} — ${w.en}`;

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
    item: w.w,
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
      item: w.w,
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
          item: w.w,
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
      item: w.w,
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
      item: w.w,
    }));
}

// A dialogue line for "Build the sentence": its characters (no punctuation), reading and
// translation.
export type SentenceLine = { chars: string[]; py: string; en: string };

const SENTENCE_CHARS = { min: 3, max: 7 } as const;

// Up to `n` short dialogue lines to build from their translation; distractor tiles come
// from `tilePool`.
export function sentenceQuiz(
  lines: readonly SentenceLine[],
  tilePool: readonly string[],
  n: number,
  rng: Rng = Math.random,
): BuildQuestion[] {
  const fit = lines.filter(
    (l) =>
      l.chars.length >= SENTENCE_CHARS.min &&
      l.chars.length <= SENTENCE_CHARS.max,
  );
  const unique = [...new Map(fit.map((l) => [l.chars.join(''), l])).values()];
  return shuffle(unique, rng)
    .slice(0, n)
    .map((l) => {
      const zh = l.chars.join('');
      const extra = pick([tilePool], 2, new Set(l.chars), rng);
      return {
        kind: 'build',
        mode: 'sentence',
        prompt: l.en,
        hint: l.py,
        cells: l.chars,
        blanks: l.chars.map((_, k) => k),
        tiles: shuffle([...l.chars, ...extra], rng),
        tileLang: 'zh',
        reveal: `${zh} · ${l.py} — ${l.en}`,
        audio: { text: zh, afterAnswer: true },
      };
    });
}
