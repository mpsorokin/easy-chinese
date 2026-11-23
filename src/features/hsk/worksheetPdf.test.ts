import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { PDFDocument } from 'pdf-lib';
import type { CharacterJson } from 'hanzi-writer';
import { hskEntry, wordsWith } from '@/data/hsk.ts';
import { charFile } from '@/domain/charFile.ts';
import { buildWorksheetPdf } from '@/features/hsk/worksheetPdf.ts';
import type { RenderText, WorksheetRow } from '@/features/hsk/worksheetPdf.ts';
import type { PrintOptions } from '@/features/hsk/printOptions.ts';

// renderText runs in the browser (canvas); a 1x1 PNG stands in for it here.
const PNG = Uint8Array.from(
  atob(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==',
  ),
  (c) => c.charCodeAt(0),
);
const renderText: RenderText = (lines) =>
  Promise.resolve({ png: PNG, width: 40, height: lines.length * 10 });

const rows = (chars: string): WorksheetRow[] =>
  Array.from(chars).map((c) => {
    const entry = hskEntry(c);
    if (!entry) throw new Error(`not in HSK 1: ${c}`);
    const data = JSON.parse(
      readFileSync(`public/hanzi/${charFile(c)}`, 'utf8'),
    ) as CharacterJson;
    return { entry, words: wordsWith(c), strokes: data.strokes };
  });

const pageCount = async (chars: string, options: PrintOptions) => {
  const { bytes, pages } = await buildWorksheetPdf(
    rows(chars),
    options,
    renderText,
  );
  const doc = await PDFDocument.load(bytes);
  expect(doc.getPageCount()).toBe(pages);
  return { pages, title: doc.getTitle() };
};

describe('buildWorksheetPdf', () => {
  it('fits three characters with three practice rows on one A4 page', async () => {
    expect(await pageCount('再见明', { rows: 3, grid: 'mi' })).toEqual({
      pages: 1,
      title: 'HSK 1 Writing Worksheet',
    });
    expect(
      (await pageCount('再见明天下了', { rows: 3, grid: 'tian' })).pages,
    ).toBe(2);
  });

  it('fits four characters with two practice rows on one page', async () => {
    expect((await pageCount('男八爸吧', { rows: 2, grid: 'mi' })).pages).toBe(
      1,
    );
    expect(
      (await pageCount('男八爸吧白百班', { rows: 2, grid: 'mi' })).pages,
    ).toBe(2);
    expect(
      (await pageCount('再见明天下', { rows: 1, grid: 'tian' })).pages,
    ).toBe(1);
  });

  it('moves a block that does not fit to the next page', async () => {
    expect((await pageCount('再见明', { rows: 6, grid: 'mi' })).pages).toBe(2);
  });
});
