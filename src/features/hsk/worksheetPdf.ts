// Builds the HSK writing worksheet as an A4 PDF. Per character: a header with the model
// in a grid cell, pinyin, meaning, HSK words and stroke count; a stroke-order strip;
// then practice rows, the first starting with traced copies.
// Characters are vector paths from stroke data. Header text is rendered by the browser
// (`renderText`, system fonts, so tone marks and Chinese words work) and embedded as
// images; numbers use the built-in Helvetica, so no font is embedded.
// Layout follows the original single-file worksheet: three characters with three
// practice rows fit one page. With one or two practice rows the spacing tightens
// (cells keep their size), so five or four characters fit a page.
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import type { PDFFont, PDFImage, PDFPage, RGB } from 'pdf-lib';
import type { GridKind, HskChar } from '../../domain/types.ts';
import { t } from '../../shared/i18n/en.ts';
import type { PrintOptions } from './printOptions.ts';

// words: HSK words with the character, printed under its meaning.
export type WorksheetRow = {
  entry: HskChar;
  words: string[];
  strokes: string[];
};

export type TextLine = {
  text: string;
  size: number; // pt
  weight?: number;
  color?: string; // CSS color
  spacing?: number; // extra space after each character, pt
};
// A PNG of the lines (stacked, line height 1.3) and its size in pt.
export type TextImage = { png: Uint8Array; width: number; height: number };
export type RenderText = (
  lines: TextLine[],
  align: 'left' | 'right',
) => Promise<TextImage>;

// Geometry in pt (A4), distances measured from the top of the page.
const PW = 595.28;
const PH = 841.89;
const ML = 40;
const MR = 40;
const MT = 30;
const MB = 32;
const CW = PW - ML - MR;
const COLS = 12;
const GAP = 3;
const CELL = (CW - GAP * (COLS - 1)) / COLS;
const SB = 36; // stroke-order cell
const SGAP = 4;
const SCOLS = Math.floor((CW + SGAP) / (SB + SGAP));
// Vertical spacing of a character block.
type Spacing = {
  head: number; // model cell in the header
  headGap: number; // header -> stroke-order label
  lbl: number; // "STROKE ORDER" label
  stripGap: number; // stroke order -> practice rows
  blockGap: number; // between character blocks
};
const REGULAR: Spacing = {
  head: 42,
  headGap: 8,
  lbl: 13,
  stripGap: 6,
  blockGap: 16,
};
// 4 x 2 rows: 4 * 183.4 + 3 * 10 = 763.5 <= 779.9 available (strokes on one strip row).
const COMPACT: Spacing = {
  head: 38,
  headGap: 6,
  lbl: 11,
  stripGap: 5,
  blockGap: 10,
};
const spacingFor = (rows: number) => (rows <= 2 ? COMPACT : REGULAR);
const GLYPH_PAD = 0.085; // glyph inset, share of the cell size

const C = {
  border: rgb(0.85, 0.64, 0.59),
  dash: rgb(0.9, 0.74, 0.7),
  ink: rgb(0.12, 0.1, 0.09),
  prev: rgb(0.86, 0.8, 0.69),
  cur: rgb(0.76, 0.16, 0.12),
  trace1: rgb(0.66, 0.66, 0.66),
  trace2: rgb(0.84, 0.84, 0.84),
  num: rgb(0.69, 0.6, 0.54),
};

// Stroke data is y-up (em box -124..900); pdf-lib's drawSvgPath flips y, so negate it back.
// The data only uses absolute M/L/Q/C/Z, i.e. numbers come in x,y pairs.
const flipY = (d: string) => {
  let i = 0;
  return d.replace(/-?\d*\.?\d+(?:e[-+]?\d+)?/gi, (n) =>
    i++ % 2 ? String(-Number(n)) : n,
  );
};

const blockHeight = (strokes: number, rows: number, s: Spacing) =>
  s.head +
  s.headGap +
  s.lbl +
  Math.ceil(strokes / SCOLS) * (SB + SGAP) +
  s.stripGap +
  rows * (CELL + GAP) -
  GAP;

