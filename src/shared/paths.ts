// Every URL of the app, as plain functions with no other dependencies, so any module (even
// the router in the entry chunk) can build links without loading data or progress code.
import type { CourseExercise } from '@/data/courseLessons.ts';
import type { ExerciseId } from '@/domain/exercises/index.ts';

export const levelPath = (level: string) => `/hsk/${level}`;
export const levelCharsPath = (level: string, mode?: 'write') =>
  `${levelPath(level)}?tab=chars${mode === 'write' ? '&mode=write' : ''}`;
// Themed topics of a level (the Topics tab); words are grouped by theme there.
export const lessonPath = (level: string, lesson: number) =>
  `/hsk/${level}/topics/${lesson}`;
export const topicWritePath = (level: string, lesson: number) =>
  `${lessonPath(level, lesson)}/write`;
// Copybook over characters chosen on the All characters tab.
export const selectionWritePath = (
  level: string,
  chars: readonly string[],
  mode?: 'write',
) =>
  `/write/${level}?${new URLSearchParams({ set: chars.join(''), ...(mode ? { from: mode } : {}) }).toString()}`;
export const levelLessonsPath = (level: string) =>
  `${levelPath(level)}?tab=lessons`;
// The level whose Lessons tab has the course of src/data/lessons.
export const COURSE_LEVEL = '1';
export const courseLessonPath = (level: string, lesson: number) =>
  `/hsk/${level}/lessons/${lesson}`;
export const courseExercisePath = (
  level: string,
  lesson: number,
  ex: CourseExercise,
) => `${courseLessonPath(level, lesson)}/${ex}`;

export const courseWritePath = (level: string, lesson: number, part: number) =>
  `${courseLessonPath(level, lesson)}/write/${part}`;

// A step (1-based) of the whole-lesson run started with "Start lesson".
export const courseRunPath = (level: string, lesson: number, step: number) =>
  `${courseLessonPath(level, lesson)}/play/${step}`;

export const courseQuizPath = (
  level: string,
  lesson: number,
  part: number,
  ex: ExerciseId,
) => `${courseLessonPath(level, lesson)}/quiz/${part}/${ex}`;

// The journey map (a tab of the level page) and its own rounds. Pages opened from the map
// get `?from=journey` so their close link returns to it.
export const journeyPath = (level: string) => `${levelPath(level)}?tab=journey`;
export const FROM_JOURNEY = 'from=journey';
export const fromJourney = (search: string) =>
  new URLSearchParams(search).get('from') === 'journey';
export const journeyPracticePath = (
  level: string,
  lesson: number,
  part: number,
) => `/hsk/${level}/journey/practice/${lesson}/${part}`;
export const journeyCheckpointPath = (level: string, lesson: number) =>
  `/hsk/${level}/journey/checkpoint/${lesson}`;
export const journeyReviewPath = (level: string) =>
  `/hsk/${level}/journey/review`;

export const exercisePath = (level: string, lesson: number, ex: ExerciseId) =>
  `${lessonPath(level, lesson)}/${ex}`;

// Reading: short stories.
export const readingPath = '/reading';
export const readingStoryPath = (story: string, lesson?: number) =>
  `${readingPath}/${story}${lesson === undefined ? '' : `?lesson=${lesson}`}`;
export const vocabularyPath = '/vocabulary';
export const statsPath = '/stats';

// My Classes: notes from classes with a teacher, and translation rounds over their words.
export const classesPath = '/my-classes';
export const classPath = (lesson: number) => `${classesPath}/${lesson}`;

export const translationDirections = ['zh-en', 'en-zh', 'listen-en'] as const;
export type TranslationDirection = (typeof translationDirections)[number];

export const isTranslationDirection = (
  value: unknown,
): value is TranslationDirection =>
  translationDirections.includes(value as TranslationDirection);

export const classTranslationPath = (
  lesson: number,
  direction: TranslationDirection,
) => `${classPath(lesson)}/practice/${direction}`;
