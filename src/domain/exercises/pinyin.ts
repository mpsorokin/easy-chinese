// Pinyin helpers: tone variants of a syllable and splitting a word's reading.
import type { HskWord } from '@/domain/types.ts';

const TONES: Record<string, string[]> = {
  a: ['a', 'ā', 'á', 'ǎ', 'à'],
  e: ['e', 'ē', 'é', 'ě', 'è'],
  i: ['i', 'ī', 'í', 'ǐ', 'ì'],
  o: ['o', 'ō', 'ó', 'ǒ', 'ò'],
  u: ['u', 'ū', 'ú', 'ǔ', 'ù'],
  ü: ['ü', 'ǖ', 'ǘ', 'ǚ', 'ǜ'],
};
const BASE = new Map(
  Object.entries(TONES).flatMap(([base, forms]) =>
    forms.map((f) => [f, base] as const),
  ),
);

// Vowel that carries the tone mark in a toneless syllable (standard placement rules).
function markIndex(syl: string): number {
  for (const v of ['a', 'e']) {
    const i = syl.indexOf(v);
    if (i >= 0) return i;
  }
  const ou = syl.indexOf('ou');
  if (ou >= 0) return ou;
  for (let i = syl.length - 1; i >= 0; i--) if (TONES[syl[i]!]) return i;
  return -1;
}

// The same one-syllable pinyin with each of the tones 1–4 plus neutral: "hǎo" → hāo, háo, hǎo, hào, hao.
export function toneVariants(py: string): string[] {
  const plain = [...py].map((ch) => BASE.get(ch) ?? ch).join('');
  const i = markIndex(plain);
  if (i < 0 || /\s/.test(py)) return [py];
  const forms = TONES[plain[i]!]!;
  return [1, 2, 3, 4, 0].map(
    (t) => plain.slice(0, i) + forms[t] + plain.slice(i + 1),
  );
}

const SYLLABLE =
  /^(?:zh|ch|sh|[bpmfdtnlgkhjqxrzcsyw])?[aeiouüvāáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]+(?:ng|n|r)?$/;
const startsWithVowel = (s: string) => !/^[bcdfghjklmnpqrstvwxyz]/.test(s);

// Splits a word's pinyin ("xuéshēng", "Xī'ān") into `n` syllables, or null if it can't.
// Of the possible splits, one where no later syllable starts with a vowel wins
// ("bàngōng" → bàn gōng, not bàng ōng).
export function splitPinyin(py: string, n: number): string[] | null {
  const chunks = py
    .toLowerCase()
    .trim()
    .split(/[\s'’]+/)
    .filter(Boolean);
  const found: string[][] = [];
  const walk = (ci: number, rest: string, acc: string[]) => {
    if (found.length > 20) return;
    if (!rest) {
      if (ci + 1 < chunks.length) walk(ci + 1, chunks[ci + 1]!, acc);
      else if (acc.length === n) found.push(acc);
      return;
    }
    if (acc.length >= n) return;
    for (let len = 1; len <= rest.length; len++) {
      const syl = rest.slice(0, len);
      if (SYLLABLE.test(syl)) walk(ci, rest.slice(len), [...acc, syl]);
    }
  };
  if (chunks.length) walk(0, chunks[0]!, []);
  return (
    found.find((f) => f.slice(1).every((s) => !startsWithVowel(s))) ??
    found[0] ??
    null
  );
}

// A word's syllables, one per character; null for erhua words (面条儿 miàntiáor), where
// 儿 is only an "r" on the syllable before it.
export function wordSyllables(w: HskWord): string[] | null {
  const chars = [...w.w];
  const syllables = splitPinyin(w.py, chars.length);
  // A real 儿 syllable reads ér (女儿 nǚ'ér); anything else is an erhua split.
  if (chars.at(-1) === '儿' && !/^[eēéěè]r$/.test(syllables?.at(-1) ?? ''))
    return null;
  return syllables;
}