export async function buildWorksheetPdf(
  rows: WorksheetRow[],
  options: PrintOptions,
  renderText: RenderText,
  level = '1',
): Promise<{ bytes: Uint8Array; pages: number }> {
  const pdf = await PDFDocument.create();
  const helvetica = await pdf.embedFont(StandardFonts.Helvetica);
  pdf.setTitle(t.pdfTitle(level), { showInWindowTitleBar: true });
  pdf.setLanguage('en');

  // Same text -> same embedded image (the label and the stroke-count tags repeat).
  const images = new Map<string, Promise<PlacedImage>>();
  const image = (lines: TextLine[], align: 'left' | 'right' = 'left') => {
    const key = JSON.stringify([lines, align]);
    let img = images.get(key);
    if (!img) {
      img = renderText(lines, align).then(async (t) => ({
        img: await pdf.embedPng(t.png),
        width: t.width,
        height: t.height,
      }));
      images.set(key, img);
    }
    return img;
  };
  const label = await image([
    {
      text: t.printStrokeOrder.toUpperCase(),
      size: 6.6,
      weight: 700,
      color: '#5a4a3e',
      spacing: 1.1,
    },
  ]);

  const spacing = spacingFor(options.rows);
  let page = pdf.addPage([PW, PH]);
  let top = MT;
  for (const row of rows) {
    const height = blockHeight(row.strokes.length, options.rows, spacing);
    if (top > MT && top + height > PH - MB) {
      page = pdf.addPage([PW, PH]);
      top = MT;
    }
    const { entry, words, strokes } = row;
    const n = strokes.length;
    const header = await image([
      { text: entry.py, size: 13, weight: 700 },
      { text: entry.en, size: 8.8, color: '#6f6457' },
      ...(words.length
        ? [{ text: t.printWords(words, level), size: 7.4, color: '#9a8f82' }]
        : []),
    ]);
    const tag = await image(
      [
        {
          text: t.printTag(n, level).toUpperCase(),
          size: 7,
          color: '#857a6c',
          spacing: 0.9,
        },
      ],
      'right',
    );
    drawBlock(page, row, options, spacing, top, {
      header,
      tag,
      label,
      helvetica,
    });
    top += height + spacing.blockGap;
  }

  // Page numbers "p / N" at the bottom right.
  const pages = pdf.getPages();
  pages.forEach((p, i) => {
    const text = `${i + 1} / ${pages.length}`;
    p.drawText(text, {
      x: PW - MR - helvetica.widthOfTextAtSize(text, 7),
      y: 16,
      size: 7,
      font: helvetica,
      color: C.num,
    });
  });

  return { bytes: await pdf.save(), pages: pages.length };
}

type PlacedImage = { img: PDFImage; width: number; height: number };

function drawBlock(
  page: PDFPage,
  { strokes }: WorksheetRow,
  { rows, grid }: PrintOptions,
  s: Spacing,
  top: number,
  r: {
    header: PlacedImage;
    tag: PlacedImage;
    label: PlacedImage;
    helvetica: PDFFont;
  },
) {
  const n = strokes.length;
  const placeImage = (im: PlacedImage, x: number, t: number) =>
    page.drawImage(im.img, {
      x,
      y: PH - t - im.height,
      width: im.width,
      height: im.height,
    });

  // Header: model, text block centered on it, stroke-count tag on the right.
  let t = top;
  drawCell(page, grid, ML, t, s.head);
  drawGlyph(page, strokes, () => C.ink, ML, t, s.head);
  placeImage(r.header, ML + s.head + 10, t + s.head / 2 - r.header.height / 2);
  placeImage(r.tag, PW - MR - r.tag.width, t + s.head / 2 - r.tag.height / 2);
  t += s.head + s.headGap;

  // Stroke order: earlier strokes in beige, the current one in red, number in the corner.
  placeImage(r.label, ML, t);
  t += s.lbl;
  for (let i = 0; i < n; i++) {
    const x = ML + (i % SCOLS) * (SB + SGAP);
    const tt = t + Math.floor(i / SCOLS) * (SB + SGAP);
    drawCell(page, grid, x, tt, SB);
    drawGlyph(
      page,
      strokes.slice(0, i + 1),
      (j) => (j === i ? C.cur : C.prev),
      x,
      tt,
      SB,
    );
    page.drawText(String(i + 1), {
      x: x + 1.8,
      y: PH - tt - 6.4,
      size: 5.2,
      font: r.helvetica,
      color: C.num,
    });
  }
  t += Math.ceil(n / SCOLS) * (SB + SGAP) + s.stripGap;

  // Practice rows; the first starts with three dark and two light traced copies.
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < COLS; col++) {
      const x = ML + col * (CELL + GAP);
      const tt = t + row * (CELL + GAP);
      drawCell(page, grid, x, tt, CELL);
      if (row === 0 && col < 5) {
        const color = col < 3 ? C.trace1 : C.trace2;
        drawGlyph(page, strokes, () => color, x, tt, CELL);
      }
    }
  }
}

// Writing cell with its top-left corner at (x, t from the top): solid border and dashed
// guides (田: cross, 米: cross + diagonals).
function drawCell(
  page: PDFPage,
  grid: GridKind,
  x: number,
  t: number,
  size: number,
) {
  const y = PH - t - size; // bottom edge
  const guide = (sx: number, sy: number, ex: number, ey: number) =>
    page.drawLine({
      start: { x: sx, y: sy },
      end: { x: ex, y: ey },
      thickness: 0.45,
      color: C.dash,
      dashArray: [1.6, 1.6],
    });
  const h = size / 2;
  guide(x + h, y, x + h, y + size);
  guide(x, y + h, x + size, y + h);
  if (grid === 'mi') {
    guide(x, y, x + size, y + size);
    guide(x, y + size, x + size, y);
  }
  page.drawRectangle({
    x,
    y,
    width: size,
    height: size,
    borderColor: C.border,
    borderWidth: 0.8,
  });
}

// Strokes inside the cell at (x, t from the top), inset by GLYPH_PAD.
function drawGlyph(
  page: PDFPage,
  strokes: string[],
  color: (i: number) => RGB,
  x: number,
  t: number,
  size: number,
) {
  const pad = size * GLYPH_PAD;
  const k = (size - 2 * pad) / 1024;
  const baseline = PH - t - pad - 900 * k;
  strokes.forEach((d, i) =>
    page.drawSvgPath(flipY(d), {
      x: x + pad,
      y: baseline,
      scale: k,
      color: color(i),
    }),
  );
}
