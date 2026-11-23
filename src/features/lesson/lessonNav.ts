// The choice of the lesson to continue with (URLs are in shared/paths.ts).
import type { LevelData } from '../../data/hsk.ts';
import { lessonKey, lessonStatus } from '../progress/progress.ts';
import type { Progress } from '../progress/progress.ts';

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
