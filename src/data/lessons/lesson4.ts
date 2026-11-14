// Lesson 4 of the "Lessons" tab.
import type { CourseLesson } from '../courseLessons.ts';

export const lesson4: CourseLesson = {
  id: 4,
  exercises: ['exercise1'],
  descriptions: {
    exercise1: 'How many students?',
  },
  dialogues: {
    exercise1: [
      {
        segments: [
          { t: '一', py: 'yī' },
          { t: '飞', py: 'fēi' },
          { t: '忙', py: 'máng' },
          { t: '吗', py: 'ma' },
          { t: '？' },
        ],
        en: 'Is Yifei busy?',
      },
      {
        segments: [
          { t: '她', py: 'tā' },
          { t: '很', py: 'hěn' },
          { t: '忙', py: 'máng' },
          { t: '。' },
        ],
        en: 'She is very busy.',
      },
      {
        segments: [
          { t: '她', py: 'tā' },
          { t: '有', py: 'yǒu' },
          { t: '多', py: 'duō' },
          { t: '少', py: 'shao' },
          { t: '个', py: 'gè' },
          { t: '学', py: 'xué' },
          { t: '生', py: 'shēng' },
          { t: '？' },
        ],
        en: 'How many students does she have?',
      },
      {
        segments: [
          { t: '她', py: 'tā' },
          { t: '有', py: 'yǒu' },
          { t: '二', py: 'èr' },
          { t: '十', py: 'shí' },
          { t: '个', py: 'gè' },
          { t: '学', py: 'xué' },
          { t: '生', py: 'shēng' },
          { t: '。' },
        ],
        en: 'She has twenty students.',
      },
    ],
  },
};
