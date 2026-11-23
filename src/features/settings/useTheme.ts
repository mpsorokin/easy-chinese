import { createContext, useContext } from 'react';
import type { ColorScheme } from '@/shared/theme.ts';

export type ThemePreference = ColorScheme | 'system';

export function normalizeTheme(raw: unknown): ThemePreference {
  return raw === 'light' || raw === 'dark' ? raw : 'system';
}

export const ThemeContext = createContext<{
  resolved: ColorScheme;
  setPreference: (preference: ThemePreference) => void;
}>({ resolved: 'light', setPreference: () => {} });

export const useTheme = () => useContext(ThemeContext);
