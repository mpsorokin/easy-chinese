// Canvas and HanziWriter colors. CSS colors live in styles.css (:root variables).

export const COLORS = {
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

export const rgba = (rgb: string, a: number) => `rgba(${rgb},${a})`;

export const LAYOUT = {
  maxWidth: 520, // app column width in CSS px; cell sizes are derived from it
};
