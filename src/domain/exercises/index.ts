// Lesson exercises: ids and question generators. Pure TypeScript, no React.
// Randomness comes in as `rng` (Math.random by default) so tests can fix it.
import type { HskChar, HskWord } from '@/domain/types.ts';
import type {
  ChoiceQuestion,
  Question,
  QuizId,
  Rng,
} from '@/domain/exercises/types.ts';
import { shuffle } from '@/domain/exercises/random.ts';
import { meaningQuiz, pinyinQuiz } from '@/domain/exercises/charQuestions.ts';
import {
  pickQuiz,
  wordQuiz,
  wordWriteQuiz,
} from '@/domain/exercises/wordQuestions.ts';

export * from '@/domain/exercises/types.ts';
export { shuffle } from '@/domain/exercises/random.ts';
export {
  splitPinyin,
  toneVariants,
  wordSyllables,
} from '@/domain/exercises/pinyin.ts';
export { meaningQuiz, pinyinQuiz } from '@/domain/exercises/charQuestions.ts';
export {
  PICK_TILES,
  WORD_PASSES,
  WORD_WRITE_MAX,
  pickQuiz,
  sentenceQuiz,
  wordQuiz,
  wordWriteQuiz,
  type SentenceLine,
} from '@/domain/exercises/wordQuestions.ts';

// A mixed round: each character once, as meaning or pinyin in turn, plus the words in
// their rotating modes, all shuffled together. Distractors come from the round first,
// then from the pools.
export function mixedQuiz(
  chars: readonly HskChar[],
  words: readonly HskWord[],
  charPool: readonly HskChar[],
  wordPool: readonly HskWord[],
  rng: Rng = Math.random,
): Question[] {
  const unique = [...new Map(chars.map((e) => [e.c, e])).values()];
  const byItem = (qs: ChoiceQuestion[]) => new Map(qs.map((q) => [q.item, q]));
  const meaning = byItem(meaningQuiz(unique, charPool, rng));
  const pinyin = byItem(pinyinQuiz(unique, charPool, rng));
  const charQs = shuffle(unique, rng).map((e, k) =>
    (k % 2 === 0 ? meaning : pinyin).get(e.c)!,
  );
  const tilePool = [
    ...new Set([...unique.map((e) => e.c), ...words.flatMap((w) => [...w.w])]),
  ];
  const wordQs = wordQuiz(
    [...new Map(words.map((w) => [w.w, w])).values()],
    wordPool,
    tilePool,
    rng,
  );
  return shuffle([...charQs, ...wordQs], rng);
}

// What a quiz is built from: the characters and words practised, the level's characters
// and words for distractors, and the characters already known (tiles of the word quiz).
type QuizInput = {
  chars: readonly HskChar[];
  words: readonly HskWord[];
  pool: { chars: readonly HskChar[]; words: readonly HskWord[] };
  known: readonly string[];
};

// Questions of one quiz exercise; distractors come from the practised set first, then the pool.
export function buildQuiz(
  ex: QuizId,
  { chars, words, pool, known }: QuizInput,
  rng: Rng = Math.random,
): Question[] {
  switch (ex) {
    case 'meaning':
      return meaningQuiz(chars, pool.chars, rng);
    case 'pinyin':
      return pinyinQuiz(chars, pool.chars, rng);
    case 'pick':
      return pickQuiz(
        words,
        chars.map((c) => c.c),
        pool.words,
        rng,
      );
    case 'wordWrite':
      return wordWriteQuiz(words, rng);
    case 'words':
      return wordQuiz(words, pool.words, known, rng);
  }
}
