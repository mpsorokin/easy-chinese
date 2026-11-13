import { useEffect, useState } from 'react';
import type { CharacterJson } from 'hanzi-writer';
import { ALL, indexOfChar } from './chars.ts';
import {
  getCachedCharData,
  loadCharData,
  prefetchCharData,
} from './charData.ts';

export type CharDataState =
  | { status: 'loading'; data: null }
  | { status: 'ready'; data: CharacterJson }
  | { status: 'error'; data: null };

/**
 * Stroke data for a character with its loading status, plus retry() after an error.
 * Also prefetches the previous/next characters so ‹ › navigation is instant.
 */
export function useCharData(c: string): CharDataState & { retry: () => void } {
  // Result of the last finished load; `attempt` ties it to a specific retry.
  const [state, setState] = useState<{
    c: string;
    attempt: number;
    ok: boolean;
  } | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let cancelled = false;
    loadCharData(c)
      .then(
        () => !cancelled && setState({ c, attempt, ok: true }),
        (err: unknown) => {
          console.error(err);
          if (!cancelled) setState({ c, attempt, ok: false });
        },
      )
      .finally(() => {
        const i = indexOfChar(c);
        const n = ALL.length;
        const next = ALL[(i + 1) % n];
        const prev = ALL[(i - 1 + n) % n];
        if (next && prev) prefetchCharData([next.c, prev.c]);
      });
    return () => {
      cancelled = true;
    };
  }, [c, attempt]);

  const retry = () => setAttempt((a) => a + 1);

  // The cache answers synchronously, so a cached character never shows a loading frame.
  const data = getCachedCharData(c);
  if (data) return { status: 'ready', data, retry };
  if (state?.c === c && state.attempt === attempt && !state.ok)
    return { status: 'error', data: null, retry };
  return { status: 'loading', data: null, retry };
}
