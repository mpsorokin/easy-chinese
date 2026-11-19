// Lesson 2 of the "Lessons" tab.
import type { CourseLesson } from '../courseLessons.ts';

export const lesson2: CourseLesson = {
  id: 2,
  parts: ['叫什么名字这时', '来个也月对没', '请问超市谁猫候真起', '关系能事高兴认识'],
  exercises: ['exercise1', 'exercise2', 'exercise3', 'exercise4', 'exercise5', 'exercise6', 'exercise7', 'exercise8', 'exercise9', 'exercise10', 'exercise11', 'exercise12', 'exercise13', 'exercise14', 'exercise15', 'exercise16', 'exercise17', 'words'],
  descriptions: { exercise1: "Ask someone's name", exercise2: 'Polite questions with 请问', exercise3: 'Who are you?', exercise4: "Her name, my cat's name", exercise5: 'What and when', exercise6: 'Talk about names', exercise7: 'Me too', exercise8: 'Wrong name, sorry!', exercise9: 'Saying no with 不', exercise10: 'Who is she?', exercise11: 'Apologize and reply', exercise12: 'Introduce yourself', exercise13: 'Nice to meet you', exercise14: 'Very good, very happy', exercise15: 'Happy and not happy', exercise16: 'Do you know him?', exercise17: 'Also with 也', words: 'Names, greetings and apologies' },
  dialogues: {
    exercise1: [
      { segments: [{ t: '请', py: 'qǐng' }, { t: '问', py: 'wèn' }, { t: '你', py: 'nǐ' }, { t: '叫', py: 'jiào' }, { t: '什', py: 'shén' }, { t: '么', py: 'me' }, { t: '名', py: 'míng' }, { t: '字', py: 'zì' }, { t: '？' }], en: 'Excuse me, what is your name?' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '叫', py: 'jiào' }, { t: '陈', py: 'chén' }, { t: '天', py: 'tiān' }, { t: '中', py: 'zhōng' }, { t: '。' }], en: 'My name is Chen Tianzhong.' },
    ],
    exercise2: [
      { segments: [{ t: '请', py: 'qǐng' }, { t: '问', py: 'wèn' }, { t: '超', py: 'chāo' }, { t: '市', py: 'shì' }, { t: '在', py: 'zài' }, { t: '哪', py: 'nǎ' }, { t: '儿', py: 'ér' }, { t: '？' }], en: 'Excuse me, where is the supermarket?' },
      { segments: [{ t: '请', py: 'qǐng' }, { t: '问', py: 'wèn' }, { t: '，' }, { t: '您', py: 'nín' }, { t: '是', py: 'shì' }, { t: '王', py: 'wáng' }, { t: '老', py: 'lǎo' }, { t: '师', py: 'shī' }, { t: '吗', py: 'ma' }, { t: '？' }], en: 'Excuse me, are you Teacher Wang?' },
    ],
    exercise3: [
      { segments: [{ t: '你', py: 'nǐ' }, { t: '好', py: 'hǎo' }, { t: '！' }], en: 'Hello!' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '是', py: 'shì' }, { t: '谁', py: 'shuí' }, { t: '？' }], en: 'Who are you?' },
    ],
    exercise4: [
      { segments: [{ t: '她', py: 'tā' }, { t: '的', py: 'de' }, { t: '名', py: 'míng' }, { t: '字', py: 'zì' }, { t: '叫', py: 'jiào' }, { t: '什', py: 'shén' }, { t: '么', py: 'me' }, { t: '？' }], en: 'What is her name?' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '的', py: 'de' }, { t: '猫', py: 'māo' }, { t: '叫', py: 'jiào' }, { t: 'Coco' }, { t: '。' }], en: "My cat's name is Coco." },
    ],
    exercise5: [
      { segments: [{ t: '这', py: 'zhè' }, { t: '是', py: 'shì' }, { t: '什', py: 'shén' }, { t: '么', py: 'me' }, { t: '？' }], en: 'What is this?' },
      { segments: [{ t: '他', py: 'tā' }, { t: '什', py: 'shén' }, { t: '么', py: 'me' }, { t: '时', py: 'shí' }, { t: '候', py: 'hòu' }, { t: '来', py: 'lái' }, { t: '？' }], en: 'When is he coming?' },
    ],
    exercise6: [
      { segments: [{ t: '这', py: 'zhè' }, { t: '个', py: 'gè' }, { t: '名', py: 'míng' }, { t: '字', py: 'zì' }, { t: '真', py: 'zhēn' }, { t: '好', py: 'hǎo' }, { t: '。' }], en: 'This name is really good.' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '的', py: 'de' }, { t: '猫', py: 'māo' }, { t: '叫', py: 'jiào' }, { t: '什', py: 'shén' }, { t: '么', py: 'me' }, { t: '名', py: 'míng' }, { t: '字', py: 'zì' }, { t: '？' }], en: "What is your cat's name?" },
    ],
    exercise7: [
      { segments: [{ t: '我', py: 'wǒ' }, { t: '是', py: 'shì' }, { t: '学', py: 'xué' }, { t: '生', py: 'shēng' }, { t: '。' }], en: 'I am a student.' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '也', py: 'yě' }, { t: '去', py: 'qù' }, { t: '。' }], en: 'I am going too.' },
    ],
    exercise8: [
      { segments: [{ t: '你', py: 'nǐ' }, { t: '好', py: 'hǎo' }, { t: '，' }, { t: '安', py: 'ān' }, { t: '妮', py: 'nī' }, { t: '！' }], en: 'Hello, Annie!' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '好', py: 'hǎo' }, { t: '，' }, { t: '陈', py: 'chén' }, { t: '天', py: 'tiān' }, { t: '中', py: 'zhōng' }, { t: '！' }, { t: '我', py: 'wǒ' }, { t: '不', py: 'bú' }, { t: '是', py: 'shì' }, { t: '安', py: 'ān' }, { t: '妮', py: 'nī' }, { t: '，' }, { t: '我', py: 'wǒ' }, { t: '是', py: 'shì' }, { t: '白', py: 'bái' }, { t: '家', py: 'jiā' }, { t: '月', py: 'yuè' }, { t: '。' }], en: 'Hello, Chen Tianzhong! I am not Annie, I am Bai Jiayue.' },
      { segments: [{ t: '对', py: 'duì' }, { t: '不', py: 'bu' }, { t: '起', py: 'qǐ' }, { t: '！' }], en: "I'm sorry!" },
      { segments: [{ t: '没', py: 'méi' }, { t: '关', py: 'guān' }, { t: '系', py: 'xi' }, { t: '！' }], en: "It's okay!" },
    ],
    exercise9: [
      { segments: [{ t: '不', py: 'bù' }, { t: '能', py: 'néng' }], en: 'Cannot' },
      { segments: [{ t: '不', py: 'bù' }, { t: '好', py: 'hǎo' }], en: 'Not good' },
      { segments: [{ t: '不', py: 'bú' }, { t: '对', py: 'duì' }], en: 'Incorrect' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '不', py: 'bú' }, { t: '是', py: 'shì' }, { t: '白', py: 'bái' }, { t: '家', py: 'jiā' }, { t: '月', py: 'yuè' }, { t: '。' }], en: 'I am not Bai Jiayue.' },
      { segments: [{ t: '这', py: 'zhè' }, { t: '个', py: 'gè' }, { t: '名', py: 'míng' }, { t: '字', py: 'zì' }, { t: '不', py: 'bù' }, { t: '好', py: 'hǎo' }, { t: '。' }], en: 'This name is not good.' },
    ],
    exercise10: [
      { segments: [{ t: '她', py: 'tā' }, { t: '是', py: 'shì' }, { t: '谁', py: 'shuí' }, { t: '？' }], en: 'Who is she?' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '是', py: 'shì' }, { t: '学', py: 'xué' }, { t: '生', py: 'shēng' }, { t: '。' }], en: 'I am a student.' },
    ],
    exercise11: [
      { segments: [{ t: 'A：' }, { t: '对', py: 'duì' }, { t: '不', py: 'bu' }, { t: '起', py: 'qǐ' }, { t: '！' }], en: "A: I'm sorry!" },
      { segments: [{ t: 'B：' }, { t: '没', py: 'méi' }, { t: '关', py: 'guān' }, { t: '系', py: 'xi' }, { t: '！' }], en: "B: It's okay!" },
      { segments: [{ t: '没', py: 'méi' }, { t: '事', py: 'shì' }, { t: '！' }], en: 'No problem!' },
    ],
    exercise12: [
      { segments: [{ t: '你', py: 'nǐ' }, { t: '叫', py: 'jiào' }, { t: '什', py: 'shén' }, { t: '么', py: 'me' }, { t: '名', py: 'míng' }, { t: '字', py: 'zì' }, { t: '？' }], en: 'What is your name?' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '叫', py: 'jiào' }, { t: '白', py: 'bái' }, { t: '家', py: 'jiā' }, { t: '月', py: 'yuè' }, { t: '。' }], en: 'My name is Bai Jiayue.' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '是', py: 'shì' }, { t: '学', py: 'xué' }, { t: '生', py: 'shēng' }, { t: '。' }], en: 'I am a student.' },
    ],
    exercise13: [
      { segments: [{ t: '你', py: 'nǐ' }, { t: '好', py: 'hǎo' }, { t: '！' }, { t: '我', py: 'wǒ' }, { t: '叫', py: 'jiào' }, { t: '李', py: 'lǐ' }, { t: '文', py: 'wén' }, { t: '。' }], en: 'Hello! My name is Li Wen.' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '好', py: 'hǎo' }, { t: '！' }, { t: '我', py: 'wǒ' }, { t: '叫', py: 'jiào' }, { t: '白', py: 'bái' }, { t: '家', py: 'jiā' }, { t: '月', py: 'yuè' }, { t: '。' }], en: 'Hello! My name is Bai Jiayue.' },
      { segments: [{ t: '很', py: 'hěn' }, { t: '高', py: 'gāo' }, { t: '兴', py: 'xìng' }, { t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '你', py: 'nǐ' }, { t: '。' }], en: 'Nice to meet you.' },
      { segments: [{ t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '你', py: 'nǐ' }, { t: '我', py: 'wǒ' }, { t: '也', py: 'yě' }, { t: '很', py: 'hěn' }, { t: '高', py: 'gāo' }, { t: '兴', py: 'xìng' }, { t: '。' }], en: 'Nice to meet you too.' },
    ],
    exercise14: [
      { segments: [{ t: '很', py: 'hěn' }, { t: '好', py: 'hǎo' }], en: 'Very good' },
      { segments: [{ t: '很', py: 'hěn' }, { t: '高', py: 'gāo' }, { t: '兴', py: 'xìng' }], en: 'Very happy' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '很', py: 'hěn' }, { t: '好', py: 'hǎo' }, { t: '。' }], en: 'I am very good.' },
      { segments: [{ t: '我', py: 'wǒ' }, { t: '们', py: 'men' }, { t: '很', py: 'hěn' }, { t: '高', py: 'gāo' }, { t: '兴', py: 'xìng' }, { t: '。' }], en: 'We are very happy.' },
    ],
    exercise15: [
      { segments: [{ t: '很', py: 'hěn' }, { t: '高', py: 'gāo' }, { t: '兴', py: 'xìng' }], en: 'Very happy' },
      { segments: [{ t: '不', py: 'bù' }, { t: '高', py: 'gāo' }, { t: '兴', py: 'xìng' }], en: 'Not happy' },
      { segments: [{ t: '很', py: 'hěn' }, { t: '高', py: 'gāo' }, { t: '兴', py: 'xìng' }, { t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '你', py: 'nǐ' }, { t: '。' }], en: 'Nice to meet you.' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '为', py: 'wèi' }, { t: '什', py: 'shén' }, { t: '么', py: 'me' }, { t: '不', py: 'bù' }, { t: '高', py: 'gāo' }, { t: '兴', py: 'xìng' }, { t: '？' }], en: 'Why are you not happy?' },
    ],
    exercise16: [
      { segments: [{ t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '他', py: 'tā' }], en: 'Know him' },
      { segments: [{ t: '不', py: 'bú' }, { t: '认', py: 'rèn' }, { t: '识', py: 'shi' }], en: "Don't know" },
      { segments: [{ t: '很', py: 'hěn' }, { t: '高', py: 'gāo' }, { t: '兴', py: 'xìng' }, { t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '你', py: 'nǐ' }, { t: '！' }], en: 'Nice to meet you!' },
      { segments: [{ t: 'A：' }, { t: '你', py: 'nǐ' }, { t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '他', py: 'tā' }, { t: '吗', py: 'ma' }, { t: '？' }], en: 'A: Do you know him?' },
      { segments: [{ t: 'B：' }, { t: '我', py: 'wǒ' }, { t: '不', py: 'bú' }, { t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '他', py: 'tā' }, { t: '。' }], en: "B: I don't know him." },
    ],
    exercise17: [
      { segments: [{ t: '我', py: 'wǒ' }, { t: '也', py: 'yě' }, { t: '很', py: 'hěn' }, { t: '高', py: 'gāo' }, { t: '兴', py: 'xìng' }, { t: '。' }], en: 'I am also very happy.' },
      { segments: [{ t: '你', py: 'nǐ' }, { t: '也', py: 'yě' }, { t: '认', py: 'rèn' }, { t: '识', py: 'shi' }, { t: '她', py: 'tā' }, { t: '？' }], en: 'You know her too?' },
    ],
  },
  words: [
    { zh: '请问', py: 'qǐngwèn', en: 'Excuse me, may I ask' },
    { zh: '叫', py: 'jiào', en: 'To be called' },
    { zh: '什么', py: 'shénme', en: 'What' },
    { zh: '名字', py: 'míngzi', en: 'Name' },
    { zh: '在', py: 'zài', en: 'At / In' },
    { zh: '超市', py: 'chāoshì', en: 'Supermarket' },
    { zh: '谁', py: 'shéi', en: 'Who' },
    { zh: '猫', py: 'māo', en: 'Cat' },
    { zh: '这', py: 'zhè', en: 'This' },
    { zh: '这个', py: 'zhège', en: 'This one' },
    { zh: '时候', py: 'shíhou', en: 'Time / Moment' },
    { zh: '来', py: 'lái', en: 'To come' },
    { zh: '真', py: 'zhēn', en: 'Really' },
    { zh: '也', py: 'yě', en: 'Also / Too' },
    { zh: '家', py: 'jiā', en: 'Home / Family' },
    { zh: '月', py: 'yuè', en: 'Month / Moon' },
    { zh: '对不起', py: 'duìbuqǐ', en: 'Sorry' },
    { zh: '没关系', py: 'méi guānxi', en: "It doesn't matter" },
    { zh: '能', py: 'néng', en: 'Can / To be able to' },
    { zh: '对', py: 'duì', en: 'Correct / Right' },
    { zh: '没事', py: 'méishì', en: "It's nothing / Never mind" },
    { zh: '高兴', py: 'gāoxìng', en: 'Happy / Glad' },
    { zh: '认识', py: 'rènshi', en: 'To know (someone)' },
  ],
};
