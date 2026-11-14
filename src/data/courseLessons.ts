// Lessons of the "Lessons" tab (separate from the themed topics): exercise cards and content.
import { hskEntry } from './hsk.ts';
import type { HskChar, HskWord } from '../domain/types.ts';

// Exercises that show a dialogue.
const DIALOGUE_EXERCISES = [
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
  'exercise14',
  'exercise15',
  'exercise16',
  'exercise17',
  'exercise18',
  'exercise19',
] as const;
export type DialogueExercise = (typeof DIALOGUE_EXERCISES)[number];

export type CourseExercise = DialogueExercise | 'words';

// One piece of a dialogue line: a character with its pinyin, or text without a reading
// (punctuation, Latin letters such as "AI").
export type Segment = { t: string; py?: string };

export type DialogueLine = { segments: readonly Segment[]; en: string };

// A vocabulary entry of the "Words" exercise.
export type CourseWord = { zh: string; py: string; en: string };

export type CourseLesson = {
  id: number;
  exercises: readonly CourseExercise[];
  dialogues: Partial<Record<DialogueExercise, readonly DialogueLine[]>>;
  words?: readonly CourseWord[];
  // Card subtitles of this lesson's exercises; without them the shared ones are shown.
  descriptions?: Partial<Record<CourseExercise, string>>;
  // Characters practised in the lesson's exercises (writing and quizzes), split into
  // parts of 8-10 so each round stays short.
  parts?: readonly string[];
};

