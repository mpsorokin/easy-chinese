import {
  OPTIONS,
  shuffle,
  type ChoiceQuestion,
} from '../../domain/exercises.ts';
import type { HskWord } from '../../domain/types.ts';
import type { ClassLesson } from './classLessons.ts';
import type { TranslationDirection } from './classRoutes.ts';

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

export function classTranslationWords(lesson: ClassLesson): HskWord[] {
  const vocabulary = lesson.sections.find(
    ({ title }) => title === 'Основная лексика',
  );
  const words = new Map<string, HskWord>();
  for (const line of vocabulary?.body.split('\n') ?? []) {
    const [, w, py] =
      /^\|\s*\*\*([\p{Script=Han}]+)\*\*\s*\|\s*([^|]+?)\s*\|/u.exec(line) ??
      [];
    if (!w || !py || words.has(w)) continue;
    const en = english[w];
    if (en) words.set(w, { w, py, en });
  }
  return [...words.values()];
}

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
