// localStorage keys owned by the progress feature (same `hanzi:` prefix as the rest of the app).
import { normalizeBest } from '@/domain/grading.ts';
import type { BestGrades } from '@/domain/grading.ts';
import { createStore, sharedValue } from '@/shared/lib/storage.ts';
import {
  migrateBestGrades,
  normalizeProgress,
} from '@/features/progress/progress.ts';
import type { Progress } from '@/features/progress/progress.ts';

type ProgressStorage = {
  progress: Progress;
  best: BestGrades; // legacy (pre-v1): read once for migration, never written or deleted
};

const progressStore = createStore<ProgressStorage>('hanzi:');

// Normalizer for the `progress` key: valid v1 data, otherwise migrated legacy best grades.
export const loadProgress = (raw: unknown): Progress =>
  normalizeProgress(raw) ??
  migrateBestGrades(progressStore.get('best', normalizeBest));

// One copy per tab, shared by every useProgress() caller (see sharedValue).
const progress = sharedValue(progressStore, 'progress', loadProgress);

export const getProgress = progress.get;
export const subscribeProgress = progress.subscribe;
export const updateProgress = (update: (p: Progress) => Progress): void =>
  progress.set(update(progress.get()));
// Tests only: forget the in-memory copy.
export const _resetProgressCache = progress.reset;
