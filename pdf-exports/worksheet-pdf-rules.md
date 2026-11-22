# Worksheet PDF: layout rules

How the "Print worksheet (PDF)" feature builds its document. Source of truth:
`src/features/hsk/worksheetPdf.ts` (layout), `textImage.ts` (text rendering),
`printOptions.ts` (options, file name), `useWorksheetPrint.ts` (flow), `savePdf.ts` (download).

The worksheets in this folder follow these rules. They differ from the app in four ways:
one traced copy instead of five, word blocks, no level/lesson labels, and section breaks
(see the last section).

All sizes are in PDF points (1 pt = 1/72 in ≈ 0.353 mm). Vertical positions are measured
from the top of the page.

## Options (print dialog)

| Option        | Values              | Default | Stored in                    |
| ------------- | ------------------- | ------- | ---------------------------- |
| Practice rows | 1, 2, 3, 4, 5, 6    | 3       | `hskStore` → `printOptions`  |
| Grid          | 田 (`tian`), 米 (`mi`) | 米      | same                         |

- Characters are printed in the order they were picked.
- Invalid stored values fall back to the defaults (`normalizePrintOptions`).
- A character without preset entry or stroke data is skipped.

## Page

| Parameter     | Value                         |
| ------------- | ----------------------------- |
| Format        | A4 portrait, 595.28 × 841.89  |
| Left margin   | 40                            |
| Right margin  | 40                            |
| Top margin    | 30                            |
| Bottom margin | 32                            |
| Content width | 515.28 (595.28 − 40 − 40)     |
| Usable height | 779.89 (841.89 − 30 − 32)     |

## Character block

Each character is one block, top to bottom:

1. **Header** — model cell, text block. No tag on the right.
2. **Gap** `headGap`.
3. **"STROKE ORDER" label** — height `lbl`.
4. **Stroke-order strip** — one or more rows of small cells.
5. **Gap** `stripGap`.
6. **Practice rows** — N rows of 12 cells.

Blocks are separated by `blockGap`. A block is never split across pages.

### Spacing presets

Cells keep their size; only the spacing changes.

| Parameter  | Regular (3–6 rows) | Compact (1–2 rows) |
| ---------- | ------------------ | ------------------ |
| `head` (model cell size) | 42 | 38 |
| `headGap`  | 8                  | 6                  |
| `lbl`      | 13                 | 11                 |
| `stripGap` | 6                  | 5                  |
| `blockGap` | 16                 | 10                 |

### Header

- Model cell: `head × head` at the left margin, the full character in ink.
- Text block: starts 10 pt to the right of the model cell, vertically centered on it.
  - Pinyin — 13 pt, bold (700), `#1f1a17`.
  - Meaning — 8.8 pt, `#6f6457`.
  - Words with this character — 7.4 pt, `#9a8f82`, format
    `Words: 男人 nánrén · …`. Line omitted if there are no words.

### Stroke order

- Label `STROKE ORDER`: 6.6 pt, bold, `#5a4a3e`, letter spacing 1.1, at the left margin.
- Cell size 36, gap 4 → 12 cells per row (`floor((515.28 + 4) / 40)`).
  More than 12 strokes wrap to the next row (each extra row adds 40 pt to the block).
- Cell *i* shows strokes 1…*i*: earlier strokes beige `rgb(0.86, 0.80, 0.69)`,
  the current one red `rgb(0.76, 0.16, 0.12)`.
- Stroke number in the top-left corner: Helvetica 5.2 pt, `rgb(0.69, 0.60, 0.54)`,
  offset 1.8 pt from the left, baseline 6.4 pt below the cell top.

### Practice rows

- 12 cells per row, gap 3 → cell size `(515.28 − 3 × 11) / 12 ≈ 40.19`.
  The row spans the full content width.
- Rows are 3 pt apart.
- First row only: cell 1 has one trace copy at 30 % intensity (the ink color at 30 % on white,
  `rgb(0.736, 0.730, 0.727)`), cells 2–12 are empty.
- All other rows are empty.

### Word blocks

Words are practiced in their own blocks, after the characters:

- Header: one model cell per character (`head × head`, 3 pt apart), text block 10 pt to the
  right of the last cell (pinyin, meaning), no tag on the right.
- No stroke-order label or strip: `headGap`, then the practice rows.
- Practice rows: the same 12-cell rows; the word is written character by character
  (a 2-character word takes 2 cells).
- Row count: words of 3 or more characters get 3 practice rows instead of 2
  (`max(rows, 3)`), e.g. 乌克兰; shorter words use the chosen row count.
- First row only: one trace copy of the whole word (cells 1–2 for a 2-character word),
  the rest empty.
- Block height: `head + headGap + rows × (40.19 + 3) − 3`
  (rows per the rule above).
- All word blocks form one section and flow continuously, so a page holds as many as fit:

| Word rows | Block height | Per page |
| --------- | ------------ | -------- |
| 2 (compact preset) | ≈ 127.4 | 5 |
| 3 (compact preset) | ≈ 170.6 | 4 |

### Sentence exercise

Free writing: the student writes their own sentences with given words. One section,
always on its own page, after the character and word sections.

1. **Task** at the left margin, no model cell:
   - English — 13 pt, bold (700), `#1f1a17`, e.g. `Write three sentences with 谁 and three with 那.`
   - Chinese — 10 pt, `#6f6457`, e.g. `用“谁”和“那”各写三个句子。`
   - No tag on the right.
   - Gap 12 to the first group.
