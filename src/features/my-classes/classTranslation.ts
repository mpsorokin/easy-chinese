import {
  OPTIONS,
  shuffle,
  type ChoiceQuestion,
} from '@/domain/exercises/index.ts';
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
  您: 'you (polite singular)',
  这: 'this, this one',
  那: 'that, that one',
  是: 'to be (identifying someone or something)',
  不是: 'to not be (negating an identity)',
  谁: 'who',
  哪: 'which',
  国: 'country',
  人: 'person',
  老师: 'teacher',
  医生: 'doctor',
  外语: 'foreign language',
  学: 'to study, to learn',
  奶奶: "grandmother on one's father's side",
  外婆: "grandmother on one's mother's side",
  陈: 'Chen (surname)',
  工人: 'worker, laborer',
  商人: 'merchant, businessperson',
  律师: 'lawyer',
  干部: 'official, cadre',
  厂长: 'factory director',
  农民: 'farmer, peasant',
  中国: 'China',
  英国: 'United Kingdom',
  德国: 'Germany',
  美国: 'United States',
  法国: 'France',
  俄国: 'Russia (traditional name)',
  俄罗斯: 'Russia (modern name)',
  日本: 'Japan',
  乌克兰: 'Ukraine',
  中国人: 'person from China',
  英国人: 'person from the United Kingdom',
  德国人: 'person from Germany',
  美国人: 'person from the United States',
  法国人: 'person from France',
  俄国人: 'person from Russia (traditional country name)',
  俄罗斯人: 'person from Russia (modern country name)',
  日本人: 'person from Japan',
  乌克兰人: 'person from Ukraine',
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

type PracticeWord = HskWord & { variants?: string };

// Homophones make one audible prompt and share a single answer option.
function listeningWords(words: readonly HskWord[]): PracticeWord[] {
  const groups = new Map<string, [HskWord, ...HskWord[]]>();
  for (const word of words) {
    const pronunciation = word.py
      .toLowerCase()
      .normalize()
      .replace(/[\s'’]+/gu, '');
    const group = groups.get(pronunciation);
    if (group) group.push(word);
    else groups.set(pronunciation, [word]);
  }
  const entries = [...groups.values()].map((group) => {
    const glosses = [...new Set(group.map(({ en }) => en))];
    const en = glosses.join(' / ');
    return {
      ...group[0],
      variants: group.map(({ w }) => w).join('、'),
      en,
      shortGloss:
        group.length > 1
          ? [
              ...new Set(
                glosses.map((gloss) => gloss.replace(/ \([^()]*\)$/u, '')),
              ),
            ].join(' / ')
          : en,
    };
  });
  const used = new Set(entries.map(({ en }) => en));
  return entries.map(({ shortGloss, ...entry }) => {
    if (!shortGloss || used.has(shortGloss)) return entry;
    used.add(shortGloss);
    return { ...entry, en: shortGloss };
  });
}

// A round needs enough distinct meanings for the wrong options of every question.
export const canPracticeClass = (
  words: readonly HskWord[],
  direction?: TranslationDirection,
) =>
  new Set(
    (direction === 'listen-en' ? listeningWords(words) : words).map(
      ({ en }) => en,
    ),
  ).size >= OPTIONS;

export function classTranslationQuestions(
  words: readonly HskWord[],
  direction: TranslationDirection,
): ChoiceQuestion[] {
  const toChinese = direction === 'en-zh';
  const listening = direction === 'listen-en';
  const entries: readonly PracticeWord[] = listening
    ? listeningWords(words)
    : words;
  return shuffle(entries).flatMap((word): ChoiceQuestion[] => {
    const right = toChinese ? word.w : word.en;
    const wrong = new Set(
      entries
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
        ...(listening ? { mode: 'listenOnly', hint: word.py } : {}),
        prompt: toChinese ? word.en : (word.variants ?? word.w),
        options,
        answer: options.indexOf(right),
        reveal: `${word.variants ?? word.w} · ${word.py} — ${word.en}`,
        audio: { text: word.w, afterAnswer: toChinese },
      },
    ];
  });
}