export const COURSE_LESSONS: readonly CourseLesson[] = [
  {
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
          segments: [
            { t: '您', py: 'nín' },
            { t: '好', py: 'hǎo' },
            { t: '！' },
          ],
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
          segments: [
            { t: '谢', py: 'xiè' },
            { t: '谢', py: 'xie' },
            { t: '！' },
          ],
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
  },
  {
    id: 2,
    parts: ['叫什么名字这时', '来个也月对没'],
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
      'exercise14',
      'exercise15',
      'exercise16',
      'exercise17',
    ],
    descriptions: {
      exercise1: "Ask someone's name",
      exercise2: 'Polite questions with 请问',
      exercise3: 'Who are you?',
      exercise4: "Her name, my cat's name",
      exercise5: 'What and when',
      exercise6: 'Talk about names',
      exercise7: 'Me too',
      exercise8: 'Wrong name, sorry!',
      exercise9: 'Saying no with 不',
      exercise10: 'Who is she?',
      exercise11: 'Apologize and reply',
      exercise12: 'Introduce yourself',
      exercise13: 'Nice to meet you',
      exercise14: 'Very good, very happy',
      exercise15: 'Happy and not happy',
      exercise16: 'Do you know him?',
      exercise17: 'Also with 也',
    },
    dialogues: {
      exercise1: [
        {
          segments: [
            { t: '请', py: 'qǐng' },
            { t: '问', py: 'wèn' },
            { t: '你', py: 'nǐ' },
            { t: '叫', py: 'jiào' },
            { t: '什', py: 'shén' },
            { t: '么', py: 'me' },
            { t: '名', py: 'míng' },
            { t: '字', py: 'zì' },
            { t: '？' },
          ],
          en: 'Excuse me, what is your name?',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '叫', py: 'jiào' },
            { t: '陈', py: 'chén' },
            { t: '天', py: 'tiān' },
            { t: '中', py: 'zhōng' },
            { t: '。' },
          ],
          en: 'My name is Chen Tianzhong.',
        },
      ],
      exercise2: [
        {
          segments: [
            { t: '请', py: 'qǐng' },
            { t: '问', py: 'wèn' },
            { t: '超', py: 'chāo' },
            { t: '市', py: 'shì' },
            { t: '在', py: 'zài' },
            { t: '哪', py: 'nǎ' },
            { t: '儿', py: 'ér' },
            { t: '？' },
          ],
          en: 'Excuse me, where is the supermarket?',
        },
        {
          segments: [
            { t: '请', py: 'qǐng' },
            { t: '问', py: 'wèn' },
            { t: '，' },
            { t: '您', py: 'nín' },
            { t: '是', py: 'shì' },
            { t: '王', py: 'wáng' },
            { t: '老', py: 'lǎo' },
            { t: '师', py: 'shī' },
            { t: '吗', py: 'ma' },
            { t: '？' },
          ],
          en: 'Excuse me, are you Teacher Wang?',
        },
      ],
      exercise3: [
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '好', py: 'hǎo' },
            { t: '！' },
          ],
          en: 'Hello!',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '是', py: 'shì' },
            { t: '谁', py: 'shuí' },
            { t: '？' },
          ],
          en: 'Who are you?',
        },
      ],
      exercise4: [
        {
          segments: [
            { t: '她', py: 'tā' },
            { t: '的', py: 'de' },
            { t: '名', py: 'míng' },
            { t: '字', py: 'zì' },
            { t: '叫', py: 'jiào' },
            { t: '什', py: 'shén' },
            { t: '么', py: 'me' },
            { t: '？' },
          ],
          en: 'What is her name?',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '的', py: 'de' },
            { t: '猫', py: 'māo' },
            { t: '叫', py: 'jiào' },
            { t: 'Coco' },
            { t: '。' },
          ],
          en: "My cat's name is Coco.",
        },
      ],
      exercise5: [
        {
          segments: [
            { t: '这', py: 'zhè' },
            { t: '是', py: 'shì' },
            { t: '什', py: 'shén' },
            { t: '么', py: 'me' },
            { t: '？' },
          ],
          en: 'What is this?',
        },
        {
          segments: [
            { t: '他', py: 'tā' },
            { t: '什', py: 'shén' },
            { t: '么', py: 'me' },
            { t: '时', py: 'shí' },
            { t: '候', py: 'hòu' },
            { t: '来', py: 'lái' },
            { t: '？' },
          ],
          en: 'When is he coming?',
        },
      ],
      exercise6: [
        {
          segments: [
            { t: '这', py: 'zhè' },
            { t: '个', py: 'gè' },
            { t: '名', py: 'míng' },
            { t: '字', py: 'zì' },
            { t: '真', py: 'zhēn' },
            { t: '好', py: 'hǎo' },
            { t: '。' },
          ],
          en: 'This name is really good.',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '的', py: 'de' },
            { t: '猫', py: 'māo' },
            { t: '叫', py: 'jiào' },
            { t: '什', py: 'shén' },
            { t: '么', py: 'me' },
            { t: '名', py: 'míng' },
            { t: '字', py: 'zì' },
            { t: '？' },
          ],
          en: "What is your cat's name?",
        },
      ],
      exercise7: [
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '是', py: 'shì' },
            { t: '学', py: 'xué' },
            { t: '生', py: 'shēng' },
            { t: '。' },
          ],
          en: 'I am a student.',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '也', py: 'yě' },
            { t: '去', py: 'qù' },
            { t: '。' },
          ],
          en: 'I am going too.',
        },
      ],
      exercise8: [
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '好', py: 'hǎo' },
            { t: '，' },
            { t: '安', py: 'ān' },
            { t: '妮', py: 'nī' },
            { t: '！' },
          ],
          en: 'Hello, Annie!',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '好', py: 'hǎo' },
            { t: '，' },
            { t: '陈', py: 'chén' },
            { t: '天', py: 'tiān' },
            { t: '中', py: 'zhōng' },
            { t: '！' },
            { t: '我', py: 'wǒ' },
            { t: '不', py: 'bú' },
            { t: '是', py: 'shì' },
            { t: '安', py: 'ān' },
            { t: '妮', py: 'nī' },
            { t: '，' },
            { t: '我', py: 'wǒ' },
            { t: '是', py: 'shì' },
            { t: '白', py: 'bái' },
            { t: '家', py: 'jiā' },
            { t: '月', py: 'yuè' },
            { t: '。' },
          ],
          en: 'Hello, Chen Tianzhong! I am not Annie, I am Bai Jiayue.',
        },
        {
          segments: [
            { t: '对', py: 'duì' },
            { t: '不', py: 'bù' },
            { t: '起', py: 'qǐ' },
            { t: '！' },
          ],
          en: "I'm sorry!",
        },
        {
          segments: [
            { t: '没', py: 'méi' },
            { t: '关', py: 'guān' },
            { t: '系', py: 'xì' },
            { t: '！' },
          ],
          en: "It's okay!",
        },
      ],
      exercise9: [
        {
          segments: [
            { t: '不', py: 'bù' },
            { t: '能', py: 'néng' },
          ],
          en: 'Cannot',
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
            { t: '不', py: 'bú' },
            { t: '对', py: 'duì' },
          ],
          en: 'Incorrect',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '不', py: 'bú' },
            { t: '是', py: 'shì' },
            { t: '白', py: 'bái' },
            { t: '家', py: 'jiā' },
            { t: '月', py: 'yuè' },
            { t: '。' },
          ],
          en: 'I am not Bai Jiayue.',
        },
        {
          segments: [
            { t: '这', py: 'zhè' },
            { t: '个', py: 'gè' },
            { t: '名', py: 'míng' },
            { t: '字', py: 'zì' },
            { t: '不', py: 'bù' },
            { t: '好', py: 'hǎo' },
            { t: '。' },
          ],
          en: 'This name is not good.',
        },
      ],
      exercise10: [
        {
          segments: [
            { t: '她', py: 'tā' },
            { t: '是', py: 'shì' },
            { t: '谁', py: 'shuí' },
            { t: '？' },
          ],
          en: 'Who is she?',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '是', py: 'shì' },
            { t: '学', py: 'xué' },
            { t: '生', py: 'shēng' },
            { t: '。' },
          ],
          en: 'I am a student.',
        },
      ],
      exercise11: [
        {
          segments: [
            { t: 'A：' },
            { t: '对', py: 'duì' },
            { t: '不', py: 'bù' },
            { t: '起', py: 'qǐ' },
            { t: '！' },
          ],
          en: "A: I'm sorry!",
        },
        {
          segments: [
            { t: 'B：' },
            { t: '没', py: 'méi' },
            { t: '关', py: 'guān' },
            { t: '系', py: 'xì' },
            { t: '！' },
          ],
          en: "B: It's okay!",
        },
        {
          segments: [
            { t: '没', py: 'méi' },
            { t: '事', py: 'shì' },
            { t: '！' },
          ],
          en: 'No problem!',
        },
      ],
      exercise12: [
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '叫', py: 'jiào' },
            { t: '什', py: 'shén' },
            { t: '么', py: 'me' },
            { t: '名', py: 'míng' },
            { t: '字', py: 'zì' },
            { t: '？' },
          ],
          en: 'What is your name?',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '叫', py: 'jiào' },
            { t: '白', py: 'bái' },
            { t: '家', py: 'jiā' },
            { t: '月', py: 'yuè' },
            { t: '。' },
          ],
          en: 'My name is Bai Jiayue.',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '是', py: 'shì' },
            { t: '学', py: 'xué' },
            { t: '生', py: 'shēng' },
            { t: '。' },
          ],
          en: 'I am a student.',
        },
      ],
      exercise13: [
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '好', py: 'hǎo' },
            { t: '！' },
            { t: '我', py: 'wǒ' },
            { t: '叫', py: 'jiào' },
            { t: '李', py: 'lǐ' },
            { t: '文', py: 'wén' },
            { t: '。' },
          ],
          en: 'Hello! My name is Li Wen.',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '好', py: 'hǎo' },
            { t: '！' },
            { t: '我', py: 'wǒ' },
            { t: '叫', py: 'jiào' },
            { t: '白', py: 'bái' },
            { t: '家', py: 'jiā' },
            { t: '月', py: 'yuè' },
            { t: '。' },
          ],
          en: 'Hello! My name is Bai Jiayue.',
        },
        {
          segments: [
            { t: '很', py: 'hěn' },
            { t: '高', py: 'gāo' },
            { t: '兴', py: 'xìng' },
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
            { t: '你', py: 'nǐ' },
            { t: '。' },
          ],
          en: 'Nice to meet you.',
        },
        {
          segments: [
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
            { t: '你', py: 'nǐ' },
            { t: '我', py: 'wǒ' },
            { t: '也', py: 'yě' },
            { t: '很', py: 'hěn' },
            { t: '高', py: 'gāo' },
            { t: '兴', py: 'xìng' },
            { t: '。' },
          ],
          en: 'Nice to meet you too.',
        },
      ],
      exercise14: [
        {
          segments: [
            { t: '很', py: 'hěn' },
            { t: '好', py: 'hǎo' },
          ],
          en: 'Very good',
        },
        {
          segments: [
            { t: '很', py: 'hěn' },
            { t: '高', py: 'gāo' },
            { t: '兴', py: 'xìng' },
          ],
          en: 'Very happy',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '很', py: 'hěn' },
            { t: '好', py: 'hǎo' },
            { t: '。' },
          ],
          en: 'I am very good.',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '们', py: 'men' },
            { t: '很', py: 'hěn' },
            { t: '高', py: 'gāo' },
            { t: '兴', py: 'xìng' },
            { t: '。' },
          ],
          en: 'We are very happy.',
        },
      ],
      exercise15: [
        {
          segments: [
            { t: '很', py: 'hěn' },
            { t: '高', py: 'gāo' },
            { t: '兴', py: 'xìng' },
          ],
          en: 'Very happy',
        },
        {
          segments: [
            { t: '不', py: 'bù' },
            { t: '高', py: 'gāo' },
            { t: '兴', py: 'xìng' },
          ],
          en: 'Not happy',
        },
        {
          segments: [
            { t: '很', py: 'hěn' },
            { t: '高', py: 'gāo' },
            { t: '兴', py: 'xìng' },
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
            { t: '你', py: 'nǐ' },
            { t: '。' },
          ],
          en: 'Nice to meet you.',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '为', py: 'wèi' },
            { t: '什', py: 'shén' },
            { t: '么', py: 'me' },
            { t: '不', py: 'bù' },
            { t: '高', py: 'gāo' },
            { t: '兴', py: 'xìng' },
            { t: '？' },
          ],
          en: 'Why are you not happy?',
        },
      ],
      exercise16: [
        {
          segments: [
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
            { t: '他', py: 'tā' },
          ],
          en: 'Know him',
        },
        {
          segments: [
            { t: '不', py: 'bú' },
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
          ],
          en: "Don't know",
        },
        {
          segments: [
            { t: '很', py: 'hěn' },
            { t: '高', py: 'gāo' },
            { t: '兴', py: 'xìng' },
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
            { t: '你', py: 'nǐ' },
            { t: '！' },
          ],
          en: 'Nice to meet you!',
        },
        {
          segments: [
            { t: 'A：' },
            { t: '你', py: 'nǐ' },
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
            { t: '他', py: 'tā' },
            { t: '吗', py: 'ma' },
            { t: '？' },
          ],
          en: 'A: Do you know him?',
        },
        {
          segments: [
            { t: 'B：' },
            { t: '我', py: 'wǒ' },
            { t: '不', py: 'bú' },
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
            { t: '他', py: 'tā' },
            { t: '。' },
          ],
          en: "B: I don't know him.",
        },
      ],
      exercise17: [
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '也', py: 'yě' },
            { t: '很', py: 'hěn' },
            { t: '高', py: 'gāo' },
            { t: '兴', py: 'xìng' },
            { t: '。' },
          ],
          en: 'I am also very happy.',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '也', py: 'yě' },
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
            { t: '她', py: 'tā' },
            { t: '？' },
          ],
          en: 'You know her too?',
        },
      ],
    },
  },
  {
    id: 3,
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
      'exercise14',
      'exercise15',
      'exercise16',
      'exercise17',
      'exercise18',
      'exercise19',
    ],
    descriptions: {
      exercise1: 'Where are you from?',
      exercise2: 'One person, a good person',
      exercise3: 'Whose? 的 for "my" and "your"',
      exercise4: 'Chinese people, studying in China',
      exercise5: 'French people, French students',
      exercise6: 'Learning and speaking Chinese',
      exercise7: 'Saying who is not French with 不',
      exercise8: "Bai Jiayue's teacher",
      exercise9: 'Who is this? Which country?',
      exercise10: 'This person is my classmate',
      exercise11: 'Asking who with 谁',
      exercise12: 'Whose girlfriend?',
      exercise13: 'Which one? Asking with 哪',
      exercise14: 'Countries with 国',
      exercise15: 'She is British',
      exercise16: 'Thai people, going to Thailand',
      exercise17: 'A phone call with your sister',
      exercise18: 'Answering the phone with 喂',
      exercise19: 'My older sister',
    },
    dialogues: {
      exercise1: [
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '是', py: 'shì' },
            { t: '中', py: 'zhōng' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '。' },
          ],
          en: 'I am Chinese.',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '是', py: 'shì' },
            { t: '法', py: 'fǎ' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '。' },
          ],
          en: 'I am French.',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '的', py: 'de' },
            { t: '中', py: 'zhōng' },
            { t: '文', py: 'wén' },
            { t: '老', py: 'lǎo' },
            { t: '师', py: 'shī' },
            { t: '也', py: 'yě' },
            { t: '是', py: 'shì' },
            { t: '中', py: 'zhōng' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '。' },
          ],
          en: 'My Chinese teacher is also Chinese.',
        },
      ],
      exercise2: [
        {
          segments: [
            { t: '人', py: 'rén' },
            { t: '们', py: 'men' },
            { t: '，' },
            { t: '一', py: 'yī' },
            { t: '个', py: 'gè' },
            { t: '人', py: 'rén' },
            { t: '。' },
          ],
          en: 'People, one person.',
        },
        {
          segments: [
            { t: '他', py: 'tā' },
            { t: '是', py: 'shì' },
            { t: '一', py: 'yī' },
            { t: '个', py: 'gè' },
            { t: '好', py: 'hǎo' },
            { t: '人', py: 'rén' },
            { t: '。' },
          ],
          en: 'He is a good person.',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
            { t: '这', py: 'zhè' },
            { t: '个', py: 'gè' },
            { t: '人', py: 'rén' },
            { t: '吗', py: 'ma' },
            { t: '？' },
          ],
          en: 'Do you know this person?',
        },
      ],
      exercise3: [
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '的', py: 'de' },
            { t: '老', py: 'lǎo' },
            { t: '师', py: 'shī' },
            { t: '，' },
            { t: '你', py: 'nǐ' },
            { t: '的', py: 'de' },
            { t: '名', py: 'míng' },
            { t: '字', py: 'zì' },
          ],
          en: 'My teacher, your name',
        },
        {
          segments: [
            { t: '王', py: 'wáng' },
            { t: '老', py: 'lǎo' },
            { t: '师', py: 'shī' },
            { t: '是', py: 'shì' },
            { t: '他', py: 'tā' },
            { t: '的', py: 'de' },
            { t: '老', py: 'lǎo' },
            { t: '师', py: 'shī' },
            { t: '。' },
          ],
          en: 'Teacher Wang is his teacher.',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '的', py: 'de' },
            { t: '名', py: 'míng' },
            { t: '字', py: 'zì' },
            { t: '很', py: 'hěn' },
            { t: '好', py: 'hǎo' },
            { t: '。' },
          ],
          en: 'Your name is very good.',
        },
      ],
      exercise4: [
        {
          segments: [
            { t: '中', py: 'zhōng' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '，' },
            { t: '中', py: 'zhōng' },
            { t: '国', py: 'guó' },
            { t: '学', py: 'xué' },
            { t: '生', py: 'shēng' },
          ],
          en: 'Chinese person, Chinese student',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '是', py: 'shì' },
            { t: '中', py: 'zhōng' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '。' },
          ],
          en: 'I am Chinese.',
        },
        {
          segments: [
            { t: '他', py: 'tā' },
            { t: '在', py: 'zài' },
            { t: '中', py: 'zhōng' },
            { t: '国', py: 'guó' },
            { t: '学', py: 'xué' },
            { t: '习', py: 'xí' },
            { t: '。' },
          ],
          en: 'He studies in China.',
        },
      ],
      exercise5: [
        {
          segments: [
            { t: '法', py: 'fǎ' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '，' },
            { t: '法', py: 'fǎ' },
            { t: '国', py: 'guó' },
            { t: '学', py: 'xué' },
            { t: '生', py: 'shēng' },
          ],
          en: 'French person, French student',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
            { t: '一', py: 'yī' },
            { t: '个', py: 'gè' },
            { t: '法', py: 'fǎ' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
          ],
          en: 'I know a French person',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '是', py: 'shì' },
            { t: '法', py: 'fǎ' },
            { t: '国', py: 'guó' },
            { t: '学', py: 'xué' },
            { t: '生', py: 'shēng' },
            { t: '。' },
          ],
          en: 'I am a French student.',
        },
      ],
      exercise6: [
        {
          segments: [
            { t: '中', py: 'zhōng' },
            { t: '文', py: 'wén' },
            { t: '老', py: 'lǎo' },
            { t: '师', py: 'shī' },
            { t: '，' },
            { t: '学', py: 'xué' },
            { t: '中', py: 'zhōng' },
            { t: '文', py: 'wén' },
            { t: '，' },
            { t: '说', py: 'shuō' },
            { t: '中', py: 'zhōng' },
            { t: '文', py: 'wén' },
          ],
          en: 'Chinese teacher, study Chinese, speak Chinese',
        },
        {
          segments: [
            { t: '他', py: 'tā' },
            { t: '中', py: 'zhōng' },
            { t: '文', py: 'wén' },
            { t: '很', py: 'hěn' },
            { t: '好', py: 'hǎo' },
            { t: '。' },
          ],
          en: 'His Chinese is very good.',
        },
        {
          segments: [
            { t: '同', py: 'tóng' },
            { t: '学', py: 'xué' },
            { t: '们', py: 'men' },
            { t: '一', py: 'yī' },
            { t: '起', py: 'qǐ' },
            { t: '学', py: 'xué' },
            { t: '中', py: 'zhōng' },
            { t: '文', py: 'wén' },
            { t: '。' },
          ],
          en: 'Classmates study Chinese together.',
        },
      ],
      exercise7: [
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '是', py: 'shì' },
            { t: '法', py: 'fǎ' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '。' },
          ],
          en: 'I am French.',
        },
        {
          segments: [
            { t: '她', py: 'tā' },
            { t: '是', py: 'shì' },
            { t: '中', py: 'zhōng' },
            { t: '文', py: 'wén' },
            { t: '老', py: 'lǎo' },
            { t: '师', py: 'shī' },
            { t: '。' },
          ],
          en: 'She is a Chinese teacher.',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '老', py: 'lǎo' },
            { t: '师', py: 'shī' },
            { t: '不', py: 'bú' },
            { t: '是', py: 'shì' },
            { t: '法', py: 'fǎ' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '。' },
          ],
          en: 'My teacher is not French.',
        },
      ],
      exercise8: [
        {
          segments: [
            { t: '白', py: 'bái' },
            { t: '家', py: 'jiā' },
            { t: '月', py: 'yuè' },
            { t: '的', py: 'de' },
            { t: '中', py: 'zhōng' },
            { t: '文', py: 'wén' },
            { t: '老', py: 'lǎo' },
            { t: '师', py: 'shī' },
          ],
          en: "Bai Jiayue's Chinese teacher",
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '的', py: 'de' },
            { t: '名', py: 'míng' },
            { t: '字', py: 'zì' },
          ],
          en: 'Your name',
        },
      ],
      exercise9: [
        {
          segments: [
            { t: '这', py: 'zhè' },
            { t: '是', py: 'shì' },
            { t: '谁', py: 'shuí' },
            { t: '？' },
          ],
          en: 'Who is this?',
        },
        {
          segments: [
            { t: '这', py: 'zhè' },
            { t: '是', py: 'shì' },
            { t: '我', py: 'wǒ' },
            { t: '女', py: 'nǚ' },
            { t: '朋', py: 'péng' },
            { t: '友', py: 'yǒu' },
            { t: '。' },
          ],
          en: 'This is my girlfriend.',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '女', py: 'nǚ' },
            { t: '朋', py: 'péng' },
            { t: '友', py: 'yǒu' },
            { t: '是', py: 'shì' },
            { t: '哪', py: 'nǎ' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '？' },
          ],
          en: 'What nationality is your girlfriend?',
        },
        {
          segments: [
            { t: '她', py: 'tā' },
            { t: '也', py: 'yě' },
            { t: '是', py: 'shì' },
            { t: '泰', py: 'tài' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '。' },
          ],
          en: 'She is also Thai.',
        },
      ],
      exercise10: [
        {
          segments: [
            { t: '这', py: 'zhè' },
            { t: '个', py: 'gè' },
            { t: '，' },
            { t: '这', py: 'zhè' },
            { t: '里', py: 'lǐ' },
          ],
          en: 'this, here',
        },
        {
          segments: [
            { t: '这', py: 'zhè' },
            { t: '是', py: 'shì' },
            { t: '谁', py: 'shuí' },
            { t: '？' },
          ],
          en: 'Who is this?',
        },
        {
          segments: [
            { t: '这', py: 'zhè' },
            { t: '个', py: 'gè' },
            { t: '人', py: 'rén' },
            { t: '是', py: 'shì' },
            { t: '我', py: 'wǒ' },
            { t: '的', py: 'de' },
            { t: '同', py: 'tóng' },
            { t: '学', py: 'xué' },
            { t: '。' },
          ],
          en: 'This person is my classmate.',
        },
      ],
      exercise11: [
        {
          segments: [
            { t: '谁', py: 'shuí' },
            { t: '的', py: 'de' },
            { t: '，' },
            { t: '是', py: 'shì' },
            { t: '谁', py: 'shuí' },
          ],
          en: 'whose, who is it',
        },
        {
          segments: [
            { t: '这', py: 'zhè' },
            { t: '是', py: 'shì' },
            { t: '谁', py: 'shuí' },
            { t: '？' },
          ],
          en: 'Who is this?',
        },
        {
          segments: [
            { t: '谁', py: 'shuí' },
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
            { t: '法', py: 'fǎ' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '？' },
          ],
          en: 'Who knows French people?',
        },
      ],
      exercise12: [
        {
          segments: [
            { t: '她', py: 'tā' },
            { t: '是', py: 'shì' },
            { t: '谁', py: 'shuí' },
            { t: '的', py: 'de' },
            { t: '女', py: 'nǚ' },
            { t: '朋', py: 'péng' },
            { t: '友', py: 'yǒu' },
            { t: '？' },
          ],
          en: 'Whose girlfriend is she?',
        },
        {
          segments: [
            { t: '他', py: 'tā' },
            { t: '的', py: 'de' },
            { t: '女', py: 'nǚ' },
            { t: '朋', py: 'péng' },
            { t: '友', py: 'yǒu' },
            { t: '很', py: 'hěn' },
            { t: '漂', py: 'piào' },
            { t: '亮', py: 'liang' },
            { t: '。' },
          ],
          en: 'His girlfriend is very pretty.',
        },
      ],
      exercise13: [
        {
          segments: [
            { t: '哪', py: 'nǎ' },
            { t: '国', py: 'guó' },
            { t: '，' },
            { t: '哪', py: 'nǎ' },
            { t: '个', py: 'gè' },
          ],
          en: 'which country, which',
        },
        {
          segments: [
            { t: '他', py: 'tā' },
            { t: '是', py: 'shì' },
            { t: '哪', py: 'nǎ' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '？' },
          ],
          en: 'What nationality is he?',
        },
        {
          segments: [
            { t: '哪', py: 'nǎ' },
            { t: '个', py: 'gè' },
            { t: '人', py: 'rén' },
            { t: '是', py: 'shì' },
            { t: '你', py: 'nǐ' },
            { t: '女', py: 'nǚ' },
            { t: '朋', py: 'péng' },
            { t: '友', py: 'yǒu' },
            { t: '？' },
          ],
          en: 'Which person is your girlfriend?',
        },
      ],
      exercise14: [
        {
          segments: [
            { t: '哪', py: 'nǎ' },
            { t: '国', py: 'guó' },
            { t: '，' },
            { t: '我', py: 'wǒ' },
            { t: '国', py: 'guó' },
            { t: '，' },
            { t: '两', py: 'liǎng' },
            { t: '国', py: 'guó' },
          ],
          en: 'which country, our country, two countries',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '是', py: 'shì' },
            { t: '哪', py: 'nǎ' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '？' },
          ],
          en: 'What nationality are you?',
        },
        {
          segments: [
            { t: '两', py: 'liǎng' },
            { t: '国', py: 'guó' },
            { t: '学', py: 'xué' },
            { t: '生', py: 'shēng' },
            { t: '是', py: 'shì' },
            { t: '朋', py: 'péng' },
            { t: '友', py: 'yǒu' },
            { t: '。' },
          ],
          en: 'Students from the two countries are friends.',
        },
      ],
      exercise15: [
        {
          segments: [
            { t: '她', py: 'tā' },
            { t: '们', py: 'men' },
            { t: '，' },
            { t: '她', py: 'tā' },
            { t: '的', py: 'de' },
          ],
          en: 'they (female), her',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '认', py: 'rèn' },
            { t: '识', py: 'shí' },
            { t: '她', py: 'tā' },
            { t: '吗', py: 'ma' },
            { t: '？' },
          ],
          en: 'Do you know her?',
        },
        {
          segments: [
            { t: '她', py: 'tā' },
            { t: '是', py: 'shì' },
            { t: '英', py: 'yīng' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '。' },
          ],
          en: 'She is British.',
        },
      ],
      exercise16: [
        {
          segments: [
            { t: '泰', py: 'tài' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '，' },
            { t: '泰', py: 'tài' },
            { t: '国', py: 'guó' },
            { t: '学', py: 'xué' },
            { t: '生', py: 'shēng' },
          ],
          en: 'Thai person, Thai student',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '想', py: 'xiǎng' },
            { t: '去', py: 'qù' },
            { t: '泰', py: 'tài' },
            { t: '国', py: 'guó' },
            { t: '。' },
          ],
          en: 'I want to go to Thailand.',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '的', py: 'de' },
            { t: '女', py: 'nǚ' },
            { t: '朋', py: 'péng' },
            { t: '友', py: 'yǒu' },
            { t: '是', py: 'shì' },
            { t: '泰', py: 'tài' },
            { t: '国', py: 'guó' },
            { t: '人', py: 'rén' },
            { t: '。' },
          ],
          en: 'My girlfriend is Thai.',
        },
      ],
      exercise17: [
        {
          segments: [
            { t: '喂', py: 'wèi' },
            { t: '，' },
            { t: '一', py: 'yī' },
            { t: '飞', py: 'fēi' },
            { t: '！' },
          ],
          en: 'Hello, Yifei!',
        },
        {
          segments: [
            { t: '姐', py: 'jiě' },
            { t: '姐', py: 'jie' },
            { t: '！' },
          ],
          en: 'Older sister!',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '工', py: 'gōng' },
            { t: '作', py: 'zuò' },
            { t: '还', py: 'hái' },
            { t: '忙', py: 'máng' },
            { t: '吗', py: 'ma' },
            { t: '？' },
          ],
          en: 'Are you still busy with work?',
        },
        {
          segments: [
            { t: '对', py: 'duì' },
            { t: '，' },
            { t: '还', py: 'hái' },
            { t: '很', py: 'hěn' },
            { t: '忙', py: 'máng' },
            { t: '。' },
          ],
          en: 'Yes, still very busy.',
        },
        {
          segments: [
            { t: '你', py: 'nǐ' },
            { t: '也', py: 'yě' },
            { t: '很', py: 'hěn' },
            { t: '忙', py: 'máng' },
            { t: '吗', py: 'ma' },
            { t: '？' },
          ],
          en: 'Are you also very busy?',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '不', py: 'bú' },
            { t: '太', py: 'tài' },
            { t: '忙', py: 'máng' },
            { t: '。' },
          ],
          en: "I'm not too busy.",
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '们', py: 'men' },
            { t: '很', py: 'hěn' },
            { t: '想', py: 'xiǎng' },
            { t: '你', py: 'nǐ' },
            { t: '。' },
          ],
          en: 'We miss you very much.',
        },
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '也', py: 'yě' },
            { t: '想', py: 'xiǎng' },
            { t: '你', py: 'nǐ' },
            { t: '们', py: 'men' },
            { t: '。' },
          ],
          en: 'I miss you all too.',
        },
      ],
      exercise18: [
        {
          segments: [
            { t: '喂', py: 'wèi' },
            { t: '，' },
            { t: '请', py: 'qǐng' },
            { t: '问', py: 'wèn' },
            { t: '是', py: 'shì' },
            { t: '王', py: 'wáng' },
            { t: '老', py: 'lǎo' },
            { t: '师', py: 'shī' },
            { t: '吗', py: 'ma' },
            { t: '？' },
          ],
          en: 'Hello, may I ask if this is Teacher Wang?',
        },
        {
          segments: [
            { t: '喂', py: 'wèi' },
            { t: '！' },
            { t: '你', py: 'nǐ' },
            { t: '叫', py: 'jiào' },
            { t: '什', py: 'shén' },
            { t: '么', py: 'me' },
            { t: '名', py: 'míng' },
            { t: '字', py: 'zì' },
            { t: '？' },
          ],
          en: 'Hey! What is your name?',
        },
      ],
      exercise19: [
        {
          segments: [
            { t: '我', py: 'wǒ' },
            { t: '姐', py: 'jiě' },
            { t: '姐', py: 'jie' },
            { t: '，' },
            { t: '我', py: 'wǒ' },
            { t: '的', py: 'de' },
            { t: '姐', py: 'jiě' },
            { t: '姐', py: 'jie' },
            { t: '，' },
            { t: '一', py: 'yí' },
            { t: '个', py: 'gè' },
            { t: '姐', py: 'jiě' },
            { t: '姐', py: 'jie' },
          ],
          en: 'my older sister, my older sister, an older sister',
        },
        {
          segments: [
            { t: '她', py: 'tā' },
            { t: '姐', py: 'jiě' },
            { t: '姐', py: 'jie' },
            { t: '是', py: 'shì' },
            { t: '我', py: 'wǒ' },
            { t: '同', py: 'tóng' },
            { t: '学', py: 'xué' },
            { t: '。' },
          ],
          en: 'Her older sister is my classmate.',
        },
        {
          segments: [
            { t: '他', py: 'tā' },
            { t: '们', py: 'men' },
            { t: '没', py: 'méi' },
            { t: '有', py: 'yǒu' },
            { t: '姐', py: 'jiě' },
            { t: '姐', py: 'jie' },
            { t: '。' },
          ],
          en: "They don't have an older sister.",
        },
      ],
    },
  },
];

