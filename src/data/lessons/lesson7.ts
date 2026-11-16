// Lesson 7 of the "Lessons" tab.
import type { CourseLesson } from '../courseLessons.ts';

export const lesson7: CourseLesson = {
  id: 7,
  exercises: ['exercise1', 'exercise2', 'exercise3', 'exercise4'],
  descriptions: {
    exercise1: 'Telling the time: 几点 and 上午, 下午',
    exercise2: 'Right now: 现在 and 要去',
    exercise3: 'Dinner time: 七点 and 吃晚饭',
    exercise4: 'Hours and minutes: 点 and 分',
  },
  dialogues: {
    exercise1: [
      {
        segments: [
          { t: '现', py: 'xiàn' },
          { t: '在', py: 'zài' },
          { t: '几', py: 'jǐ' },
          { t: '点', py: 'diǎn' },
          { t: '？' },
        ],
        en: 'What time is it now?',
      },
      {
        segments: [
          { t: '早', py: 'zǎo' },
          { t: '上', py: 'shang' },
          { t: '八', py: 'bā' },
          { t: '点', py: 'diǎn' },
          { t: '四', py: 'sì' },
          { t: '十', py: 'shí' },
          { t: '。' },
        ],
        en: "It's 8:40 in the morning.",
      },
      {
        segments: [
          { t: '我', py: 'wǒ' },
          { t: '上', py: 'shàng' },
          { t: '午', py: 'wǔ' },
          { t: '十', py: 'shí' },
          { t: '点', py: 'diǎn' },
          { t: '十', py: 'shí' },
          { t: '分', py: 'fēn' },
          { t: '有', py: 'yǒu' },
          { t: '课', py: 'kè' },
          { t: '。' },
        ],
        en: 'I have a class at 10:10 a.m.',
      },
      {
        segments: [
          { t: '好', py: 'hǎo' },
          { t: '的', py: 'de' },
          { t: '，' },
          { t: '我', py: 'wǒ' },
          { t: '们', py: 'men' },
          { t: '下', py: 'xià' },
          { t: '午', py: 'wǔ' },
          { t: '两', py: 'liǎng' },
          { t: '点', py: 'diǎn' },
          { t: '见', py: 'jiàn' },
          { t: '吧', py: 'ba' },
          { t: '。' },
        ],
        en: "Okay, let's meet at 2:00 p.m.",
      },
    ],
    exercise2: [
      {
        segments: [
          { t: '现', py: 'xiàn' },
          { t: '在', py: 'zài' },
          { t: '我', py: 'wǒ' },
          { t: '要', py: 'yào' },
          { t: '去', py: 'qù' },
          { t: '看', py: 'kàn' },
          { t: '书', py: 'shū' },
          { t: '了', py: 'le' },
          { t: '。' },
        ],
        en: 'I am going to read a book now.',
      },
      {
        segments: [
          { t: '你', py: 'nǐ' },
          { t: '现', py: 'xiàn' },
          { t: '在', py: 'zài' },
          { t: '去', py: 'qù' },
          { t: '学', py: 'xué' },
          { t: '校', py: 'xiào' },
          { t: '吗', py: 'ma' },
          { t: '？' },
        ],
        en: 'Are you going to school now?',
      },
    ],
    exercise3: [
      {
        segments: [
          { t: '现', py: 'xiàn' },
          { t: '在', py: 'zài' },
          { t: '几', py: 'jǐ' },
          { t: '点', py: 'diǎn' },
          { t: '？' },
        ],
        en: 'What time is it now?',
      },
      {
        segments: [
          { t: '我', py: 'wǒ' },
          { t: '家', py: 'jiā' },
          { t: '七', py: 'qī' },
          { t: '点', py: 'diǎn' },
          { t: '吃', py: 'chī' },
          { t: '晚', py: 'wǎn' },
          { t: '饭', py: 'fàn' },
          { t: '。' },
        ],
        en: "My family has dinner at seven o'clock.",
      },
    ],
    exercise4: [
      {
        segments: [
          { t: '现', py: 'xiàn' },
          { t: '在', py: 'zài' },
          { t: '是', py: 'shì' },
          { t: '3', py: 'sān' },
          { t: '点', py: 'diǎn' },
          { t: '10', py: 'shí' },
          { t: '分', py: 'fēn' },
          { t: '。' },
        ],
        en: 'It is 3:10 now.',
      },
    ],
  },
};
