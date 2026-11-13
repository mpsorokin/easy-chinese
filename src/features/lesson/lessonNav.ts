// URLs of the HSK section and the choice of the lesson to continue with.
import type { LevelData } from '../../data/hsk.ts';
import type { ExerciseId } from '../../domain/exercises.ts';
import type { CourseExercise } from '../../data/courseLessons.ts';
import { lessonKey, lessonStatus } from '../progress/progress.ts';
import type { Progress } from '../progress/progress.ts';

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

export const exercisePath = (level: string, lesson: number, ex: ExerciseId) =>
  `${lessonPath(level, lesson)}/${ex}`;

// Stored last lesson key: "1:3"-like strings only.
export const normalizeLessonKey = (raw: unknown): string =>
  typeof raw === 'string' && /^[0-9-]+:\d+$/.test(raw) ? raw : '';

export const statusOf = (p: Progress, level: LevelData, idx: number) => {
  const lesson = level.lessons[idx];
  return lessonStatus(
    p,
    lessonKey(level.id, lesson?.id ?? 0),
    lesson?.chars ?? [],
  );
};

// Lesson to continue with: the last opened one while it is unfinished, otherwise the first
// unfinished lesson; -1 when the whole level is done.
export function continueIndex(
  level: LevelData,
  p: Progress,
  lastKey: string,
): number {
  const last = level.lessons.findIndex(
    (l) => lessonKey(level.id, l.id) === lastKey,
  );
  if (last >= 0 && !statusOf(p, level, last).complete) return last;
  return level.lessons.findIndex((_, i) => !statusOf(p, level, i).complete);
}

// Lessons fully done in a level.
export const lessonsDone = (level: LevelData, p: Progress) =>
  level.lessons.filter((_, i) => statusOf(p, level, i).complete).length;
