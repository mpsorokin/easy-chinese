import { useEffect, useState } from 'react';
import type { Normalizer, Store } from '@/shared/lib/storage.ts';

// useState backed by a store key: read (and normalized) once, written back on every change,
// and (with sync) re-read when another tab writes the key, so tabs don't overwrite each
// other's data. Turn sync off for per-tab state such as the open character.
export function usePersistentState<
  Schema extends Record<string, unknown>,
  K extends keyof Schema & string,
>(
  store: Store<Schema>,
  key: K,
  normalize: Normalizer<Schema[K]>,
  {
    sync = true,
    initial,
  }: {
    sync?: boolean;
    // Used instead of the stored value on mount (and then stored).
    initial?: Schema[K];
  } = {},
) {
  const [value, setValue] = useState(() =>
    initial !== undefined ? initial : store.get(key, normalize),
  );
  useEffect(() => store.set(key, value), [store, key, value]);
  useEffect(() => {
    if (!sync) return;
    return store.subscribe(key, () => setValue(store.get(key, normalize)));
  }, [store, key, normalize, sync]);
  return [value, setValue] as const;
}
