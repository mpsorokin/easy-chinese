import { t } from '../../shared/i18n/en.ts';
import { normalizeTheme, themePreferences, useTheme } from './useTheme.ts';

const icons = {
  system: (
    <>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8m-4-4v4" />
    </>
  ),
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  dark: <path d="M20.9 13.3A9 9 0 0 1 10.7 3.1a9 9 0 1 0 10.2 10.2Z" />,
};

export default function ThemeControl() {
  const { preference, setPreference } = useTheme();

  return (
    <span className="theme-control">
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        width="20"
        height="20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {icons[preference]}
      </svg>
      <select
        aria-label={t.colorTheme}
        title={t.colorTheme}
        value={preference}
        onChange={(event) =>
          setPreference(normalizeTheme(event.currentTarget.value))
        }
      >
        {themePreferences.map((value) => (
          <option key={value} value={value}>
            {t.themePreferences[value]}
          </option>
        ))}
      </select>
    </span>
  );
}
