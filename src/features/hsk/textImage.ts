// Renders worksheet text with the browser's system fonts into a PNG (as in the original
// single-file worksheet): pinyin tone marks and Chinese words need no embedded font.
import type { TextImage, TextLine } from './worksheetPdf.ts';

const SCALE = 5; // canvas pixels per pt: sharp in print
const FONT_FAMILY =
  'system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "PingFang SC", "Noto Sans CJK SC", "Microsoft YaHei", sans-serif';
const LINE_HEIGHT = 1.3;

const font = (l: TextLine) =>
  `${l.weight ?? 400} ${l.size * SCALE}px ${FONT_FAMILY}`;

export async function textImage(
  lines: TextLine[],
  align: 'left' | 'right',
): Promise<TextImage> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D is not available');

  // Letter-spaced lines are measured and drawn character by character.
  const widthOf = (l: TextLine) => {
    ctx.font = font(l);
    if (!l.spacing) return ctx.measureText(l.text).width;
    let w = 0;
    for (const ch of l.text) w += ctx.measureText(ch).width + l.spacing * SCALE;
    return w;
  };
  const widths = lines.map(widthOf);
  const W = Math.ceil(Math.max(0, ...widths) + 4);
  const H = Math.ceil(
    lines.reduce((h, l) => h + l.size * LINE_HEIGHT * SCALE, 0) + 2,
  );
  canvas.width = W;
  canvas.height = H;

  ctx.textBaseline = 'alphabetic';
  let y = 0;
  lines.forEach((l, i) => {
    ctx.font = font(l);
    ctx.fillStyle = l.color ?? '#1f1a17';
    let x = align === 'right' ? W - 2 - (widths[i] ?? 0) : 1;
    const base = y + l.size * SCALE * 1.02;
    if (l.spacing) {
      for (const ch of l.text) {
        ctx.fillText(ch, x, base);
        x += ctx.measureText(ch).width + l.spacing * SCALE;
      }
    } else ctx.fillText(l.text, x, base);
    y += l.size * LINE_HEIGHT * SCALE;
  });

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/png'),
  );
  if (!blob) throw new Error('Could not render worksheet text');
  return {
    png: new Uint8Array(await blob.arrayBuffer()),
    width: W / SCALE,
    height: H / SCALE,
  };
}
