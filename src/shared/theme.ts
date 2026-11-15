// Canvas and HanziWriter need concrete color values instead of CSS variables.
export type ColorScheme = 'light' | 'dark';

const light = {
  ink: '#1f1a17', // finished strokes, user paths
  drawing: '#2b2420', // stroke while the finger is down
  accent: '#c2412d', // current stroke in the stroke-order strip
  highlight: '#e0533d', // hint highlight
  good: '#2f8f5b', // character completed
  gridRgb: '217,130,109', // grid lines, alpha is set per use

  strokeDone: '#3a322c', // already written strokes in the stroke-order strip
  strokeTodo: '#ece4d6', // upcoming strokes in the stroke-order strip
  outlineSolid: '#cfc5b6',
  outlineRgb: '180,165,145', // faded outline, alpha = step outline value
  stepOutlineRgb: '190,178,160', // outline in step thumbnails
  stepBehindUser: 'rgba(200,190,175,.35)', // reference shape behind the user's paths
};

export type WritingColors = typeof light;

const dark: WritingColors = {
  ink: '#f4e9dc',
  drawing: '#fff6eb',
  accent: '#f3a18d',
  highlight: '#f9a28e',
  good: '#8bd2ae',
  gridRgb: '165,106,93',
  strokeDone: '#e5d3c3',
  strokeTodo: '#51453e',
  outlineSolid: '#716158',
  outlineRgb: '161,137,121',
  stepOutlineRgb: '158,133,118',
  stepBehindUser: 'rgba(158,133,118,.32)',
};

export const writingColors: Record<ColorScheme, WritingColors> = {
  light,
  dark,
};

export const rgba = (rgb: string, a: number) => `rgba(${rgb},${a})`;
