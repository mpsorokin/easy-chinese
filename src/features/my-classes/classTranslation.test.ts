import { describe, expect, it } from 'vitest';
import { OPTIONS } from '@/domain/exercises/index.ts';
import {
  classLessons,
  parseClassLesson,
} from '@/features/my-classes/classLessons.ts';
import {
  canPracticeClass,
  classTranslationQuestions,
  classTranslationWords,
} from '@/features/my-classes/classTranslation.ts';

const lesson = parseClassLesson(
  1,
  `# 第一课 · Dì yī kè · Урок 1

## 你好！ Приветствие

Вступление.

## 1. Основная лексика

| 汉字 | Pinyin | Перевод |
| --- | --- | --- |
| **你** | nǐ | ты |
| **好** | hǎo | хорошо |
| **我** | wǒ | я |
| **很** | hěn | очень |
| **你** | nǐ | ты |
| **八** | bā | восемь |
| 不是 | bú shì | не |

## 2. Грамматика

| 汉字 | Pinyin | Перевод |
| --- | --- | --- |
| **他** | tā | он |
`,
)!;

describe('classTranslationWords', () => {
  const words = classTranslationWords(lesson);

  it('takes bold words of the vocabulary once, with their glosses', () => {
    expect(words.map(({ w }) => w)).toEqual(['你', '好', '我', '很', '八']);
    expect(words[0]).toEqual({ w: '你', py: 'nǐ', en: 'you (singular)' });
  });

  it('falls back to the HSK gloss', () => {
    expect(words.find(({ w }) => w === '八')?.en).toBe('eight');
  });
});

describe('classTranslationQuestions', () => {
  const words = classTranslationWords(lesson);

  it.each(['zh-en', 'en-zh'] as const)('asks every word (%s)', (direction) => {
    const questions = classTranslationQuestions(words, direction);
    expect(questions).toHaveLength(words.length);
    for (const q of questions) {
      expect(q.options).toHaveLength(OPTIONS);
      expect(new Set(q.options).size).toBe(OPTIONS);
      const word = words.find(
        ({ w, en }) => q.prompt === w || q.prompt === en,
      )!;
      expect(q.options[q.answer]).toBe(
        direction === 'en-zh' ? word.w : word.en,
      );
    }
  });

  it('needs enough meanings', () => {
    expect(canPracticeClass(words)).toBe(true);
    expect(canPracticeClass(words.slice(0, OPTIONS - 1))).toBe(false);
  });

  it('uses four distinct English options and groups identical readings', () => {
    const firstClass = classLessons.find(({ id }) => id === 1)!;
    const questions = classTranslationQuestions(
      classTranslationWords(firstClass),
      'listen-en',
    );

    expect(questions.length).toBeGreaterThan(0);
    for (const q of questions) {
      expect(q.mode).toBe('listenOnly');
      expect(q.optionLang).toBeUndefined();
      expect(q.audio?.afterAnswer).toBe(false);
      expect(q.options).toHaveLength(OPTIONS);
      expect(new Set(q.options).size).toBe(OPTIONS);
      expect(q.reveal.endsWith(q.options[q.answer]!)).toBe(true);
    }
    expect(questions.filter(({ hint }) => hint === 'tā')).toEqual([
      expect.objectContaining({ prompt: '他、她、它' }),
    ]);
    const they = questions.filter(({ hint }) => hint === 'tāmen');
    expect(they).toEqual([
      expect.objectContaining({ prompt: '他们、她们、它们' }),
    ]);
    expect(they[0]?.options[they[0].answer]).toBe('they');
  });
});

it('every class lesson with vocabulary can be practised', () => {
  for (const lesson of classLessons) {
    if (!lesson.sections.some(({ kind }) => kind === 'vocabulary')) continue;
    const words = classTranslationWords(lesson);
    expect(canPracticeClass(words)).toBe(true);
    expect(canPracticeClass(words, 'listen-en')).toBe(true);
  }
});

it('includes the pronouns, professions, countries and nationalities from lesson 3', () => {
  const lesson = classLessons.find(({ id }) => id === 3)!;
  const words = classTranslationWords(lesson);

  expect(words).toEqual(
    expect.arrayContaining([
      { w: '您', py: 'nín', en: 'you (polite singular)' },
      { w: '律师', py: 'lǜshī', en: 'lawyer' },
      { w: '乌克兰', py: 'Wūkèlán', en: 'Ukraine' },
      { w: '乌克兰人', py: 'Wūkèlán rén', en: 'person from Ukraine' },
    ]),
  );
  expect(new Set(words.map(({ en }) => en)).size).toBe(words.length);
});
