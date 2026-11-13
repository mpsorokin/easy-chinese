import { useCallback, useMemo, useSyncExternalStore } from 'react';
import { bestGrades, recordAttempt, recordLesson } from './progress.ts';
import type { AttemptResult } from './progress.ts';
import type { ExerciseId } from '../../domain/exercises.ts';
import type { Grade } from '../../domain/grading.ts';
import {
  getProgress,
  subscribeProgress,
  updateProgress,
} from './progressStore.ts';

// Persistent learning progress: per-character stats, best grades for the UI and
// lesson exercise results. Every caller sees the same data (see progressStore.ts).
export function useProgress() {
  const progress = useSyncExternalStore(subscribeProgress, getProgress);
  const best = useMemo(() => bestGrades(progress), [progress]);
  const record = useCallback(
    (r: AttemptResult) => updateProgress((p) => recordAttempt(p, r)),
    [],
  );
  const recordExercise = useCallback(
    (key: string, ex: ExerciseId, grade: Grade) =>
      updateProgress((p) => recordLesson(p, key, ex, grade, Date.now())),
    [],
  );
  return { progress, best, record, recordExercise };
}
