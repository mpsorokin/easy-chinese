import { describe, expect, it } from 'vitest';
import {
  DEFAULT_PRINT_OPTIONS,
  normalizePrintOptions,
} from './printOptions.ts';

describe('normalizePrintOptions', () => {
  it('keeps valid options', () => {
    expect(normalizePrintOptions({ rows: 3, grid: 'mi' })).toEqual({
      rows: 3,
      grid: 'mi',
    });
  });

  it('falls back to defaults for missing or invalid values', () => {
    expect(normalizePrintOptions(undefined)).toEqual(DEFAULT_PRINT_OPTIONS);
    expect(normalizePrintOptions({ rows: 9, grid: 'x' })).toEqual(
      DEFAULT_PRINT_OPTIONS,
    );
    expect(normalizePrintOptions({ rows: '2', grid: 'tian' })).toEqual({
      rows: DEFAULT_PRINT_OPTIONS.rows,
      grid: 'tian',
    });
  });
});
