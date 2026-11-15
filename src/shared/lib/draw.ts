// Canvas drawing in the character data coordinate space (1024×1024, Y axis up).
import type { GridKind, StrokePaths } from '../../domain/types.ts';
import { rgba } from '../theme.ts';

// hanzi-writer-data glyphs live in a 1024 box with the baseline offset by 124,
// so the top of the em box is at y = 900.
const CHAR_BOX = 1024;
const CHAR_TOP = 900;
const MAX_DPR = 3;

const dpr = () => Math.min(window.devicePixelRatio || 1, MAX_DPR);

// Resizes the canvas for the device pixel ratio and returns a cleared context in CSS pixels.
export function prepCanvas(
  cv: HTMLCanvasElement,
  width: number,
  height = width,
) {
  const d = dpr();
  cv.width = Math.round(width * d);
  cv.height = Math.round(height * d);
  const ctx = cv.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context is unavailable');
  ctx.setTransform(d, 0, 0, d, 0, 0);
  ctx.clearRect(0, 0, width, height);
  return ctx;
}

// Dashed 田 (tian) or 米 (mi) grid.
export function drawGrid(
  ctx: CanvasRenderingContext2D,
  s: number,
  kind: GridKind,
  gridRgb: string,
  alpha = 0.5,
  h = s,
) {
  ctx.save();
  ctx.strokeStyle = rgba(gridRgb, alpha);
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(s / 2, 0);
  ctx.lineTo(s / 2, h);
  ctx.moveTo(0, h / 2);
  ctx.lineTo(s, h / 2);
  if (kind === 'mi') {
    ctx.moveTo(0, 0);
    ctx.lineTo(s, h);
    ctx.moveTo(s, 0);
    ctx.lineTo(0, h);
  }
  ctx.stroke();
  ctx.restore();
}

// Maps character data coordinates into a square cell of size s with padding pad.
export function toCharSpace(
  ctx: CanvasRenderingContext2D,
  s: number,
  pad: number,
) {
  const k = (s - 2 * pad) / CHAR_BOX;
  ctx.translate(pad, pad);
  ctx.scale(k, k);
  ctx.translate(0, CHAR_TOP);
  ctx.scale(1, -1);
}

// Fills strokes [from, to) given as SVG path strings.
export function fillStrokes(
  ctx: CanvasRenderingContext2D,
  strokes: readonly string[],
  from: number,
  to: number,
  color: string,
) {
  ctx.fillStyle = color;
  for (const d of strokes.slice(from, to)) ctx.fill(new Path2D(d));
}

// Draws the user's finger paths (arrays of {x, y} in character space).
export function drawUserPaths(
  ctx: CanvasRenderingContext2D,
  paths: Readonly<StrokePaths>,
  color: string,
  width = 42,
) {
  ctx.strokeStyle = color;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.lineWidth = width;
  for (const p of paths) {
    if (!p || p.length < 2) continue;
    ctx.beginPath();
    p.forEach(({ x, y }, k) => (k === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)));
    ctx.stroke();
  }
}
