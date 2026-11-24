// Typed JSON localStorage wrapper that never throws (private mode, quota, bad JSON).
// Every read goes through a normalizer, so stored data is never trusted as-is.

export type Normalizer<T> = (raw: unknown) => T;

export type Store<Schema extends Record<string, unknown>> = {
  // raw is undefined when the key is missing, unreadable or not valid JSON.
  get<K extends keyof Schema & string>(
    key: K,
    normalize: Normalizer<Schema[K]>,
  ): Schema[K];
  set<K extends keyof Schema & string>(key: K, value: Schema[K]): void;
  // Calls onChange when another tab changes (or clears) the key. Returns an unsubscribe.
  subscribe(key: keyof Schema & string, onChange: () => void): () => void;
};

export function createStore<Schema extends Record<string, unknown>>(
  prefix: string,
): Store<Schema> {
  return {
    get(key, normalize) {
      let raw: unknown;
      try {
        const v = localStorage.getItem(prefix + key);
        raw = v == null ? undefined : JSON.parse(v);
      } catch {
        raw = undefined;
      }
      return normalize(raw);
    },
    set(key, value) {
      try {
        localStorage.setItem(prefix + key, JSON.stringify(value));
      } catch {
        /* ignore */
      }
    },
    subscribe(key, onChange) {
      // `storage` fires only in other tabs; key is null after localStorage.clear().
      const listener = (e: StorageEvent) => {
        if (e.key === null || e.key === prefix + key) onChange();
      };
      window.addEventListener('storage', listener);
      return () => window.removeEventListener('storage', listener);
    },
  };
}

// Copies every `from<key>` entry to `to<key>` unless the target already exists.
// Old keys are kept, so a rollback still finds its data. Never throws.
export function migratePrefix(from: string, to: string): void {
  try {
    // Collect first: adding keys while iterating would shift the indices.
    const keys: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(from)) keys.push(key);
    }
    for (const key of keys) {
      const target = to + key.slice(from.length);
      const value = localStorage.getItem(key);
      if (value != null && localStorage.getItem(target) == null)
        localStorage.setItem(target, value);
    }
  } catch {
    /* ignore */
  }
}

// One in-memory copy of a store key per tab, shared by every reader (for
// useSyncExternalStore): a write reaches all subscribers at once, and a write from another
// tab reloads it. The copy is dropped when the last subscriber leaves, because the
// other-tab listener stops with it and the copy could go stale.
export function sharedValue<
  Schema extends Record<string, unknown>,
  K extends keyof Schema & string,
>(store: Store<Schema>, key: K, normalize: Normalizer<Schema[K]>) {
  let cache: Schema[K] | undefined;
  const listeners = new Set<() => void>();
  const get = (): Schema[K] => (cache ??= store.get(key, normalize));
  return {
    get,
    set: (value: Schema[K]) => {
      cache = value;
      store.set(key, value);
      for (const notify of listeners) notify();
    },
    subscribe: (onChange: () => void) => {
      listeners.add(onChange);
      const unsubscribe = store.subscribe(key, () => {
        cache = undefined;
        onChange();
      });
      return () => {
        listeners.delete(onChange);
        unsubscribe();
        if (listeners.size === 0) cache = undefined;
      };
    },
    // Tests only: forget the in-memory copy.
    reset: () => {
      cache = undefined;
    },
  };
}
