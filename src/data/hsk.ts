// HSK levels and their data: characters, words and themed lessons (src/data/hsk/<level>/*.json,
// imported from the official 2025 syllabus by scripts/import-hsk.ts), plus lookups.
import type { CharEntry, HskChar, HskWord, Lesson } from '../domain/types.ts';
import hsk1Chars from './hsk/1/chars.json';
import hsk1Words from './hsk/1/words.json';
import hsk1Lessons from './hsk/1/lessons.json';

// Everything the app knows about one level.
export type LevelData = {
  id: string;
  chars: HskChar[]; // recognition characters, official order (by pinyin)
  words: HskWord[];
  lessons: Lesson[];
};

// Syllabus figures for every level (《HSK 考试大纲》, 2025); `data` only where lessons exist.
export type HskLevel = {
  id: string; // '1'…'6', '7-9'; used in URLs
  words: number;
  chars: number;
  data?: LevelData;
};

export const HSK1_LEVEL: LevelData = {
  id: '1',
  chars: hsk1Chars,
  words: hsk1Words,
  lessons: hsk1Lessons,
};

export const HSK_LEVELS: HskLevel[] = [
  { id: '1', words: 300, chars: 246, data: HSK1_LEVEL },
  { id: '2', words: 200, chars: 125 },
  { id: '3', words: 500, chars: 284 },
  { id: '4', words: 1000, chars: 441 },
  { id: '5', words: 1600, chars: 431 },
  { id: '6', words: 1800, chars: 413 },
  { id: '7-9', words: 5600, chars: 1148 },
];

export const levelData = (id: string | undefined) =>
  HSK_LEVELS.find((l) => l.id === id)?.data;

export const HSK1 = HSK1_LEVEL.chars;

// Most characters that can be chosen at once (Write / Print PDF).
export const HSK_MAX = 50;

const byChar = new Map(
  HSK_LEVELS.slice()
    .reverse()
    .flatMap((level) =>
      (level.data?.chars ?? []).map((e) => [e.c, e] as const),
    ),
);
export const hskEntry = (c: string) => byChar.get(c);

// Copybook entry for an HSK character: same fields as a deck entry.
export const hskCharEntry = (e: HskChar): CharEntry => ({
  c: e.c,
  py: e.py,
  en: e.en,
});

// Words containing the character, in level list order.
export const wordsWith = (c: string, level = HSK1_LEVEL): string[] =>
  level.words.filter((w) => w.w.includes(c)).map((w) => w.w);

// Words practised in a lesson (0-based index): those that become readable with it, i.e. that use
// at least one of its characters and otherwise only characters of earlier lessons.
// Words with characters outside the level's list (饺子, 饭店) are left out of the lessons.
export function lessonWords(level: LevelData, idx: number): HskWord[] {
  const lessonOf = new Map<string, number>();
  level.lessons.forEach((l, i) => l.chars.forEach((c) => lessonOf.set(c, i)));
  return level.words.filter((w) => {
    let last = -1;
    for (const c of w.w) {
      const i = lessonOf.get(c);
      if (i === undefined) return false;
      last = Math.max(last, i);
    }
    return last === idx;
  });
}

export const lessonChars = (level: LevelData, idx: number): HskChar[] => {
  const map = new Map(level.chars.map((e) => [e.c, e]));
  return (level.lessons[idx]?.chars ?? []).flatMap((c) => map.get(c) ?? []);
};

// Pinyin without tone marks, lower case: "nǚ" -> "nu".
export const toneless = (py: string) =>
  py.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

// Sections by the first letter of pinyin, A–Z, keeping list order inside a section.
export function byLetter(list: HskChar[]) {
  const map = new Map<string, HskChar[]>();
  for (const e of list) {
    const letter = toneless(e.py).charAt(0).toUpperCase();
    const items = map.get(letter);
    if (items) items.push(e);
    else map.set(letter, [e]);
  }
  return [...map]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([letter, items]) => ({ letter, items }));
}

const HAN = /\p{Script=Han}/u;

// Query with Chinese characters: the HSK ones among them, in typed order (paste mode).
// Otherwise: pinyin prefix (with or without tones) or a substring of the meaning.
export function searchHsk(query: string, level = HSK1_LEVEL): HskChar[] {
  const q = query.trim().toLowerCase();
  if (!q) return level.chars;
  if (HAN.test(q)) {
    const entries = new Map(level.chars.map((e) => [e.c, e]));
    const chars = [...new Set(Array.from(q))];
    return chars.flatMap((c) => entries.get(c) ?? []);
  }
  const plain = toneless(q).replace(/\s+/g, '');
  return level.chars.filter(
    (e) =>
      e.py.toLowerCase().startsWith(q) ||
      toneless(e.py).startsWith(plain) ||
      e.en.toLowerCase().includes(q),
  );
}

// Stored character list: known HSK characters only, no duplicates, at most HSK_MAX.
export const normalizeHskChars = (raw: unknown, level?: LevelData): string[] =>
  Array.isArray(raw)
    ? [
        ...new Set(
          raw.filter(
            (c): c is string =>
              typeof c === 'string' &&
              (level ? level.chars.some((e) => e.c === c) : byChar.has(c)),
          ),
        ),
      ].slice(0, HSK_MAX)
    : [];
