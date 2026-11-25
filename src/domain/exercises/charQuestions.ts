// Questions about single characters: meaning and pinyin.
import type { HskChar } from '@/domain/types.ts';
import { OPTIONS } from '@/domain/exercises/types.ts';
import type { ChoiceQuestion, Rng } from '@/domain/exercises/types.ts';
import { choice, pick, shuffle } from '@/domain/exercises/random.ts';
import { toneVariants } from '@/domain/exercises/pinyin.ts';

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
      item: e.c,
    };
  });
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
      item: e.c,
    };
  });
}
