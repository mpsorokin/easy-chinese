// localStorage keys owned by the progress feature (same `hanzi:` prefix as the rest of the app).
import { normalizeBest } from '@/domain/grading.ts';
import type { BestGrades } from '@/domain/grading.ts';
import { createStore } from '@/shared/lib/storage.ts';
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

// One in-memory copy per tab, shared by every useProgress() caller: a write from one
// component reaches all others at once, and a write from another tab reloads it.
let cache: Progress | undefined;
const listeners = new Set<() => void>();

export const getProgress = (): Progress =>
  (cache ??= progressStore.get('progress', loadProgress));

export function updateProgress(update: (p: Progress) => Progress): void {
  cache = update(getProgress());
  progressStore.set('progress', cache);
  for (const l of listeners) l();
}

export function subscribeProgress(onChange: () => void): () => void {
  listeners.add(onChange);
  const unsubscribe = progressStore.subscribe('progress', () => {
    cache = undefined;
    onChange();
  });
  return () => {
    listeners.delete(onChange);
    unsubscribe();
  };
}

// Tests only: forget the in-memory copy.
export const _resetProgressCache = () => {
  cache = undefined;
};
