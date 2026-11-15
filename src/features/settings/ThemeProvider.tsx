import { useLayoutEffect, useSyncExternalStore } from 'react';
import type { ReactNode } from 'react';
import { usePersistentState } from '../../shared/hooks/usePersistentState.ts';
import { createStore } from '../../shared/lib/storage.ts';
import { normalizeTheme, ThemeContext } from './useTheme.ts';
import type { ThemePreference } from './useTheme.ts';

const store = createStore<{ theme: ThemePreference }>('hanzi:');
const systemScheme = '(prefers-color-scheme: dark)';
const prefersDark = () => window.matchMedia(systemScheme).matches;

function subscribeToSystemScheme(notify: () => void) {
  const media = window.matchMedia(systemScheme);
  media.addEventListener('change', notify);
  return () => media.removeEventListener('change', notify);
}

export default function ThemeProvider({ children }: { children: ReactNode }) {
  const [preference, setPreference] = usePersistentState(
    store,
    'theme',
    normalizeTheme,
  );
  const systemDark = useSyncExternalStore(subscribeToSystemScheme, prefersDark);
  const resolved =
    preference === 'system' ? (systemDark ? 'dark' : 'light') : preference;

  useLayoutEffect(() => {
    const root = document.documentElement;
    root.dataset.theme = resolved;
    const themeColor = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]',
    );
    if (themeColor) {
      themeColor.content = getComputedStyle(root)
        .getPropertyValue('--paper')
        .trim();
    }
  }, [resolved]);

  return (
    <ThemeContext.Provider value={{ preference, resolved, setPreference }}>
      {children}
    </ThemeContext.Provider>
  );
}
