import { describe, expect, it } from 'vitest';
import {
  PRESET_EXTRA_CHARS,
  PRINT_PRESETS,
  presetEntry,
} from '@/data/presets.ts';
import { hskEntry } from '@/data/hsk.ts';

describe('print presets', () => {
  it('has the 99-character HSK 1-2 set', () => {
    const p = PRINT_PRESETS.find((x) => x.id === 'hsk1-2');
    expect(p?.chars).toHaveLength(99);
    expect(new Set(p?.chars).size).toBe(99);
  });

  it('has an entry for every preset character', () => {
    const missing = PRINT_PRESETS.flatMap((p) => p.chars).filter(
      (c) => !presetEntry(c)?.py,
    );
    expect(missing).toEqual([]);
  });

  it('keeps extras only for characters missing from the HSK data', () => {
    expect(PRESET_EXTRA_CHARS.filter((e) => hskEntry(e.c))).toEqual([]);
  });
});
