import { toneless } from '@/data/hsk.ts';
import { vocabulary } from '@/data/vocabulary.ts';

const englishKey = (text: string) => toneless(text.trim()).replace(/\s+/g, ' ');

// Accept tone marks, tone numbers, and the keyboard spellings for ü.
const pinyinKey = (text: string) =>
  toneless(text)
    .replace(/u:|v/g, 'u')
    .replace(/[0-5\s'’.-]/g, '');

const catalog = vocabulary.map((word) => ({
  word,
  pinyin: word.py.split('/').map(pinyinKey),
  meanings: [word.en, ...word.en.split(/[,;/]/)].map(englishKey),
}));

function rank(value: string, query: string): number {
  if (!query) return Infinity;
  if (value === query) return 0;
  if (value.startsWith(query)) return 1;
  return value.includes(query) ? 2 : Infinity;
}

export function searchVocabulary(query: string) {
  const search = query.trim().normalize('NFKC');
  if (!search) return vocabulary;
  const hanzi = search.replace(/\s+/g, '');
  const pinyin = pinyinKey(search);
  const english = englishKey(search);

  return catalog
    .map((item) => ({
      word: item.word,
      rank: Math.min(
        rank(item.word.w, hanzi),
        ...item.pinyin.map((value) => rank(value, pinyin)),
        ...item.meanings.map((value) => rank(value, english)),
      ),
    }))
    .filter((match) => Number.isFinite(match.rank))
    .sort((a, b) => a.rank - b.rank)
    .map((match) => match.word);
}
