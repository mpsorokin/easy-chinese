// Lesson 5 of the "Lessons" tab.
import type { CourseLesson } from '../courseLessons.ts';

export const lesson5: CourseLesson = {
  id: 5,
  exercises: ['exercise1', 'exercise2', 'exercise3', 'exercise4'],
  descriptions: {
    exercise1: 'What is the date today?',
    exercise2: 'A happy day: 高兴 and 来找',
    exercise3: 'Year, month and day: saying the full date',
    exercise4: 'Which day? Class and work with 上课 and 上班',
  },
  dialogues: {
    exercise1: [
      {
        segments: [
          { t: '今', py: 'jīn' },
          { t: '天', py: 'tiān' },
          { t: '几', py: 'jǐ' },
          { t: '号', py: 'hào' },
          { t: '？' },
        ],
        en: 'What is the date today?',
      },
      {
        segments: [
          { t: '今', py: 'jīn' },
          { t: '天', py: 'tiān' },
          { t: '9', py: 'jiǔ' },
          { t: '月', py: 'yuè' },
          { t: '8', py: 'bā' },
          { t: '号', py: 'hào' },
          { t: '。' },
        ],
        en: 'Today is September 8th.',
      },
      {
        segments: [
          { t: '星', py: 'xīng' },
          { t: '期', py: 'qī' },
          { t: '几', py: 'jǐ' },
          { t: '？' },
        ],
        en: 'What day of the week is it?',
      },
      {
        segments: [
          { t: '星', py: 'xīng' },
          { t: '期', py: 'qī' },
          { t: '日', py: 'rì' },
          { t: '。' },
          { t: '今', py: 'jīn' },
          { t: '天', py: 'tiān' },
          { t: '我', py: 'wǒ' },
          { t: '休', py: 'xiū' },
          { t: '息', py: 'xi' },
          { t: '。' },
        ],
        en: "Sunday. Today I'm resting.",
      },
    ],
    exercise2: [
      {
        segments: [
          { t: '我', py: 'wǒ' },
          { t: '今', py: 'jīn' },
          { t: '天', py: 'tiān' },
          { t: '很', py: 'hěn' },
          { t: '高', py: 'gāo' },
          { t: '兴', py: 'xìng' },
          { t: '。' },
        ],
        en: 'I am very happy today.',
      },
      {
        segments: [
          { t: '今', py: 'jīn' },
          { t: '天', py: 'tiān' },
          { t: '他', py: 'tā' },
          { t: '来', py: 'lái' },
          { t: '找', py: 'zhǎo' },
          { t: '我', py: 'wǒ' },
          { t: '。' },
        ],
        en: 'Today he is coming to see me.',
      },
    ],
    exercise3: [
      {
        segments: [
          { t: '今', py: 'jīn' },
          { t: '天', py: 'tiān' },
          { t: '是', py: 'shì' },
          { t: '2026', py: 'èr líng èr liù' },
          { t: '年', py: 'nián' },
          { t: '3', py: 'sān' },
          { t: '月', py: 'yuè' },
          { t: '6', py: 'liù' },
          { t: '日', py: 'rì' },
          { t: '。' },
        ],
        en: 'Today is March 6, 2026.',
      },
      {
        segments: [
          { t: '我', py: 'wǒ' },
          { t: '工', py: 'gōng' },
          { t: '作', py: 'zuò' },
          { t: '了', py: 'le' },
          { t: '三', py: 'sān' },
          { t: '个', py: 'gè' },
          { t: '月', py: 'yuè' },
          { t: '。' },
        ],
        en: 'I worked for three months.',
      },
    ],
    exercise4: [
      {
        segments: [
          { t: '我', py: 'wǒ' },
          { t: '们', py: 'men' },
          { t: '3', py: 'sān' },
          { t: '月', py: 'yuè' },
          { t: '1', py: 'yī' },
          { t: '号', py: 'hào' },
          { t: '上', py: 'shàng' },
          { t: '课', py: 'kè' },
          { t: '。' },
        ],
        en: 'We have class on March 1st.',
      },
      {
        segments: [
          { t: '你', py: 'nǐ' },
          { t: '几', py: 'jǐ' },
          { t: '号', py: 'hào' },
          { t: '上', py: 'shàng' },
          { t: '班', py: 'bān' },
          { t: '？' },
        ],
        en: 'What date do you go to work?',
      },
    ],
  },
};
