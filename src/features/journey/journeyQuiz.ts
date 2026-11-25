// Question sets of the journey's own rounds: a part's practice, a lesson's checkpoint and
// the review of due characters and words. Built from course data with the pure
// generators of domain/exercises.ts.
import { hskEntry } from '@/data/hsk.ts';
import type { LevelData } from '@/data/hsk.ts';
import {
  COURSE_LESSONS,
  courseParts,
  courseWords,
  exerciseLines,
  isDialogueExercise,
} from '@/data/courseLessons.ts';
import type { CourseLesson } from '@/data/courseLessons.ts';
import {
  mixedQuiz,
  sentenceQuiz,
  shuffle,
  wordWriteQuiz,
} from '@/domain/exercises/index.ts';
import type { Question, Rng, SentenceLine } from '@/domain/exercises/index.ts';
import type { HskWord } from '@/domain/types.ts';

export const PRACTICE_SIZE = 14;
export const CHECKPOINT = { chars: 12, words: 5, sentences: 3 } as const;

const PUNCTUATION = /^[\p{P}\p{Z}\s]*$/u;

// Dialogue lines of a lesson made only of characters with readings (and punctuation).
export function sentenceLines(lesson: CourseLesson): SentenceLine[] {
  return lesson.exercises.flatMap((ex) => {
    if (!isDialogueExercise(ex)) return [];
    return (exerciseLines(lesson, ex) ?? []).flatMap((line) => {
      const read = line.segments.filter((s) => s.py);
      const ok = line.segments.every((s) => s.py || PUNCTUATION.test(s.t));
      if (!ok || !read.length) return [];
      return [
        {
          chars: read.flatMap((s) => [...s.t]),
          py: read.map((s) => s.py).join(' '),
          en: line.en,
        },
      ];
    });
  });
}

// A part's practice: each character once and the part's words, mixed, then one word to
// write by hand at the end.
export function practiceQuiz(
  level: LevelData,
  lesson: CourseLesson,
  part: number,
  rng: Rng = Math.random,
): Question[] {
  const chars = courseParts(lesson)[part - 1] ?? [];
  const words = courseWords(lesson, part);
  const mixed = mixedQuiz(chars, words, level.chars, level.words, rng).slice(
    0,
    PRACTICE_SIZE,
  );
  return [...mixed, ...wordWriteQuiz(words, rng).slice(0, 1)];
}

const lessonWords = (lesson: CourseLesson): HskWord[] =>
  courseParts(lesson).flatMap((_, k) => courseWords(lesson, k + 1));

// The lesson's checkpoint: characters and words from all its parts, then a few dialogue
// lines to build at the end.
export function checkpointQuiz(
  level: LevelData,
  lesson: CourseLesson,
  rng: Rng = Math.random,
): Question[] {
  const all = courseParts(lesson).flat();
  const chars = shuffle(all, rng).slice(0, CHECKPOINT.chars);
  const words = shuffle(lessonWords(lesson), rng).slice(0, CHECKPOINT.words);
  const sentences = sentenceQuiz(
    sentenceLines(lesson),
    all.map((e) => e.c),
    CHECKPOINT.sentences,
    rng,
  );
  return [
    ...mixedQuiz(chars, words, level.chars, level.words, rng),
    ...sentences,
  ];
}

// Review of due items: characters as meaning or pinyin, words in their rotating modes.
export function reviewQuiz(
  level: LevelData,
  items: readonly string[],
  rng: Rng = Math.random,
): Question[] {
  const known = new Map<string, HskWord>();
  for (const w of [...level.words, ...COURSE_LESSONS.flatMap(lessonWords)])
    known.set(w.w, w);
  const chars = items.flatMap((i) =>
    [...i].length === 1 ? (hskEntry(i) ?? []) : [],
  );
  const words = items.flatMap((i) =>
    [...i].length > 1 ? (known.get(i) ?? []) : [],
  );
  return mixedQuiz(chars, words, level.chars, level.words, rng);
}
