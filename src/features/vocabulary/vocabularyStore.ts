import { useSyncExternalStore } from 'react';
import { vocabularyEntry } from '@/data/vocabulary.ts';
import { createStore, sharedValue } from '@/shared/lib/storage.ts';

export const wordStatuses = ['new', 'learning', 'known'] as const;
export type WordStatus = (typeof wordStatuses)[number];
export type WordStatuses = Partial<Record<string, WordStatus>>;

// Words missing from the current vocabulary are kept: a gloss that is renamed or removed and
// later restored gets its status back. Pages only show words they look up in `vocabulary`.
function normalize(raw: unknown): WordStatuses {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return Object.fromEntries(
    Object.entries(raw).filter(
      ([, status]) => status === 'learning' || status === 'known',
    ),
  );
}

const statuses = sharedValue(
  createStore<{ vocabulary: WordStatuses }>('hanzi:'),
  'vocabulary',
  normalize,
);

export const useWordStatuses = () =>
  useSyncExternalStore(statuses.subscribe, statuses.get);

export function setWordStatus(word: string, status: WordStatus) {
  if (!vocabularyEntry(word)) return;
  const next = { ...statuses.get() };
  if (status === 'new') delete next[word];
  else next[word] = status;
  statuses.set(next);
}