export const isDialogueExercise = (x: unknown): x is DialogueExercise =>
  (DIALOGUE_EXERCISES as readonly unknown[]).includes(x);

// Exercises shown as a list of lines: the dialogues and the vocabulary.
export type LinesExercise = DialogueExercise | 'words';

export const isLinesExercise = (x: unknown): x is LinesExercise =>
  x === 'words' || isDialogueExercise(x);

// The lines of an exercise; a word is one line with its pinyin over the whole word.
export function exerciseLines(
  lesson: CourseLesson,
  ex: LinesExercise,
): readonly DialogueLine[] | undefined {
  if (ex !== 'words') return lesson.dialogues[ex];
  return lesson.words?.map((w) => ({
    segments: [{ t: w.zh, py: w.py }],
    en: w.en,
  }));
}

// Whether an exercise has content; the rest are shown as "soon".
export const isExerciseReady = (lesson: CourseLesson, ex: CourseExercise) =>
  isLinesExercise(ex) && (exerciseLines(lesson, ex)?.length ?? 0) > 0;

export const courseLesson = (id: string | undefined) =>
  COURSE_LESSONS.find((l) => String(l.id) === id);

const hskChars = (chars: Iterable<string>): HskChar[] =>
  [...new Set(chars)].flatMap((c) => hskEntry(c) ?? []);

