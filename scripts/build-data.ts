// Writes one stroke-data file per character to public/hanzi/<codepoint-hex>.json
// from the hanzi-writer-data package, for every character in the decks in src/data/decks/
// in the HSK character lists (src/data/hsk/<level>/chars.json) and in the print-preset extras
// (src/data/presets/extra-chars.json).
// The app fetches these files on demand (see src/data/charData.ts).
// Usage: npm run data
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { charFile } from '../src/domain/charFile.ts';
import type { CharGroup } from '../src/domain/types.ts';

const require = createRequire(import.meta.url);
const dataDir = path.dirname(require.resolve('hanzi-writer-data/package.json'));
const DECKS_DIR = 'src/data/decks';
const HSK_DIR = 'src/data/hsk';
const PRESET_EXTRAS = 'src/data/presets/extra-chars.json';
const OUT_DIR = 'public/hanzi';

// A deck entry's `c` becomes part of a file path below, so it must be exactly one
// code point (no '/', '..' or empty strings). chars.test.ts checks the same, but it runs later.
const SINGLE_CHAR = /^.$/u;

const isObject = (x: unknown): x is Record<string, unknown> =>
  x !== null && typeof x === 'object';

function checkChar(file: string, it: unknown): string {
  const c = isObject(it) ? it.c : undefined;
  if (typeof c !== 'string' || !SINGLE_CHAR.test(c))
    throw new Error(`${file}: bad character ${JSON.stringify(c)}`);
  return c;
}

function readDeck(file: string): CharGroup[] {
  const groups: unknown = JSON.parse(
    fs.readFileSync(path.join(DECKS_DIR, file), 'utf8'),
  );
  if (!Array.isArray(groups)) throw new Error(`${file}: deck is not an array`);
  for (const g of groups as unknown[]) {
    if (!isObject(g) || !Array.isArray(g.items))
      throw new Error(`${file}: group without items`);
    for (const it of g.items as unknown[]) checkChar(file, it);
  }
  return groups as CharGroup[];
}

const groups = fs
  .readdirSync(DECKS_DIR)
  .filter((f) => f.endsWith('.json'))
  .sort()
  .flatMap(readDeck);

function readHsk(): string[] {
  return fs
    .readdirSync(HSK_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .flatMap((d) => {
      const file = path.join(HSK_DIR, d.name, 'chars.json');
      if (!fs.existsSync(file)) return [];
      const list: unknown = JSON.parse(fs.readFileSync(file, 'utf8'));
      if (!Array.isArray(list)) throw new Error(`${file}: not an array`);
      return (list as unknown[]).map((it) => checkChar(file, it));
    });
}

function readPresetExtras(): string[] {
  const list: unknown = JSON.parse(fs.readFileSync(PRESET_EXTRAS, 'utf8'));
  if (!Array.isArray(list)) throw new Error(`${PRESET_EXTRAS}: not an array`);
  return (list as unknown[]).map((it) => checkChar(PRESET_EXTRAS, it));
}

// Decks and the HSK lists overlap; each character is written once.
const chars = new Set([
  ...groups.flatMap((g) => g.items.map((it) => it.c)),
  ...readHsk(),
  ...readPresetExtras(),
]);

// Start clean so removed characters don't leave stale files behind.
fs.rmSync(OUT_DIR, { recursive: true, force: true });
fs.mkdirSync(OUT_DIR, { recursive: true });

let written = 0;
const missing: string[] = [];
for (const c of chars) {
  const file = path.join(dataDir, `${c}.json`);
  if (!fs.existsSync(file)) {
    missing.push(c);
    continue;
  }
  const j = JSON.parse(fs.readFileSync(file, 'utf8')) as {
    strokes: string[];
    medians: number[][][];
  };
  // radStrokes is omitted: radical coloring is disabled in WritingCell.
  const out = { strokes: j.strokes, medians: j.medians };
  fs.writeFileSync(path.join(OUT_DIR, charFile(c)), JSON.stringify(out));
  written++;
}
console.log(`Done, characters: ${written}`);
if (missing.length) console.warn('No data for:', missing.join(' '));
