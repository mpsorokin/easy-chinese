import { t } from '@/shared/i18n/en.ts';
import { useTheme } from '@/features/settings/useTheme.ts';

const icons = {
  light: (
    <>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1.5 1.5m11 11L19 19M5 19l1.5-1.5m11-11L19 5" />
    </>
  ),
  dark: <path d="M20.9 13.3A9 9 0 0 1 10.7 3.1a9 9 0 1 0 10.2 10.2Z" />,
};

export default function ThemeControl() {
  const { resolved, setPreference } = useTheme();
  const dark = resolved === 'dark';

  return (
    <button
      type="button"
      className="theme-control"
      role="switch"
      aria-checked={dark}
      aria-label={t.darkTheme}
      title={t.darkTheme}
      onClick={() => setPreference(dark ? 'light' : 'dark')}
    >
      {Object.entries(icons).map(([theme, icon]) => (
        <svg
          key={theme}
          className={theme === resolved ? 'is-active' : undefined}
          aria-hidden="true"
          viewBox="0 0 24 24"
          width="17"
          height="17"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {icon}
        </svg>
      ))}
    </button>
  );
}
