// User settings: defaults, allowed options and normalization of stored values.
// Option labels live in i18n (t.options).
import type { GridKind } from '../../domain/types.ts';

export type Settings = {
  grid: GridKind;
  strict: number;
  hint: number;
  speed: number;
};

export const DEFAULT_SETTINGS: Settings = {
  grid: 'mi', // 'tian' (4 lines) | 'mi' (8 lines)
  strict: 1, // HanziWriter leniency: higher is softer
  hint: 2, // show a hint after N mistakes on a stroke, 0 = never
  speed: 1, // Show and Hint animation speed: 1 = normal, lower is slower
};

// Allowed values, in the order shown in the settings UI.
export const SETTING_OPTIONS = {
  grid: ['tian', 'mi'],
  strict: [1.5, 1, 0.7],
  hint: [1, 2, 3, 0],
  speed: [0.5, 1],
} as const satisfies {
  readonly [K in keyof Settings]: readonly Settings[K][];
};

// Merges stored settings over defaults and drops invalid values.
// Older versions stored numbers as strings, so values are compared loosely by String().
export function normalizeSettings(stored: unknown): Settings {
  const src =
    stored !== null && typeof stored === 'object'
      ? (stored as Record<string, unknown>)
      : undefined;
  // Mapped-type view of SETTING_OPTIONS so OPTIONS[key] is typed per key.
  const OPTIONS: { readonly [K in keyof Settings]: readonly Settings[K][] } =
    SETTING_OPTIONS;
  const pick = <K extends keyof Settings>(key: K): Settings[K] => {
    const raw = src?.[key];
    const options = OPTIONS[key];
    return (
      options.find((v) => String(v) === String(raw)) ?? DEFAULT_SETTINGS[key]
    );
  };
  return {
    grid: pick('grid'),
    strict: pick('strict'),
    hint: pick('hint'),
    speed: pick('speed'),
  };
}
