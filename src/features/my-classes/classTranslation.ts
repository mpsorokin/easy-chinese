import { OPTIONS, shuffle, type ChoiceQuestion } from '@/domain/exercises.ts';
import { HSK1_LEVEL } from '@/data/hsk.ts';
import type { HskWord } from '@/domain/types.ts';
import type { ClassLesson } from '@/features/my-classes/classLessons.ts';
import { type TranslationDirection } from '@/shared/paths.ts';

// Keep the English glosses specific enough to work in both directions.
const english: Readonly<Record<string, string>> = {
  你: 'you (singular)',
  好: 'good, well',
  你好: 'hello',
  我: 'I, me',
  吗: 'yes-or-no question particle',
  很: 'very',
  呢: 'follow-up question particle',
  也: 'also, too',
  他: 'he',
  她: 'she',
  它: 'it (an object or animal)',
  我们: 'we',
  你们: 'you (plural)',
  他们: 'they (men or a mixed group)',
  她们: 'they (women)',
  它们: 'they (objects or animals)',
  忙: 'busy',
  不: 'not',
  都: 'all, both',
  爸爸: 'dad',
  妈妈: 'mom',
  哥哥: 'older brother',
  弟弟: 'younger brother',
  朋友: 'friend',
  男: 'male',
  男朋友: 'boyfriend',
  要: 'to want',
  喝: 'to drink',
  咖啡: 'coffee',
  水: 'water',
};

const hskGloss = new Map(HSK1_LEVEL.words.map((word) => [word.w, word.en]));
const BOLD_HAN = /^\*\*(\p{Script=Han}+)\*\*$/u;

// The words of a lesson's vocabulary tables that have an English gloss: this file's own
// (made to tell the words of a lesson apart) or else the HSK list's.
export function classTranslationWords(lesson: ClassLesson): HskWord[] {
  const words = new Map<string, HskWord>();
  for (const section of lesson.sections) {
    if (section.kind !== 'vocabulary') continue;
    for (const block of section.blocks) {
      if (block.type !== 'table') continue;
      const { columns, rows } = block.table;
      const hanzi = columns.indexOf('hanzi');
      const pinyin = columns.indexOf('pinyin');
      if (hanzi < 0 || pinyin < 0) continue;
      for (const row of rows) {
        const w = BOLD_HAN.exec(row[hanzi] ?? '')?.[1];
        const py = row[pinyin];
        const en = w && (english[w] ?? hskGloss.get(w));
        if (w && py && en && !words.has(w)) words.set(w, { w, py, en });
      }
    }
  }
  return [...words.values()];
}

// A round needs enough distinct meanings for the wrong options of every question.
export const canPracticeClass = (words: readonly HskWord[]) =>
  new Set(words.map(({ en }) => en)).size >= OPTIONS;

export function classTranslationQuestions(
  words: readonly HskWord[],
  direction: TranslationDirection,
): ChoiceQuestion[] {
  const toChinese = direction === 'en-zh';
  return shuffle(words).flatMap((word): ChoiceQuestion[] => {
    const right = toChinese ? word.w : word.en;
    const wrong = new Set(
      words
        .filter((other) => other.w !== word.w && other.en !== word.en)
        .map((other) => (toChinese ? other.w : other.en)),
    );
    if (wrong.size < OPTIONS - 1) return [];

    const options = shuffle([
      right,
      ...shuffle([...wrong]).slice(0, OPTIONS - 1),
    ]);
    return [
      {
        kind: 'choice',
        ...(toChinese ? { mode: 'toWord', optionLang: 'zh' } : {}),
        prompt: toChinese ? word.en : word.w,
        options,
        answer: options.indexOf(right),
        reveal: `${word.w} · ${word.py} — ${word.en}`,
        audio: { text: word.w, afterAnswer: toChinese },
      },
    ];
  });
}