2. **Word group** (one per word, `blockGap` between groups):
   - Header as in a character block: model cell, pinyin, meaning. No example line.
     No tag on the right.
   - `headGap`, then N sentence fields.
3. **Sentence field** — compact cells, same cell style (border, 米/田 guides):
   - Cell size 30 target, gap 2 → 16 cells per row (`floor((515.28 + 2) / 32)`),
     cell `(515.28 − 2 × 15) / 16 ≈ 30.33`; the row spans the full content width.
   - 1 row per sentence (16 cells, punctuation takes a cell).
   - Sentences 7 pt apart.
   - Sentence number (continuous across groups, 1…6) in the top-left corner of the first
     cell, styled like stroke numbers (Helvetica 5.2 pt, `rgb(0.69, 0.60, 0.54)`).
   - All cells are empty — no trace copies.
- Height: task (≈ 32) + 12 + per group `head + headGap + N × 30.33 + (N − 1) × 7`.
  With 2 words × 3 sentences ≈ 380 pt — fits one page.
- Pinyin follows the standard readings (谁 = shéi).

### Block height

```
height = head + headGap + lbl
       + ceil(strokes / 12) × 40      // stroke-order strip
       + stripGap
       + rows × (40.19 + 3) − 3       // practice rows
```

## Writing cell (all cells: model, stroke order, practice)

- Border: solid, 0.8 pt, `rgb(0.85, 0.64, 0.59)`.
- Guides: dashed, 0.45 pt, dash 1.6 / gap 1.6, `rgb(0.90, 0.74, 0.70)`.
  - 田: vertical + horizontal center lines.
  - 米: the same plus both diagonals.
- Guides are drawn first, the border on top, then the glyph.
- Glyph inset: 8.5 % of the cell size on each side. Glyphs are vector paths from the
  stroke data (em box 1024, baseline at 900), not font text.

## Pagination

- Start at the top margin; place blocks one after another.
- If a block does not fit above the bottom margin, start a new page
  (a block that is first on a page is always placed, even if too tall).
- Characters per page (blocks with ≤ 12 strokes):

| Practice rows | Preset  | Block height | Per page |
| ------------- | ------- | ------------ | -------- |
| 1             | compact | ≈ 140.2      | 5        |
| 2             | compact | ≈ 183.4      | 4        |
| 3             | regular | ≈ 236.6      | 3        |
| 4             | regular | ≈ 279.8      | 2        |
| 5             | regular | ≈ 323.0      | 2        |
| 6             | regular | ≈ 366.1      | 2        |

  Characters with more than 12 strokes are 40 pt taller and may push the next block
  to the following page.

## Page numbers

- Every page: `p / N` at the bottom right, right-aligned to the right margin,
  baseline 16 pt above the bottom edge.
- Helvetica 7 pt, `rgb(0.69, 0.60, 0.54)`.

## Text and fonts

- Header text, labels and tags are rendered by the browser on a canvas with system fonts
  (`system-ui`, Segoe UI, Roboto, …, PingFang SC, Noto Sans CJK SC, Microsoft YaHei)
  and embedded as PNG images, so pinyin tone marks and Chinese words need no embedded font.
- Canvas scale: 5 px per pt (sharp in print); line height 1.3.
- Identical text images (label, repeated tags) are embedded once and reused.
- Numbers (stroke numbers, page numbers) use the built-in Helvetica — no font file is embedded.

## Sections

- Characters and words are grouped into sections (e.g. per lesson); each section starts
  on a new page. There is no section heading — no lesson names are printed.
- Order: first all single characters (one section), then all words (one section, even if
  they come from different lessons), then the sentence exercise as the last section.

## Document metadata

- Title: `Writing Worksheet` (shown in the viewer's title bar); language `en`.

## Differences from the app

The app's "Print worksheet (PDF)" (`src/features/hsk/worksheetPdf.ts`) currently differs:

| Rule            | App                                   | This folder              |
| --------------- | ------------------------------------- | ------------------------ |
| Traced copies   | 3 dark + 2 light (cells 1–5)          | 1 at 30 % ink (cell 1)   |
| Tag             | `HSK {level} · N STROKES`             | none                     |
| Words line      | `HSK {level} words: …` (max 6, ` …`)  | `Words: 男人 nánrén`      |
| Word blocks     | none                                  | yes                      |
| Sections        | none, one continuous flow             | each on a new page       |
| Title           | `HSK {level} Writing Worksheet`       | `Writing Worksheet`      |
| File name       | `hsk{level}-worksheet-{chars}.pdf`    | chosen per export        |

## Colors summary

| Use                     | Color                         |
| ----------------------- | ----------------------------- |
| Cell border             | `rgb(0.85, 0.64, 0.59)`       |
| Cell guides             | `rgb(0.90, 0.74, 0.70)`       |
| Model glyph             | `rgb(0.12, 0.10, 0.09)`       |
| Stroke order: previous  | `rgb(0.86, 0.80, 0.69)`       |
| Stroke order: current   | `rgb(0.76, 0.16, 0.12)`       |
| Trace copy (30 % ink)   | `rgb(0.736, 0.730, 0.727)`    |
| Numbers                 | `rgb(0.69, 0.60, 0.54)`       |
| Pinyin                  | `#1f1a17`                     |
| Meaning                 | `#6f6457`                     |
| HSK words               | `#9a8f82`                     |
| "STROKE ORDER" label    | `#5a4a3e`                     |
