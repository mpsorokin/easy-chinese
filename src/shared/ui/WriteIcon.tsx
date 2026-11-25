// Line icons on a 24 × 24 grid, drawn with the current text color. Most are Tabler icons
// (MIT, see ./icons-LICENSE).
const paths = {
  back: 'M5 12h14M5 12l7 7m-7-7 7-7',
  chevron: 'M9 6l6 6-6 6',
  check: 'M5 12l4 4L19 6',
  pencil: 'M4 20l1-4L16 5l3 3L8 19zM14 7l3 3',
  printer:
    'M7 9V4h10v5M5 9h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM7 14h10v6H7z',
  volume: 'M15 8a5 5 0 0 1 0 8m2.7-11a9 9 0 0 1 0 14M5 9v6h4l5 4V5L9 9z',
  layers: 'm12 3 9 5-9 5-9-5 9-5m-9 9 9 5 9-5M3 16l9 5 9-5',
  info: 'M12 11v5m0-8h.01M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0',
  search: 'M4 10a6 6 0 1 0 12 0 6 6 0 1 0-12 0m10.5 4.5L20 20',
  play: 'M8 5v14l11-7z',
  pause: 'M9 5v14m6-14v14',
  'skip-back': 'M6 5v14m12-14v14L8 12z',
  'skip-next': 'M18 5v14M6 5v14l10-7z',
  hint: 'M9 18h6m-5 3h4M9 15a6 6 0 1 1 6 0',
  restart: 'M20 4v5h-5m5 4a8 8 0 1 1-2.3-6.7L20 9',
  settings:
    'M10 4h4l.6 2.5 2 .9 2.2-.9 2 3.5-1.6 1.7v1.6l1.6 1.7-2 3.5-2.2-.9-2 .9-.6 2.5h-4l-.6-2.5-2-.9-2.2.9-2-3.5 1.6-1.7v-1.6L3.2 10l2-3.5 2.2.9 2-.9L10 4zM9.5 12.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0',
  book: 'M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0M3 6v13M12 6v13M21 6v13',
  brush:
    'M3 21v-4a4 4 0 1 1 4 4h-4M21 3a16 16 0 0 0-12.8 10.2M21 3a16 16 0 0 1-10.2 12.8M10.6 9a9 9 0 0 1 4.4 4.4',
  target:
    'M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0M12 7a5 5 0 1 0 5 5M13 3.055a9 9 0 1 0 7.941 7.945M15 6v3h3l3-3h-3v-3l-3 3M15 9l-3 3',
  eye: 'M10 12a2 2 0 1 0 4 0a2 2 0 0 0-4 0M21 12c-2.4 4-5.4 6-9 6s-6.6-2-9-6c2.4-4 5.4-6 9-6s6.6 2 9 6',
  'eye-off':
    'M3 3l18 18M10.584 10.587a2 2 0 0 0 2.828 2.829M9.363 5.365a9.466 9.466 0 0 1 2.637-.365c4 0 7.333 2.333 10 7c-.778 1.361-1.612 2.524-2.503 3.488m-2.14 1.861c-1.631 1.1-3.417 1.651-5.357 1.651c-4 0-7.333-2.333-10-7c1.369-2.395 2.913-4.175 4.632-5.341',
  lock: 'M12 2a5 5 0 0 1 5 5v3a3 3 0 0 1 3 3v6a3 3 0 0 1-3 3h-10a3 3 0 0 1-3-3v-6a3 3 0 0 1 3-3v-3a5 5 0 0 1 5-5m0 12a2 2 0 0 0-1.995 1.85l-.005.15a2 2 0 1 0 2-2m0-10a3 3 0 0 0-3 3v3h6v-3a3 3 0 0 0-3-3',
};

// Solid shapes: filled; the lock has no outline at all.
const filled: ReadonlySet<string> = new Set(['play', 'lock']);

type IconName = keyof typeof paths;

export default function WriteIcon({
  name,
  strokeWidth = 2,
  className,
}: {
  name: IconName;
  strokeWidth?: number;
  className?: string;
}) {
  return (
    <svg
      className={`write-icon write-icon-${name}${className ? ` ${className}` : ''}`}
      viewBox="0 0 24 24"
      fill={filled.has(name) ? 'currentColor' : 'none'}
      stroke={name === 'lock' ? 'none' : 'currentColor'}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={paths[name]} />
    </svg>
  );
}
