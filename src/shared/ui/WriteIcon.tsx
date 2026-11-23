// Line icons on a 24 × 24 grid, drawn with the current text color.
const paths = {
  back: 'M5 12h14M5 12l7 7m-7-7 7-7',
  chevron: 'M9 6l6 6-6 6',
  pencil: 'M4 20l1-4L16 5l3 3L8 19zM14 7l3 3',
  printer:
    'M7 9V4h10v5M5 9h14a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4a2 2 0 0 1 2-2zM7 14h10v6H7z',
  volume: 'M15 8a5 5 0 0 1 0 8m2.7-11a9 9 0 0 1 0 14M5 9v6h4l5 4V5L9 9z',
  layers: 'm12 3 9 5-9 5-9-5 9-5m-9 9 9 5 9-5M3 16l9 5 9-5',
  info: 'M12 11v5m0-8h.01M3 12a9 9 0 1 0 18 0 9 9 0 0 0-18 0',
  play: 'M8 5v14l11-7z',
  hint: 'M9 18h6m-5 3h4M9 15a6 6 0 1 1 6 0',
  restart: 'M20 4v5h-5m5 4a8 8 0 1 1-2.3-6.7L20 9',
  settings:
    'M10 4h4l.6 2.5 2 .9 2.2-.9 2 3.5-1.6 1.7v1.6l1.6 1.7-2 3.5-2.2-.9-2 .9-.6 2.5h-4l-.6-2.5-2-.9-2.2.9-2-3.5 1.6-1.7v-1.6L3.2 10l2-3.5 2.2.9 2-.9L10 4zM9.5 12.5a2.5 2.5 0 1 0 5 0 2.5 2.5 0 0 0-5 0',
};

type IconName = keyof typeof paths;

export default function WriteIcon({
  name,
  strokeWidth = 2,
}: {
  name: IconName;
  strokeWidth?: number;
}) {
  return (
    <svg
      className={`write-icon write-icon-${name}`}
      viewBox="0 0 24 24"
      fill={name === 'play' ? 'currentColor' : 'none'}
      stroke="currentColor"
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
