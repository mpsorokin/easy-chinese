// Hooks shared by the HSK pages: reading the level, topic or course lesson from the URL,
// and opening a copybook. Pages redirect themselves when a value is missing.
import { useNavigate, useParams } from 'react-router';
import { levelData } from '@/data/hsk.ts';
import { courseLesson } from '@/data/courseLessons.ts';
import { useProgress } from '@/features/progress/useProgress.ts';

// '/hsk/:level/…': the level, undefined for an unknown id.
export const useLevelParam = () => levelData(useParams().level);

// '/hsk/:level/topics/:lesson/…': the level and its themed topic (with its index).
export function useTopicParams() {
  const params = useParams();
  const level = levelData(params.level);
  const idx = level
    ? level.lessons.findIndex((l) => String(l.id) === params.lesson)
    : -1;
  return { level, idx, lesson: level?.lessons[idx] };
}

// '/hsk/:level/lessons/:lesson/…/:part?': the level, the course lesson and the part
// (NaN without one).
export function useCourseParams() {
  const params = useParams();
  return {
    level: levelData(params.level),
    lesson: courseLesson(params.lesson),
    part: Number(params.part),
  };
}

// Opens a copybook at the first of `chars` not written yet (the first one when all are).
export function useOpenCopybook() {
  const navigate = useNavigate();
  const { progress } = useProgress();
  return (path: string, chars: readonly string[]) => {
    const start = chars.find((c) => !progress.chars[c]) ?? chars[0];
    void navigate(path, { state: start ? { start } : null });
  };
}
