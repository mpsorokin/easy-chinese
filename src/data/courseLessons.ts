// Lessons of the "Lessons" tab (separate from the themed topics): exercise cards and content.
import { hskEntry } from './hsk.ts';
import type { HskChar, HskWord } from '../domain/types.ts';
import { lesson1 } from './lessons/lesson1.ts';
import { lesson2 } from './lessons/lesson2.ts';
import { lesson3 } from './lessons/lesson3.ts';
import { lesson4 } from './lessons/lesson4.ts';
import { lesson5 } from './lessons/lesson5.ts';
import { lesson6 } from './lessons/lesson6.ts';
import {
  isDialogueExercise,
  type CourseExercise,
  type DialogueExercise,
} from './courseExercise.ts';

export {
  exerciseNumber,
  isDialogueExercise,
  type CourseExercise,
  type DialogueExercise,
} from './courseExercise.ts';

// One piece of a dialogue line: a character with its pinyin, or text without a reading
// (punctuation, Latin letters such as "AI").
export type Segment = { t: string; py?: string };

export type DialogueLine = { segments: readonly Segment[]; en: string };

// A vocabulary entry of the "Words" exercise.
export type CourseWord = { zh: string; py: string; en: string };

export type CourseLesson = {
  id: number;
  exercises: readonly CourseExercise[];
  dialogues: Partial<Record<DialogueExercise, readonly DialogueLine[]>>;
  words?: readonly CourseWord[];
  // Card subtitles of this lesson's exercises; without them the shared ones are shown.
  descriptions?: Partial<Record<CourseExercise, string>>;
  // Characters practised in the lesson's exercises (writing and quizzes), split into
  // parts of 8-10 so each round stays short.
  parts?: readonly string[];
};

export const COURSE_LESSONS: readonly CourseLesson[] = [
  lesson1,
  lesson2,
  lesson3,
  lesson4,
  lesson5,
  lesson6,
];

// Exercises shown as a list of lines: the dialogues and the vocabulary.
export type LinesExercise = DialogueExercise | 'words';

export const isLinesExercise = (x: unknown): x is LinesExercise =>
  x === 'words' || isDialogueExercise(x);

// The lines of an exercise; a word is one line with its pinyin over the whole word.
export function exerciseLines(
  lesson: CourseLesson,
  ex: LinesExercise,
): readonly DialogueLine[] | undefined {
  if (ex !== 'words') return lesson.dialogues[ex];
  return lesson.words?.map((w) => ({
    segments: [{ t: w.zh, py: w.py }],
    en: w.en,
  }));
}

// Whether an exercise has content; the rest are shown as "soon".
export const isExerciseReady = (lesson: CourseLesson, ex: CourseExercise) =>
  isLinesExercise(ex) && (exerciseLines(lesson, ex)?.length ?? 0) > 0;

export const courseLesson = (id: string | undefined) =>
  COURSE_LESSONS.find((l) => String(l.id) === id);

const hskChars = (chars: Iterable<string>): HskChar[] =>
  [...new Set(chars)].flatMap((c) => hskEntry(c) ?? []);

// The lesson's practice parts: its own list, or else one part with every distinct
// character of its vocabulary; none if it has neither. Each part has its HSK readings
// and meanings.
export function courseParts(lesson: CourseLesson): HskChar[][] {
  if (lesson.parts) return lesson.parts.map((part) => hskChars(part));
  const chars = hskChars((lesson.words ?? []).flatMap((w) => [...w.zh]));
  return chars.length > 0 ? [chars] : [];
}

// One part (1-based) of the lesson's practice characters.
export const coursePart = (
  lesson: CourseLesson,
  part: number,
): HskChar[] | undefined => courseParts(lesson)[part - 1];

// Characters practised in the lessons before this one (they count as known).
function knownBefore(lesson: CourseLesson): string[] {
  const at = COURSE_LESSONS.indexOf(lesson);
  return COURSE_LESSONS.slice(0, Math.max(0, at)).flatMap((l) =>
    courseParts(l).flatMap((p) => p.map((e) => e.c)),
  );
}

// Multi-character vocabulary entries for a part's word quizzes: each word of the lesson
// goes to the first part by which all its characters are known (from this lesson's parts
// so far or from earlier lessons), so a word made only of older characters is in part 1.
export function courseWords(lesson: CourseLesson, part: number): HskWord[] {
  const parts = courseParts(lesson).map((p) => p.map((e) => e.c));
  const before = knownBefore(lesson);
  const known = new Set([...before, ...parts.slice(0, part).flat()]);
  const knownEarlier = new Set([...before, ...parts.slice(0, part - 1).flat()]);
  return (lesson.words ?? [])
    .filter((w) => {
      const cs = [...w.zh];
      return (
        cs.length > 1 &&
        cs.every((c) => known.has(c)) &&
        (part === 1 || !cs.every((c) => knownEarlier.has(c)))
      );
    })
    .map((w) => ({ w: w.zh, py: w.py, en: w.en }));
}
