// Lesson 1 of the "Lessons" tab.
import type { CourseLesson } from '../courseLessons.ts';

export const lesson1: CourseLesson = {
  id: 1,
  parts: [
    '你我他她们好很不是',
    '有的吗了大家学生',
    '小中文语同习人和',
    '去儿多少天在上下',
  ],
  exercises: [
    'exercise1',
    'exercise2',
    'exercise3',
    'exercise4',
    'exercise5',
    'exercise6',
    'exercise7',
    'exercise8',
    'exercise9',
    'exercise10',
    'exercise11',
    'exercise12',
    'exercise13',
    'words',
  ],
  dialogues: {
    exercise1: [
      {
        segments: [
          { t: 'AI' },
          { t: '小', py: 'xiǎo' },
          { t: '语', py: 'yǔ' },
          { t: '，' },
          { t: '你', py: 'nǐ' },
          { t: '好', py: 'hǎo' },
          { t: '！' },
        ],
        en: 'Hello, AI Xiaoyu!',
      },
      {
        segments: [
          { t: '王', py: 'wáng' },
          { t: '老', py: 'lǎo' },
          { t: '师', py: 'shī' },
          { t: '，' },
          { t: '你', py: 'nǐ' },
          { t: '好', py: 'hǎo' },
          { t: '！' },
        ],
        en: 'Hello, Teacher Wang!',
      },
    ],
    exercise2: [
      {
        segments: [
          { t: '大', py: 'dà' },
          { t: '家', py: 'jiā' },
          { t: '好', py: 'hǎo' },
          { t: '！' },
        ],
        en: 'Hello, everyone!',
      },
      {
        segments: [
          { t: '老', py: 'lǎo' },
          { t: '师', py: 'shī' },
          { t: '，' },
          { t: '您', py: 'nín' },
          { t: '好', py: 'hǎo' },
          { t: '！' },
        ],
        en: 'Hello, teacher!',
      },
      {
        segments: [
          { t: '你', py: 'nǐ' },
          { t: '们', py: 'men' },
          { t: '好', py: 'hǎo' },
          { t: '！' },
        ],
        en: 'Hello, everyone!',
      },
      {
        segments: [
          { t: '你', py: 'nǐ' },
          { t: '好', py: 'hǎo' },
          { t: '，' },
          { t: '小', py: 'xiǎo' },
          { t: '语', py: 'yǔ' },
          { t: '！' },
        ],
        en: 'Hello, Xiaoyu!',
      },
    ],
    exercise3: [
      {
        segments: [
          { t: '大', py: 'dà' },
          { t: '家', py: 'jiā' },
          { t: '好', py: 'hǎo' },
          { t: '！' },
        ],
        en: 'Hello, everyone!',
      },
      {
        segments: [
          { t: '谢', py: 'xiè' },
          { t: '谢', py: 'xie' },
          { t: '大', py: 'dà' },
          { t: '家', py: 'jiā' },
          { t: '！' },
        ],
        en: 'Thank you, everyone!',
      },
    ],
    exercise4: [
      {
        segments: [
          { t: '很', py: 'hěn' },
          { t: '好', py: 'hǎo' },
        ],
        en: 'Very good',
      },
      {
        segments: [
          { t: '不', py: 'bù' },
          { t: '好', py: 'hǎo' },
        ],
        en: 'Not good',
      },
      {
        segments: [
          { t: '他', py: 'tā' },
          { t: '学', py: 'xué' },
          { t: '习', py: 'xí' },
          { t: '很', py: 'hěn' },
          { t: '好', py: 'hǎo' },
          { t: '。' },
        ],
        en: 'He studies very well.',
      },
      {
        segments: [
          { t: '我', py: 'wǒ' },
          { t: '中', py: 'zhōng' },
          { t: '文', py: 'wén' },
          { t: '不', py: 'bù' },
          { t: '好', py: 'hǎo' },
          { t: '。' },
        ],
        en: "My Chinese isn't good.",
      },
    ],
    exercise5: [
      {
        segments: [
          { t: '小', py: 'xiǎo' },
          { t: '学', py: 'xué' },
          { t: '生', py: 'shēng' },
        ],
        en: 'Primary school student',
      },
      {
        segments: [
          { t: '中', py: 'zhōng' },
          { t: '学', py: 'xué' },
          { t: '生', py: 'shēng' },
        ],
        en: 'Middle school student',
      },
      {
        segments: [
          { t: '大', py: 'dà' },
          { t: '学', py: 'xué' },
          { t: '生', py: 'shēng' },
        ],
        en: 'University student',
      },
      {
        segments: [
          { t: '他', py: 'tā' },
          { t: '是', py: 'shì' },
          { t: '李', py: 'lǐ' },
          { t: '老', py: 'lǎo' },
          { t: '师', py: 'shī' },
          { t: '的', py: 'de' },
          { t: '学', py: 'xué' },
          { t: '生', py: 'shēng' },
          { t: '。' },
        ],
        en: "He is Teacher Li's student.",
      },
      {
        segments: [
          { t: '你', py: 'nǐ' },
          { t: '们', py: 'men' },
          { t: '学', py: 'xué' },
          { t: '校', py: 'xiào' },
          { t: '有', py: 'yǒu' },
          { t: '多', py: 'duō' },
          { t: '少', py: 'shao' },
          { t: '学', py: 'xué' },
          { t: '生', py: 'shēng' },
          { t: '？' },
        ],
        en: 'How many students are there at your school?',
      },
    ],
    exercise6: [
      {
        segments: [
          { t: '你', py: 'nǐ' },
          { t: '们', py: 'men' },
        ],
        en: 'You (plural)',
      },
      {
        segments: [
          { t: '我', py: 'wǒ' },
          { t: '们', py: 'men' },
        ],
        en: 'We / Us',
      },
      {
        segments: [
          { t: '他', py: 'tā' },
          { t: '们', py: 'men' },
        ],
        en: 'They / Them',
      },
      {
        segments: [
          { t: '同', py: 'tóng' },
          { t: '学', py: 'xué' },
          { t: '们', py: 'men' },
        ],
        en: 'Classmates',
      },
      {
        segments: [
          { t: '你', py: 'nǐ' },
          { t: '们', py: 'men' },
          { t: '好', py: 'hǎo' },
          { t: '吗', py: 'ma' },
          { t: '？' },
        ],
        en: 'How are you all?',
      },
      {
        segments: [
          { t: '他', py: 'tā' },
          { t: '们', py: 'men' },
          { t: '正', py: 'zhèng' },
          { t: '在', py: 'zài' },
          { t: '上', py: 'shàng' },
          { t: '课', py: 'kè' },
          { t: '。' },
        ],
        en: 'They are having a class.',
      },
    ],
    exercise7: [
      {
        segments: [
          { t: '我', py: 'wǒ' },
          { t: '的', py: 'de' },
          { t: '老', py: 'lǎo' },
          { t: '师', py: 'shī' },
        ],
        en: 'My teacher',
      },
      {
        segments: [
          { t: '中', py: 'zhōng' },
          { t: '文', py: 'wén' },
          { t: '老', py: 'lǎo' },
          { t: '师', py: 'shī' },
        ],
        en: 'Chinese language teacher',
      },
      {
        segments: [
          { t: '王', py: 'wáng' },
          { t: '老', py: 'lǎo' },
          { t: '师', py: 'shī' },
        ],
        en: 'Teacher Wang',
      },
      {
        segments: [
          { t: '他', py: 'tā' },
          { t: '是', py: 'shì' },
          { t: '老', py: 'lǎo' },
          { t: '师', py: 'shī' },
          { t: '。' },
        ],
        en: 'He is a teacher.',
      },
      {
        segments: [
          { t: '她', py: 'tā' },
          { t: '是', py: 'shì' },
          { t: '我', py: 'wǒ' },
          { t: '的', py: 'de' },
          { t: '中', py: 'zhōng' },
          { t: '文', py: 'wén' },
          { t: '老', py: 'lǎo' },
          { t: '师', py: 'shī' },
          { t: '。' },
        ],
        en: 'She is my Chinese teacher.',
      },
    ],
    exercise8: [
      {
        segments: [{ t: '您', py: 'nín' }, { t: '好', py: 'hǎo' }, { t: '！' }],
        en: 'Hello! (polite)',
      },
      {
        segments: [
          { t: '您', py: 'nín' },
          { t: '去', py: 'qù' },
          { t: '哪儿', py: 'nǎr' },
          { t: '？' },
        ],
        en: 'Where are you going?',
      },
    ],
    exercise9: [
      {
        segments: [
          { t: '你', py: 'nǐ' },
          { t: '们', py: 'men' },
          { t: '好', py: 'hǎo' },
        ],
        en: 'Hello, everyone!',
      },
      {
        segments: [
          { t: '谢', py: 'xiè' },
          { t: '谢', py: 'xie' },
          { t: '你', py: 'nǐ' },
          { t: '们', py: 'men' },
          { t: '。' },
        ],
        en: 'Thank you all.',
      },
      {
        segments: [
          { t: '你', py: 'nǐ' },
          { t: '们', py: 'men' },
          { t: '是', py: 'shì' },
          { t: '哪', py: 'nǎ' },
          { t: '里', py: 'lǐ' },
          { t: '人', py: 'rén' },
          { t: '？' },
        ],
        en: 'Where are you all from?',
      },
    ],
    exercise10: [
      {
        segments: [{ t: '谢', py: 'xiè' }, { t: '谢', py: 'xie' }, { t: '！' }],
        en: 'Thank you!',
      },
      {
        segments: [
          { t: '不', py: 'bú' },
          { t: '客', py: 'kè' },
          { t: '气', py: 'qi' },
          { t: '！' },
        ],
        en: "You're welcome!",
      },
      {
        segments: [
          { t: '同', py: 'tóng' },
          { t: '学', py: 'xué' },
          { t: '们', py: 'men' },
          { t: '，' },
          { t: '再', py: 'zài' },
          { t: '见', py: 'jiàn' },
          { t: '！' },
        ],
        en: 'Goodbye, classmates!',
      },
      {
        segments: [
          { t: '老', py: 'lǎo' },
          { t: '师', py: 'shī' },
          { t: '，' },
          { t: '再', py: 'zài' },
          { t: '见', py: 'jiàn' },
          { t: '！' },
        ],
        en: 'Goodbye, teacher!',
      },
    ],
    exercise11: [
      {
        segments: [
          { t: '谢', py: 'xiè' },
          { t: '谢', py: 'xie' },
          { t: '你', py: 'nǐ' },
          { t: '！' },
        ],
        en: 'Thank you!',
      },
      {
        segments: [
          { t: '谢', py: 'xiè' },
          { t: '谢', py: 'xie' },
          { t: '大', py: 'dà' },
          { t: '家', py: 'jiā' },
          { t: '！' },
        ],
        en: 'Thank you, everyone!',
      },
    ],
    exercise12: [
      {
        segments: [
          { t: '同', py: 'tóng' },
          { t: '学', py: 'xué' },
          { t: '们', py: 'men' },
          { t: '好', py: 'hǎo' },
          { t: '！' },
        ],
        en: 'Hello, classmates!',
      },
      {
        segments: [
          { t: '我', py: 'wǒ' },
          { t: '和', py: 'hé' },
          { t: '他', py: 'tā' },
          { t: '是', py: 'shì' },
          { t: '同', py: 'tóng' },
          { t: '学', py: 'xué' },
          { t: '。' },
        ],
        en: 'He and I are classmates.',
      },
    ],
    exercise13: [
      {
        segments: [
          { t: '再', py: 'zài' },
          { t: '见', py: 'jiàn' },
          { t: '，' },
          { t: '明', py: 'míng' },
          { t: '天', py: 'tiān' },
          { t: '见', py: 'jiàn' },
          { t: '！' },
        ],
        en: 'Goodbye, see you tomorrow!',
      },
      {
        segments: [
          { t: '我', py: 'wǒ' },
          { t: '下', py: 'xià' },
          { t: '班', py: 'bān' },
          { t: '了', py: 'le' },
          { t: '，' },
          { t: '再', py: 'zài' },
          { t: '见', py: 'jiàn' },
          { t: '。' },
        ],
        en: "I'm off work. Goodbye!",
      },
    ],
  },
  words: [
    { zh: '你', py: 'nǐ', en: 'You' },
    { zh: '您', py: 'nín', en: 'You (polite)' },
    { zh: '我', py: 'wǒ', en: 'I / Me' },
    { zh: '他', py: 'tā', en: 'He / Him' },
    { zh: '她', py: 'tā', en: 'She / Her' },
    { zh: '们', py: 'men', en: 'Plural suffix' },
    { zh: '你们', py: 'nǐmen', en: 'You (plural)' },
    { zh: '我们', py: 'wǒmen', en: 'We / Us' },
    { zh: '他们', py: 'tāmen', en: 'They / Them' },
    { zh: '好', py: 'hǎo', en: 'Good' },
    { zh: '很', py: 'hěn', en: 'Very' },
    { zh: '不', py: 'bù', en: 'Not / No' },
    { zh: '是', py: 'shì', en: 'To be' },
    { zh: '有', py: 'yǒu', en: 'To have' },
    { zh: '的', py: 'de', en: 'Possessive particle' },
    { zh: '吗', py: 'ma', en: 'Question particle' },
    { zh: '了', py: 'le', en: 'Aspect / change-of-state particle' },
    { zh: '大家', py: 'dàjiā', en: 'Everyone' },
    { zh: '老师', py: 'lǎoshī', en: 'Teacher' },
    { zh: '学生', py: 'xuéshēng', en: 'Student' },
    { zh: '小学生', py: 'xiǎoxuéshēng', en: 'Primary school student' },
    { zh: '中学生', py: 'zhōngxuéshēng', en: 'Middle school student' },
    { zh: '大学生', py: 'dàxuéshēng', en: 'University student' },
    { zh: '同学', py: 'tóngxué', en: 'Classmate' },
    { zh: '同学们', py: 'tóngxuémen', en: 'Classmates' },
    { zh: '学校', py: 'xuéxiào', en: 'School' },
    { zh: '学习', py: 'xuéxí', en: 'To study' },
    { zh: '中文', py: 'Zhōngwén', en: 'Chinese language' },
    { zh: '中文老师', py: 'Zhōngwén lǎoshī', en: 'Chinese teacher' },
    { zh: '人', py: 'rén', en: 'Person' },
    { zh: '和', py: 'hé', en: 'And / With' },
    { zh: '去', py: 'qù', en: 'To go' },
    { zh: '哪儿', py: 'nǎr', en: 'Where' },
    { zh: '哪里', py: 'nǎlǐ', en: 'Where' },
    { zh: '多少', py: 'duōshao', en: 'How many / How much' },
    { zh: '正在', py: 'zhèngzài', en: 'Currently / In the process of' },
    { zh: '上课', py: 'shàngkè', en: 'To attend class / Teach a class' },
    { zh: '下班', py: 'xiàbān', en: 'To finish work' },
    { zh: '明天', py: 'míngtiān', en: 'Tomorrow' },
    { zh: '见', py: 'jiàn', en: 'To see / Meet' },
    { zh: '谢谢', py: 'xièxie', en: 'Thank you' },
    { zh: '客气', py: 'kèqi', en: 'Polite / Courteous' },
    { zh: '再见', py: 'zàijiàn', en: 'Goodbye' },
  ],
};
