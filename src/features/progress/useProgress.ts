import { useCallback, useMemo, useSyncExternalStore } from 'react';
import {
  PASS_GRADE,
  XP,
  bestGrades,
  gainXp,
  logActivity,
  recordAnswer,
  recordAttempt,
  recordJourney,
  recordLesson,
} from '@/features/progress/progress.ts';
import type { AttemptResult } from '@/features/progress/progress.ts';
import type { ExerciseId } from '@/domain/exercises.ts';
import type { Grade } from '@/domain/grading.ts';
import {
  getProgress,
  subscribeProgress,
  updateProgress,
} from '@/features/progress/progressStore.ts';

// Persistent learning progress: per-character stats, best grades for the UI, lesson
// exercise results, journey steps, review boxes and daily XP. Every caller sees the same
// data (see progressStore.ts).
export function useProgress() {
  const progress = useSyncExternalStore(subscribeProgress, getProgress);
  const best = useMemo(() => bestGrades(progress), [progress]);
  const record = useCallback(
    (r: AttemptResult) =>
      updateProgress((p) =>
        gainXp(
          logActivity(recordAttempt(p, r), r.at, { chars: 1 }),
          XP.char,
          r.at,
        ),
      ),
    [],
  );
  const recordExercise = useCallback(
    (key: string, ex: ExerciseId, grade: Grade) =>
      updateProgress((p) => recordLesson(p, key, ex, grade, Date.now())),
    [],
  );
  // A quiz answer: review boxes for its character or word, and XP when right.
  const answer = useCallback((item: string | undefined, right: boolean) => {
    const now = Date.now();
    updateProgress((p) => {
      const next = logActivity(
        item ? recordAnswer(p, item, right, now) : p,
        now,
        { answers: 1 },
      );
      return right ? gainXp(next, XP.answer, now) : next;
    });
  }, []);
  // A finished journey round; passing it earns the round bonus.
  const recordStep = useCallback((key: string, grade: Grade) => {
    const now = Date.now();
    updateProgress((p) =>
      gainXp(
        recordJourney(p, key, grade, now),
        grade >= PASS_GRADE ? XP.step : 0,
        now,
      ),
    );
  }, []);
  // A lesson's dialogues read to the end (the bonus only the first time).
  const readStory = useCallback((key: string) => {
    const now = Date.now();
    updateProgress((p) =>
      gainXp(
        recordJourney(p, key, 3, now),
        p.journey?.[key] ? 0 : XP.story,
        now,
      ),
    );
  }, []);
  return {
    progress,
    best,
    record,
    recordExercise,
    answer,
    recordStep,
    readStory,
  };
}
