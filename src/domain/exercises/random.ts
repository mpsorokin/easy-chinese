// Random picks for building questions. Randomness comes in as `rng` (Math.random by
// default) so tests can fix it.
import type { Rng } from '@/domain/exercises/types.ts';

export function shuffle<T>(list: readonly T[], rng: Rng = Math.random): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

// `n` distinct values from `pool` (in priority order: earlier sources first, each shuffled),
// skipping `exclude` and duplicates.
export function pick(
  sources: readonly (readonly string[])[],
  n: number,
  exclude: ReadonlySet<string>,
  rng: Rng,
): string[] {
  const out: string[] = [];
  const seen = new Set(exclude);
  for (const src of sources)
    for (const v of shuffle(src, rng)) {
      if (out.length >= n) return out;
      if (seen.has(v)) continue;
      seen.add(v);
      out.push(v);
    }
  return out;
}

// Options with the right answer at a random place.
export function choice(
  right: string,
  wrong: string[],
  rng: Rng,
): { options: string[]; answer: number } {
  const options = shuffle([right, ...wrong], rng);
  return { options, answer: options.indexOf(right) };
}
