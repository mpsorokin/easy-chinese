// Ready-made character sets that can be printed in one click (they ignore HSK_MAX).
// Characters missing from the loaded HSK levels get their entry from presets/extra-chars.json;
// scripts/build-data.ts generates stroke data for those too.
import type { HskChar } from '../domain/types.ts';
import { EXTRA_CHARS, extraEntry, hskEntry } from './hsk.ts';

export type PrintPreset = {
  id: string;
  level: string; // label used in the PDF title, tags and file name
  chars: string[];
};

export const PRESET_EXTRA_CHARS: HskChar[] = EXTRA_CHARS;

export const PRINT_PRESETS: PrintPreset[] = [
  {
    id: 'hsk1-2',
    level: '1-2',
    chars: [
      ...'爱八爸百半比边不茶打大地的点对多儿二分哥个工口国过还汉好和很后会几家间叫姐今男九可来了两六妈吗么没们名那你年七去日三少上什生十时是书说四岁他她天同为文我五午习下小现写学要也一以有语月在长这中子女字作',
    ],
  },
];

// Entry for a printable character: HSK level data first, then the preset extras.
export const presetEntry = (c: string): HskChar | undefined =>
  hskEntry(c) ?? extraEntry(c);
