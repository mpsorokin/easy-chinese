import { describe, expect, it } from 'vitest';
import { OPTIONS } from '../../domain/exercises.ts';
import { classLessons, parseClassLesson } from './classLessons.ts';
import {
  canPracticeClass,
  classTranslationQuestions,
  classTranslationWords,
} from './classTranslation.ts';

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
});

it('every class lesson with vocabulary can be practised', () => {
  for (const lesson of classLessons)
    if (lesson.sections.some(({ kind }) => kind === 'vocabulary'))
      expect(canPracticeClass(classTranslationWords(lesson))).toBe(true);
});
