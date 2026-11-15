import { createContext, useContext } from 'react';
import type { ColorScheme } from '../../shared/theme.ts';

export const themePreferences = ['system', 'light', 'dark'] as const;
export type ThemePreference = (typeof themePreferences)[number];

export function normalizeTheme(raw: unknown): ThemePreference {
  return raw === 'light' || raw === 'dark' ? raw : 'system';
}

export const ThemeContext = createContext<{
  preference: ThemePreference;
  resolved: ColorScheme;
  setPreference: (preference: ThemePreference) => void;
}>({ preference: 'system', resolved: 'light', setPreference: () => {} });

export const useTheme = () => useContext(ThemeContext);