// The lesson's practice parts: its own list, or else one part with every distinct
// character of its vocabulary; none if it has neither. Each part has its HSK readings
// and meanings.
export function courseParts(lesson: CourseLesson): HskChar[][] {
  if (lesson.parts) return lesson.parts.map((part) => hskChars(part));
  const chars = hskChars((lesson.words ?? []).flatMap((w) => [...w.zh]));
  return chars.length > 0 ? [chars] : [];
}

// One part (1-based) of the lesson's practice characters.
export const coursePart = (
  lesson: CourseLesson,
  part: number,
): HskChar[] | undefined => courseParts(lesson)[part - 1];

// Multi-character vocabulary entries for a part's word quiz: words that use one of the
// part's characters and otherwise only characters of this or earlier parts.
export function courseWords(lesson: CourseLesson, part: number): HskWord[] {
  const parts = courseParts(lesson).map((p) => p.map((e) => e.c));
  const own = new Set(parts[part - 1]);
  const known = new Set(parts.slice(0, part).flat());
  return (lesson.words ?? [])
    .filter((w) => {
      const cs = [...w.zh];
      return (
        cs.length > 1 &&
        cs.some((c) => own.has(c)) &&
        cs.every((c) => known.has(c))
      );
    })
    .map((w) => ({ w: w.zh, py: w.py, en: w.en }));
}
