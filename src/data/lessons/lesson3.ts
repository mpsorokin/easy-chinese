// Lesson 3 of the "Lessons" tab.
import type { CourseLesson } from '../courseLessons.ts';

export const lesson3: CourseLesson = {
  id: 3,
  parts: ['国一说女朋友哪里', '漂亮两想喂姐工', '作还忙太喜欢今'],
  exercises: ['exercise1', 'exercise2', 'exercise3', 'exercise4', 'exercise5', 'exercise6', 'exercise7', 'exercise8', 'exercise9', 'exercise10', 'exercise11', 'exercise12', 'exercise13', 'exercise14', 'exercise15', 'exercise16', 'exercise17', 'exercise18', 'exercise19', 'exercise20', 'exercise21', 'exercise22', 'exercise23', 'exercise24', 'exercise25', 'exercise26', 'exercise27', 'words'],
  descriptions: { exercise1: 'Where are you from?', exercise2: 'One person, a good person', exercise3: 'Whose? 的 for "my" and "your"', exercise4: 'Chinese people, studying in China', exercise5: 'French people, French students', exercise6: 'Learning and speaking Chinese', exercise7: 'Saying who is not French with 不', exercise8: "Bai Jiayue's teacher", exercise9: 'Who is this? Which country?', exercise10: 'This person is my classmate', exercise11: 'Asking who with 谁', exercise12: 'Whose girlfriend?', exercise13: 'Which one? Asking with 哪', exercise14: 'Countries with 国', exercise15: 'She is British', exercise16: 'Thai people, going to Thailand', exercise17: 'A phone call with your sister', exercise18: 'Answering the phone with 喂', exercise19: 'My older sister', exercise20: 'Having a job', exercise21: 'Still busy? Still there?', exercise22: 'Busy or not busy?', exercise23: 'Do you have a job?', exercise24: 'Right or not? Answering with 对', exercise25: 'Too busy! Great! With 太…了', exercise26: 'Going to school together', exercise27: 'I miss you', words: 'Countries, friends and work' },
  dialogues: {
    exercise1: [
      { segments: [{ t: '我', py: 'wǒ' }, { t: '是', py: 'shì' }, { t: '中', py: 'zhōng' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '。' }], en: 'I am Chinese.' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '是', py: 'shì' }, { t: '法', py: 'fǎ' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '。' }], en: 'I am French.' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '的', py: 'de' }, { t: '中', py: 'zhōng' }, { t: '文', py: 'wén' }, { t: '老', py: 'lǎo' }, { t: '师', py: 'shī' }, { t: '也', py: 'yě' }, { t: '是', py: 'shì' }, { t: '中', py: 'zhōng' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '。' }], en: 'My Chinese teacher is also Chinese.' },
    ],
    exercise2: [
      { segments: [{ t: '人', py: 'rén' }, { t: '们', py: 'men' }, { t: '，' }, { t: '一', py: 'yí' }, { t: '个', py: 'gè' }, { t: '人', py: 'rén' }, { t: '。' }], en: 'People, one person.' },
      { segments: [{ t: '他', py: 'tā' }, { t: '是', py: 'shì' }, { t: '一', py: 'yí' }, { t: '个', py: 'gè' }, { t: '好', py: 'hǎo' }, { t: '人', py: 'rén' }, { t: '。' }], en: 'He is a good person.' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '这', py: 'zhè' }, { t: '个', py: 'gè' }, { t: '人', py: 'rén' }, { t: '吗', py: 'ma' }, { t: '？' }], en: 'Do you know this person?' },
    ],
    exercise3: [
      { segments: [{ t: '我', py: 'wǒ' }, { t: '的', py: 'de' }, { t: '老', py: 'lǎo' }, { t: '师', py: 'shī' }, { t: '，' }, { t: '你', py: 'nǐ' }, { t: '的', py: 'de' }, { t: '名', py: 'míng' }, { t: '字', py: 'zì' }], en: 'My teacher, your name' },
      { segments: [{ t: '王', py: 'wáng' }, { t: '老', py: 'lǎo' }, { t: '师', py: 'shī' }, { t: '是', py: 'shì' }, { t: '他', py: 'tā' }, { t: '的', py: 'de' }, { t: '老', py: 'lǎo' }, { t: '师', py: 'shī' }, { t: '。' }], en: 'Teacher Wang is his teacher.' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '的', py: 'de' }, { t: '名', py: 'míng' }, { t: '字', py: 'zì' }, { t: '很', py: 'hěn' }, { t: '好', py: 'hǎo' }, { t: '。' }], en: 'Your name is very good.' },
    ],
    exercise4: [
      { segments: [{ t: '中', py: 'zhōng' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '，' }, { t: '中', py: 'zhōng' }, { t: '国', py: 'guó' }, { t: '学', py: 'xué' }, { t: '生', py: 'shēng' }], en: 'Chinese person, Chinese student' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '是', py: 'shì' }, { t: '中', py: 'zhōng' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '。' }], en: 'I am Chinese.' },
      { segments: [{ t: '他', py: 'tā' }, { t: '在', py: 'zài' }, { t: '中', py: 'zhōng' }, { t: '国', py: 'guó' }, { t: '学', py: 'xué' }, { t: '习', py: 'xí' }, { t: '。' }], en: 'He studies in China.' },
    ],
    exercise5: [
      { segments: [{ t: '法', py: 'fǎ' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '，' }, { t: '法', py: 'fǎ' }, { t: '国', py: 'guó' }, { t: '学', py: 'xué' }, { t: '生', py: 'shēng' }], en: 'French person, French student' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '一', py: 'yí' }, { t: '个', py: 'gè' }, { t: '法', py: 'fǎ' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }], en: 'I know a French person' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '是', py: 'shì' }, { t: '法', py: 'fǎ' }, { t: '国', py: 'guó' }, { t: '学', py: 'xué' }, { t: '生', py: 'shēng' }, { t: '。' }], en: 'I am a French student.' },
    ],
    exercise6: [
      { segments: [{ t: '中', py: 'zhōng' }, { t: '文', py: 'wén' }, { t: '老', py: 'lǎo' }, { t: '师', py: 'shī' }, { t: '，' }, { t: '学', py: 'xué' }, { t: '中', py: 'zhōng' }, { t: '文', py: 'wén' }, { t: '，' }, { t: '说', py: 'shuō' }, { t: '中', py: 'zhōng' }, { t: '文', py: 'wén' }], en: 'Chinese teacher, study Chinese, speak Chinese' },
      { segments: [{ t: '他', py: 'tā' }, { t: '中', py: 'zhōng' }, { t: '文', py: 'wén' }, { t: '很', py: 'hěn' }, { t: '好', py: 'hǎo' }, { t: '。' }], en: 'His Chinese is very good.' },
      { segments: [{ t: '同', py: 'tóng' }, { t: '学', py: 'xué' }, { t: '们', py: 'men' }, { t: '一', py: 'yì' }, { t: '起', py: 'qǐ' }, { t: '学', py: 'xué' }, { t: '中', py: 'zhōng' }, { t: '文', py: 'wén' }, { t: '。' }], en: 'Classmates study Chinese together.' },
    ],
    exercise7: [
      { segments: [{ t: '我', py: 'wǒ' }, { t: '是', py: 'shì' }, { t: '法', py: 'fǎ' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '。' }], en: 'I am French.' },
      { segments: [{ t: '她', py: 'tā' }, { t: '是', py: 'shì' }, { t: '中', py: 'zhōng' }, { t: '文', py: 'wén' }, { t: '老', py: 'lǎo' }, { t: '师', py: 'shī' }, { t: '。' }], en: 'She is a Chinese teacher.' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '老', py: 'lǎo' }, { t: '师', py: 'shī' }, { t: '不', py: 'bú' }, { t: '是', py: 'shì' }, { t: '法', py: 'fǎ' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '。' }], en: 'My teacher is not French.' },
    ],
    exercise8: [
      { segments: [{ t: '白', py: 'bái' }, { t: '家', py: 'jiā' }, { t: '月', py: 'yuè' }, { t: '的', py: 'de' }, { t: '中', py: 'zhōng' }, { t: '文', py: 'wén' }, { t: '老', py: 'lǎo' }, { t: '师', py: 'shī' }], en: "Bai Jiayue's Chinese teacher" },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '的', py: 'de' }, { t: '名', py: 'míng' }, { t: '字', py: 'zì' }], en: 'Your name' },
    ],
    exercise9: [
      { segments: [{ t: '这', py: 'zhè' }, { t: '是', py: 'shì' }, { t: '谁', py: 'shuí' }, { t: '？' }], en: 'Who is this?' },
      { segments: [{ t: '这', py: 'zhè' }, { t: '是', py: 'shì' }, { t: '我', py: 'wǒ' }, { t: '女', py: 'nǚ' }, { t: '朋', py: 'péng' }, { t: '友', py: 'yǒu' }, { t: '。' }], en: 'This is my girlfriend.' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '女', py: 'nǚ' }, { t: '朋', py: 'péng' }, { t: '友', py: 'yǒu' }, { t: '是', py: 'shì' }, { t: '哪', py: 'nǎ' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '？' }], en: 'What nationality is your girlfriend?' },
      { segments: [{ t: '她', py: 'tā' }, { t: '也', py: 'yě' }, { t: '是', py: 'shì' }, { t: '泰', py: 'tài' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '。' }], en: 'She is also Thai.' },
    ],
    exercise10: [
      { segments: [{ t: '这', py: 'zhè' }, { t: '个', py: 'gè' }, { t: '，' }, { t: '这', py: 'zhè' }, { t: '里', py: 'lǐ' }], en: 'this, here' },
      { segments: [{ t: '这', py: 'zhè' }, { t: '是', py: 'shì' }, { t: '谁', py: 'shuí' }, { t: '？' }], en: 'Who is this?' },
      { segments: [{ t: '这', py: 'zhè' }, { t: '个', py: 'gè' }, { t: '人', py: 'rén' }, { t: '是', py: 'shì' }, { t: '我', py: 'wǒ' }, { t: '的', py: 'de' }, { t: '同', py: 'tóng' }, { t: '学', py: 'xué' }, { t: '。' }], en: 'This person is my classmate.' },
    ],
    exercise11: [
      { segments: [{ t: '谁', py: 'shuí' }, { t: '的', py: 'de' }, { t: '，' }, { t: '是', py: 'shì' }, { t: '谁', py: 'shuí' }], en: 'whose, who is it' },
      { segments: [{ t: '这', py: 'zhè' }, { t: '是', py: 'shì' }, { t: '谁', py: 'shuí' }, { t: '？' }], en: 'Who is this?' },
      { segments: [{ t: '谁', py: 'shuí' }, { t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '法', py: 'fǎ' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '？' }], en: 'Who knows French people?' },
    ],
    exercise12: [
      { segments: [{ t: '她', py: 'tā' }, { t: '是', py: 'shì' }, { t: '谁', py: 'shuí' }, { t: '的', py: 'de' }, { t: '女', py: 'nǚ' }, { t: '朋', py: 'péng' }, { t: '友', py: 'yǒu' }, { t: '？' }], en: 'Whose girlfriend is she?' },
      { segments: [{ t: '他', py: 'tā' }, { t: '的', py: 'de' }, { t: '女', py: 'nǚ' }, { t: '朋', py: 'péng' }, { t: '友', py: 'yǒu' }, { t: '很', py: 'hěn' }, { t: '漂', py: 'piào' }, { t: '亮', py: 'liang' }, { t: '。' }], en: 'His girlfriend is very pretty.' },
    ],
    exercise13: [
      { segments: [{ t: '哪', py: 'nǎ' }, { t: '国', py: 'guó' }, { t: '，' }, { t: '哪', py: 'nǎ' }, { t: '个', py: 'gè' }], en: 'which country, which' },
      { segments: [{ t: '他', py: 'tā' }, { t: '是', py: 'shì' }, { t: '哪', py: 'nǎ' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '？' }], en: 'What nationality is he?' },
      { segments: [{ t: '哪', py: 'nǎ' }, { t: '个', py: 'gè' }, { t: '人', py: 'rén' }, { t: '是', py: 'shì' }, { t: '你', py: 'nǐ' }, { t: '女', py: 'nǚ' }, { t: '朋', py: 'péng' }, { t: '友', py: 'yǒu' }, { t: '？' }], en: 'Which person is your girlfriend?' },
    ],
    exercise14: [
      { segments: [{ t: '哪', py: 'nǎ' }, { t: '国', py: 'guó' }, { t: '，' }, { t: '我', py: 'wǒ' }, { t: '国', py: 'guó' }, { t: '，' }, { t: '两', py: 'liǎng' }, { t: '国', py: 'guó' }], en: 'which country, our country, two countries' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '是', py: 'shì' }, { t: '哪', py: 'nǎ' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '？' }], en: 'What nationality are you?' },
      { segments: [{ t: '两', py: 'liǎng' }, { t: '国', py: 'guó' }, { t: '学', py: 'xué' }, { t: '生', py: 'shēng' }, { t: '是', py: 'shì' }, { t: '朋', py: 'péng' }, { t: '友', py: 'yǒu' }, { t: '。' }], en: 'Students from the two countries are friends.' },
    ],
    exercise15: [
      { segments: [{ t: '她', py: 'tā' }, { t: '们', py: 'men' }, { t: '，' }, { t: '她', py: 'tā' }, { t: '的', py: 'de' }], en: 'they (female), her' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '她', py: 'tā' }, { t: '吗', py: 'ma' }, { t: '？' }], en: 'Do you know her?' },
      { segments: [{ t: '她', py: 'tā' }, { t: '是', py: 'shì' }, { t: '英', py: 'yīng' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '。' }], en: 'She is British.' },
    ],
    exercise16: [
      { segments: [{ t: '泰', py: 'tài' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '，' }, { t: '泰', py: 'tài' }, { t: '国', py: 'guó' }, { t: '学', py: 'xué' }, { t: '生', py: 'shēng' }], en: 'Thai person, Thai student' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '想', py: 'xiǎng' }, { t: '去', py: 'qù' }, { t: '泰', py: 'tài' }, { t: '国', py: 'guó' }, { t: '。' }], en: 'I want to go to Thailand.' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '的', py: 'de' }, { t: '女', py: 'nǚ' }, { t: '朋', py: 'péng' }, { t: '友', py: 'yǒu' }, { t: '是', py: 'shì' }, { t: '泰', py: 'tài' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '。' }], en: 'My girlfriend is Thai.' },
    ],
    exercise17: [
      { segments: [{ t: '喂', py: 'wèi' }, { t: '，' }, { t: '一', py: 'yī' }, { t: '飞', py: 'fēi' }, { t: '！' }], en: 'Hello, Yifei!' },
      { segments: [{ t: '姐', py: 'jiě' }, { t: '姐', py: 'jie' }, { t: '！' }], en: 'Older sister!' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '工', py: 'gōng' }, { t: '作', py: 'zuò' }, { t: '还', py: 'hái' }, { t: '忙', py: 'máng' }, { t: '吗', py: 'ma' }, { t: '？' }], en: 'Are you still busy with work?' },
      { segments: [{ t: '对', py: 'duì' }, { t: '，' }, { t: '还', py: 'hái' }, { t: '很', py: 'hěn' }, { t: '忙', py: 'máng' }, { t: '。' }], en: 'Yes, still very busy.' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '也', py: 'yě' }, { t: '很', py: 'hěn' }, { t: '忙', py: 'máng' }, { t: '吗', py: 'ma' }, { t: '？' }], en: 'Are you also very busy?' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '不', py: 'bú' }, { t: '太', py: 'tài' }, { t: '忙', py: 'máng' }, { t: '。' }], en: "I'm not too busy." },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '们', py: 'men' }, { t: '很', py: 'hěn' }, { t: '想', py: 'xiǎng' }, { t: '你', py: 'nǐ' }, { t: '。' }], en: 'We miss you very much.' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '也', py: 'yě' }, { t: '想', py: 'xiǎng' }, { t: '你', py: 'nǐ' }, { t: '们', py: 'men' }, { t: '。' }], en: 'I miss you all too.' },
    ],
    exercise18: [
      { segments: [{ t: '喂', py: 'wèi' }, { t: '，' }, { t: '请', py: 'qǐng' }, { t: '问', py: 'wèn' }, { t: '是', py: 'shì' }, { t: '王', py: 'wáng' }, { t: '老', py: 'lǎo' }, { t: '师', py: 'shī' }, { t: '吗', py: 'ma' }, { t: '？' }], en: 'Hello, may I ask if this is Teacher Wang?' },
      { segments: [{ t: '喂', py: 'wèi' }, { t: '！' }, { t: '你', py: 'nǐ' }, { t: '叫', py: 'jiào' }, { t: '什', py: 'shén' }, { t: '么', py: 'me' }, { t: '名', py: 'míng' }, { t: '字', py: 'zì' }, { t: '？' }], en: 'Hey! What is your name?' },
    ],
    exercise19: [
      { segments: [{ t: '我', py: 'wǒ' }, { t: '姐', py: 'jiě' }, { t: '姐', py: 'jie' }, { t: '，' }, { t: '我', py: 'wǒ' }, { t: '的', py: 'de' }, { t: '姐', py: 'jiě' }, { t: '姐', py: 'jie' }, { t: '，' }, { t: '一', py: 'yí' }, { t: '个', py: 'gè' }, { t: '姐', py: 'jiě' }, { t: '姐', py: 'jie' }], en: 'my older sister, my older sister, an older sister' },
      { segments: [{ t: '她', py: 'tā' }, { t: '姐', py: 'jiě' }, { t: '姐', py: 'jie' }, { t: '是', py: 'shì' }, { t: '我', py: 'wǒ' }, { t: '同', py: 'tóng' }, { t: '学', py: 'xué' }, { t: '。' }], en: 'Her older sister is my classmate.' },
      { segments: [{ t: '他', py: 'tā' }, { t: '们', py: 'men' }, { t: '没', py: 'méi' }, { t: '有', py: 'yǒu' }, { t: '姐', py: 'jiě' }, { t: '姐', py: 'jie' }, { t: '。' }], en: "They don't have an older sister." },
    ],
    exercise20: [
      { segments: [{ t: '我', py: 'wǒ' }, { t: '的', py: 'de' }, { t: '工', py: 'gōng' }, { t: '作', py: 'zuò' }, { t: '，' }, { t: '有', py: 'yǒu' }, { t: '工', py: 'gōng' }, { t: '作', py: 'zuò' }, { t: '，' }, { t: '没', py: 'méi' }, { t: '有', py: 'yǒu' }, { t: '工', py: 'gōng' }, { t: '作', py: 'zuò' }], en: "my job, have a job, don't have a job" },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '喜', py: 'xǐ' }, { t: '欢', py: 'huan' }, { t: '什', py: 'shén' }, { t: '么', py: 'me' }, { t: '工', py: 'gōng' }, { t: '作', py: 'zuò' }, { t: '？' }], en: 'What kind of job do you like?' },
      { segments: [{ t: '她', py: 'tā' }, { t: '的', py: 'de' }, { t: '工', py: 'gōng' }, { t: '作', py: 'zuò' }, { t: '很', py: 'hěn' }, { t: '好', py: 'hǎo' }, { t: '。' }], en: 'Her job is very good.' },
    ],
    exercise21: [
      { segments: [{ t: '你', py: 'nǐ' }, { t: '还', py: 'hái' }, { t: '忙', py: 'máng' }, { t: '吗', py: 'ma' }, { t: '？' }], en: 'Are you still busy?' },
      { segments: [{ t: '她', py: 'tā' }, { t: '还', py: 'hái' }, { t: '在', py: 'zài' }, { t: '泰', py: 'tài' }, { t: '国', py: 'guó' }, { t: '吗', py: 'ma' }, { t: '？' }], en: 'Is she still in Thailand?' },
    ],
    exercise22: [
      { segments: [{ t: '很', py: 'hěn' }, { t: '忙', py: 'máng' }, { t: '，' }, { t: '不', py: 'bù' }, { t: '忙', py: 'máng' }, { t: '，' }, { t: '忙', py: 'máng' }, { t: '不', py: 'bu' }, { t: '忙', py: 'máng' }], en: 'very busy, not busy, busy or not' },
      { segments: [{ t: '他', py: 'tā' }, { t: '的', py: 'de' }, { t: '工', py: 'gōng' }, { t: '作', py: 'zuò' }, { t: '很', py: 'hěn' }, { t: '忙', py: 'máng' }, { t: '。' }], en: 'His job is very busy.' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '今', py: 'jīn' }, { t: '天', py: 'tiān' }, { t: '不', py: 'bù' }, { t: '忙', py: 'máng' }, { t: '。' }], en: 'I am not busy today.' },
    ],
    exercise23: [
      { segments: [{ t: '你', py: 'nǐ' }, { t: '有', py: 'yǒu' }, { t: '工', py: 'gōng' }, { t: '作', py: 'zuò' }, { t: '吗', py: 'ma' }, { t: '？' }], en: 'Do you have a job?' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '中', py: 'zhōng' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '吗', py: 'ma' }, { t: '？' }], en: 'Do you know any Chinese people?' },
    ],
    exercise24: [
      { segments: [{ t: '很', py: 'hěn' }, { t: '对', py: 'duì' }, { t: '，' }, { t: '不', py: 'bú' }, { t: '对', py: 'duì' }, { t: '，' }, { t: '对', py: 'duì' }, { t: '不', py: 'bu' }, { t: '对', py: 'duì' }], en: 'very right, incorrect, right or not' },
      { segments: [{ t: 'A：' }, { t: '他', py: 'tā' }, { t: '是', py: 'shì' }, { t: '中', py: 'zhōng' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '吗', py: 'ma' }, { t: '？' }], en: 'A: Is he Chinese?' },
      { segments: [{ t: 'B：' }, { t: '对', py: 'duì' }, { t: '，' }, { t: '他', py: 'tā' }, { t: '是', py: 'shì' }, { t: '中', py: 'zhōng' }, { t: '国', py: 'guó' }, { t: '人', py: 'rén' }, { t: '。' }], en: 'B: Yes, he is Chinese.' },
    ],
    exercise25: [
      { segments: [{ t: '他', py: 'tā' }, { t: '太', py: 'tài' }, { t: '忙', py: 'máng' }, { t: '了', py: 'le' }, { t: '。' }], en: 'He is too busy.' },
      { segments: [{ t: '太', py: 'tài' }, { t: '好', py: 'hǎo' }, { t: '了', py: 'le' }, { t: '！' }], en: 'Great!' },
    ],
    exercise26: [
      { segments: [{ t: '我', py: 'wǒ' }, { t: '们', py: 'men' }, { t: '是', py: 'shì' }, { t: '同', py: 'tóng' }, { t: '学', py: 'xué' }, { t: '。' }], en: 'We are classmates.' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '们', py: 'men' }, { t: '一', py: 'yì' }, { t: '起', py: 'qǐ' }, { t: '去', py: 'qù' }, { t: '上', py: 'shàng' }, { t: '学', py: 'xué' }, { t: '。' }], en: 'We go to school together.' },
    ],
    exercise27: [
      { segments: [{ t: '我', py: 'wǒ' }, { t: '想', py: 'xiǎng' }, { t: '你', py: 'nǐ' }, { t: '了', py: 'le' }, { t: '。' }], en: 'I miss you.' },
      { segments: [{ t: '他', py: 'tā' }, { t: '很', py: 'hěn' }, { t: '想', py: 'xiǎng' }, { t: '她', py: 'tā' }, { t: '。' }], en: 'He misses her very much.' },
    ],
  },
  words: [
    { zh: '中国', py: 'Zhōngguó', en: 'China' },
    { zh: '国', py: 'guó', en: 'Country' },
    { zh: '法国', py: 'Fǎguó', en: 'France' },
    { zh: '泰国', py: 'Tàiguó', en: 'Thailand' },
    { zh: '英国', py: 'Yīngguó', en: 'United Kingdom' },
    { zh: '一', py: 'yī', en: 'One' },
    { zh: '个', py: 'gè', en: 'General measure word' },
    { zh: '说', py: 'shuō', en: 'To speak / Say' },
    { zh: '女朋友', py: 'nǚpéngyou', en: 'Girlfriend' },
    { zh: '朋友', py: 'péngyou', en: 'Friend' },
    { zh: '哪', py: 'nǎ', en: 'Which' },
    { zh: '哪个', py: 'nǎge', en: 'Which one' },
    { zh: '这里', py: 'zhèlǐ', en: 'Here' },
    { zh: '漂亮', py: 'piàoliang', en: 'Beautiful / Pretty' },
    { zh: '两', py: 'liǎng', en: 'Two (of something)' },
    { zh: '她们', py: 'tāmen', en: 'They (female)' },
    { zh: '想', py: 'xiǎng', en: 'To want / Miss / Think' },
    { zh: '喂', py: 'wèi', en: 'Hello (on the phone)' },
    { zh: '姐姐', py: 'jiějie', en: 'Elder sister' },
    { zh: '工作', py: 'gōngzuò', en: 'To work / Job' },
    { zh: '还', py: 'hái', en: 'Still / Also' },
    { zh: '忙', py: 'máng', en: 'Busy' },
    { zh: '太', py: 'tài', en: 'Too / Very' },
    { zh: '没有', py: 'méiyǒu', en: "Not have / There isn't" },
    { zh: '喜欢', py: 'xǐhuan', en: 'To like' },
    { zh: '今天', py: 'jīntiān', en: 'Today' },
    { zh: '上学', py: 'shàngxué', en: 'To go to school' },
  ],
};
