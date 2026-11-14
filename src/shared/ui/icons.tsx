const iconProps = {
  viewBox: '0 0 24 24',
  width: 24,
  height: 24,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
  focusable: 'false' as const,
};

export const PencilIcon = () => (
  <svg {...iconProps}>
    <path d="M4 20l1-4L16 5l3 3L8 19z" />
    <path d="M14 7l3 3" />
  </svg>
);

export const PrinterIcon = () => (
  <svg {...iconProps}>
    <path d="M7 9V4h10v5" />
    <rect x={3} y={9} width={18} height={8} rx={2} />
    <path d="M7 14h10v6H7z" />
  </svg>
);
