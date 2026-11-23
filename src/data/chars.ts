import type { CharGroup } from '@/domain/types.ts';
import { extraEntry, hskEntry } from '@/data/hsk.ts';

// Every JSON file in ./decks is a deck: an array of groups (picker tabs).
// Decks are concatenated in file-name order, hence the numeric prefixes.
// Contents are validated by chars.test.ts, not at runtime.
const decks = import.meta.glob<CharGroup[]>('./decks/*.json', {
  eager: true,
  import: 'default',
});

type CharListItem = CharGroup['items'][number] & { g: number };

export const CHAR_GROUPS: CharGroup[] = Object.keys(decks)
  .sort()
  .flatMap((file) => decks[file] ?? []);

// Flat list: { c, py, en, g }, where g is the group index.
export const ALL: CharListItem[] = CHAR_GROUPS.flatMap((group, g) =>
  group.items.map((it) => ({ ...it, g })),
);

if (ALL.length === 0) throw new Error('src/data/decks has no characters');

// Entry at index i of a non-empty list, wrapping around both ends
// (so prev/next navigation never falls off).
export function wrapAt<T>(list: readonly T[], i: number): T {
  const n = list.length;
  return list[((i % n) + n) % n]!;
}

// Character opened on the very first launch.
const DEFAULT_CHAR = '人';

// Last opened character from storage (a deck or HSK character);
// unknown values fall back to DEFAULT_CHAR.
export const normalizeLastChar = (raw: unknown): string =>
  typeof raw === 'string' &&
  (ALL.some((x) => x.c === raw) ||
    hskEntry(raw) !== undefined ||
    extraEntry(raw) !== undefined)
    ? raw
    : DEFAULT_CHAR;

export const indexOfChar = (c: string) =>
  Math.max(
    0,
    ALL.findIndex((x) => x.c === c),
  );
