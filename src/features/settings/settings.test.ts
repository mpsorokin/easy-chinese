import { describe, expect, it } from 'vitest';
import {
  DEFAULT_SETTINGS,
  normalizeSettings,
} from '@/features/settings/settings.ts';

describe('normalizeSettings', () => {
  it('returns defaults for empty stored object', () => {
    expect(normalizeSettings({})).toEqual(DEFAULT_SETTINGS);
  });

  it('drops unknown values', () => {
    expect(normalizeSettings({ grid: 'unknown', strict: 999 })).toEqual(
      DEFAULT_SETTINGS,
    );
  });

  it('accepts numeric options saved as strings', () => {
    expect(normalizeSettings({ strict: '0.7', hint: '1' })).toEqual({
      ...DEFAULT_SETTINGS,
      strict: 0.7,
      hint: 1,
    });
  });
});
