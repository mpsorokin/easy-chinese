// Domain types shared by data, features and shared code. Pure TypeScript, no React.
import type { Point } from 'hanzi-writer';

// One character in the study list.
export type CharEntry = {
  c: string; // the character itself
  py: string; // pinyin
  en: string; // English meaning
};

export type CharGroup = {
  name: string;
  items: CharEntry[];
};

// Writing-cell grid: 田 (4 lines) or 米 (8 lines).
export type GridKind = 'tian' | 'mi';

// The user's finger path per stroke in character data coordinates;
// undefined for a stroke that was not drawn (e.g. auto-completed after misses).
export type StrokePaths = (Point[] | undefined)[];

// One character of an HSK level (English meaning, as on the HSK pages).
export type HskChar = {
  c: string;
  py: string;
  en: string;
};

// One word of an HSK level; may contain characters from outside the level's list.
export type HskWord = {
  w: string;
  py: string;
  en: string;
};

// A themed lesson of an HSK level: each character of the level is in exactly one lesson.
export type Lesson = {
  id: number; // 1-based, as in URLs
  title: string; // English
  chars: string[];
};
