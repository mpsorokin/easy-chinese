import { COURSE_LESSONS } from '@/data/courseLessons.ts';
import { HSK1_LEVEL, toneless } from '@/data/hsk.ts';
import type { HskWord } from '@/domain/types.ts';

const isChineseWord = (text: string) => /^\p{Script=Han}+$/u.test(text);

// Story vocabulary beyond the syllabus and the course's word lists.
const storyGlosses: readonly HskWord[] = [
  { w: '星期一', py: 'xīngqīyī', en: 'Monday' },
  { w: '星期六', py: 'xīngqīliù', en: 'Saturday' },
  { w: '安娜', py: 'Ānnà', en: 'Anna (name)' },
  { w: '王明', py: 'Wáng Míng', en: 'Wang Ming (name)' },
  { w: '王', py: 'Wáng', en: 'Wang (surname)' },
  { w: '李月', py: 'Lǐ Yuè', en: 'Li Yue (name)' },
  { w: '二十', py: 'èrshí', en: 'twenty' },
  { w: '二十五', py: 'èrshíwǔ', en: 'twenty-five' },
  { w: '以后', py: 'yǐhòu', en: 'after; later' },
  { w: '一起', py: 'yìqǐ', en: 'together' },
  { w: '饭馆', py: 'fànguǎn', en: 'restaurant' },
  { w: '吃饭', py: 'chīfàn', en: 'eat a meal' },
  { w: '所以', py: 'suǒyǐ', en: 'so; therefore' },
  { w: '旁边', py: 'pángbiān', en: 'beside; next to' },
  { w: '黑色', py: 'hēisè', en: 'black (color)' },
  { w: '但是', py: 'dànshì', en: 'but; however' },
  { w: '那么', py: 'nàme', en: 'that much; so' },
  { w: '一点', py: 'yìdiǎn', en: 'a little; a bit' },
  { w: '等', py: 'děng', en: 'wait for' },
  { w: '为什么', py: 'wèishénme', en: 'why' },
  { w: '因为', py: 'yīnwèi', en: 'because' },
  { w: '重', py: 'zhòng', en: 'heavy' },
  { w: '帮', py: 'bāng', en: 'help' },
  { w: '拿', py: 'ná', en: 'take; carry' },
  { w: '香蕉', py: 'xiāngjiāo', en: 'banana' },
  { w: '回家', py: 'huí jiā', en: 'go home' },
  { w: '带', py: 'dài', en: 'bring; carry' },
  { w: '钱包', py: 'qiánbāo', en: 'wallet' },
  { w: '果', py: 'guǒ', en: 'fruit; result' },
  { w: '香', py: 'xiāng', en: 'fragrant' },
  { w: '笑', py: 'xiào', en: 'smile; laugh' },
  { w: '还是', py: 'háishi', en: 'or (in a question)' },
];

const byWord = new Map<string, HskWord>();
for (const { words } of COURSE_LESSONS) {
  for (const { zh, py, en } of words ?? []) {
    if (isChineseWord(zh)) byWord.set(zh, { w: zh, py, en });
  }
}
for (const entry of [...HSK1_LEVEL.words, ...storyGlosses]) {
  byWord.set(entry.w, entry);
}

export const vocabularyEntry = (word: string) => byWord.get(word);
export const vocabulary = [...byWord.values()].sort((a, b) =>
  toneless(a.py).localeCompare(toneless(b.py)),
);
