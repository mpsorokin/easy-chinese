// One-off import of an HSK level from the official syllabus (《HSK 考试大纲》, CTI, 2025),
// as mirrored in CSV form by https://github.com/ofou/hsk (汉字.csv, 词汇.csv).
// Writes src/data/hsk/<level>/chars.json and words.json in the official order.
// Pinyin and English meanings already present in those files are kept, so the import can be
// re-run after the meanings were filled in by hand; entries still missing a meaning are listed.
// Usage: node scripts/import-hsk.ts <dir with the CSV files> [level=1]
import fs from 'node:fs';
import path from 'node:path';
import type { HskChar, HskWord } from '../src/domain/types.ts';

const LEVEL_NAMES: Record<string, string> = {
  '1': '一级',
  '2': '二级',
  '3': '三级',
  '4': '四级',
  '5': '五级',
  '6': '六级',
  '7-9': '七-九级',
};

const [csvDir, level = '1'] = process.argv.slice(2);
const levelName = LEVEL_NAMES[level];
if (!csvDir || !levelName) {
  console.error('Usage: node scripts/import-hsk.ts <csv dir> [level]');
  process.exit(1);
}
const outDir = path.join('src/data/hsk', level);

// The syllabus CSVs have no quoted fields, so a plain split is enough.
function readCsv(file: string): Record<string, string>[] {
  const [head, ...rows] = fs
    .readFileSync(path.join(csvDir!, file), 'utf8')
    .trimStart() // also drops a byte order mark
    .split(/\r?\n/)
    .filter((l) => l.trim());
  const keys = head!.split(',');
  return rows.map((r) => {
    const cells = r.split(',');
    return Object.fromEntries(keys.map((k, i) => [k, cells[i] ?? '']));
  });
}

function readJson<T>(file: string): T[] {
  const p = path.join(outDir, file);
  return fs.existsSync(p)
    ? (JSON.parse(fs.readFileSync(p, 'utf8')) as T[])
    : [];
}

// A word's level may carry the levels of its other senses: "一级（二级）".
const inLevel = (r: Record<string, string>) =>
  (r['级别'] ?? '').startsWith(levelName);

const oldChars = new Map(readJson<HskChar>('chars.json').map((e) => [e.c, e]));
const oldWords = new Map(readJson<HskWord>('words.json').map((e) => [e.w, e]));

const chars: HskChar[] = readCsv('汉字.csv')
  .filter(inLevel)
  .map((r) => {
    const c = r['汉字']!;
    const old = oldChars.get(c);
    return { c, py: old?.py ?? '', en: old?.en ?? '' };
  });

const words: HskWord[] = readCsv('词汇.csv')
  .filter(inLevel)
  .map((r) => {
    // Homograph numbers ("本1") and curly apostrophes ("nǚ’ér") are dropped/straightened.
    const w = r['词语']!.replace(/\d+$/, '');
    const old = oldWords.get(w);
    return {
      w,
      py: old?.py ?? r['拼音']!.replace(/’/g, "'"),
      en: old?.en ?? '',
    };
  });

const line = (x: object) => '  ' + JSON.stringify(x);
const write = (file: string, list: object[]) =>
  fs.writeFileSync(
    path.join(outDir, file),
    '[\n' + list.map(line).join(',\n') + '\n]\n',
  );

fs.mkdirSync(outDir, { recursive: true });
write('chars.json', chars);
write('words.json', words);
console.log(`HSK ${level}: ${chars.length} characters, ${words.length} words`);
const todo = [
  ...chars.filter((e) => !e.py || !e.en).map((e) => e.c),
  ...words.filter((e) => !e.en).map((e) => e.w),
];
if (todo.length) console.warn('Missing pinyin/meaning:', todo.join(' '));
