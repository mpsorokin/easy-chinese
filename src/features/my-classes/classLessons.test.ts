import { describe, expect, it } from 'vitest';
import {
  classLessons,
  parseClassContent,
  parseClassLesson,
  type ClassBlock,
} from '@/features/my-classes/classLessons.ts';

const NOTES = `# 第一课 · Dì yī kè · Урок 1

## 你好！ Приветствие

Вступление с **你好**.

## 1. Основная лексика

| 汉字 | Pinyin | Перевод | Пример |
| --- | --- | --- | --- |
| **你** | nǐ | ты | **你呢？** · Nǐ ne? · А ты? |

## 2. Грамматика

**Кто + 很 + прилагательное.** Объяснение.

## 3. Упражнения

### Переведи на китайский

1. Привет!
2. Как дела?

### Ответы

| Задание | № | 汉字 | Pinyin |
| --- | --- | --- | --- |
| С русского | 1 | 你好！ | Nǐ hǎo! |
| С русского | 2 | 你好吗？ | Nǐ hǎo ma? |
`;

describe('parseClassLesson', () => {
  const lesson = parseClassLesson(1, NOTES)!;

  it('reads the heading and the topic', () => {
    expect(lesson).toMatchObject({
      id: 1,
      hanzi: '第一课',
      pinyin: 'Dì yī kè',
      label: 'Урок 1',
      chineseTitle: '你好！',
      title: 'Приветствие',
    });
    expect(lesson.intro).toEqual([
      { type: 'paragraph', text: 'Вступление с **你好**.' },
    ]);
  });

  it('numbers the sections and knows their kind', () => {
    expect(
      lesson.sections.map(({ kind, title, anchor }) => [kind, title, anchor]),
    ).toEqual([
      ['vocabulary', 'Основная лексика', 'class-section-1'],
      ['grammar', 'Грамматика', 'class-section-2'],
      ['other', 'Упражнения', 'class-section-3'],
    ]);
  });

  it('marks the columns of a table', () => {
    const [table] = lesson.sections[0]!.blocks;
    expect(table).toMatchObject({
      type: 'table',
      table: {
        label: 'Основная лексика',
        columns: ['hanzi', 'pinyin', 'text', 'example'],
        phrases: true,
        rows: [['**你**', 'nǐ', 'ты', '**你呢？** · Nǐ ne? · А ты?']],
      },
    });
  });

  it('finds grammar rules only in the grammar section', () => {
    expect(lesson.sections[1]!.blocks).toEqual([
      { type: 'rule', rule: 'Кто + 很 + прилагательное.', text: 'Объяснение.' },
    ]);
    expect(
      parseClassContent('**Кто + 很 + прилагательное.** Объяснение.')[0],
    ).toMatchObject({ type: 'paragraph' });
  });

  it('puts each answer after its exercise list', () => {
    const blocks = lesson.sections[2]!.blocks;
    expect(blocks.map(({ type }) => type)).toEqual(['heading', 'numbered']);
    expect(blocks[1]).toMatchObject({
      items: ['Привет!', 'Как дела?'],
      answers: {
        headers: ['№', '汉字', 'Pinyin'],
        rows: [
          ['1', '你好！', 'Nǐ hǎo!'],
          ['2', '你好吗？', 'Nǐ hǎo ma?'],
        ],
      },
    });
  });

  it('keeps the whole key when the answers do not fit the lists', () => {
    const blocks = parseClassContent(
      NOTES.slice(NOTES.indexOf('### Переведи')).replace('2. Как дела?\n', ''),
    );
    expect(blocks.at(-1)).toMatchObject({ type: 'answers' });
    expect(
      blocks.some(
        (block: ClassBlock) => block.type === 'numbered' && block.answers,
      ),
    ).toBe(false);
  });

  it('skips files without a heading', () => {
    expect(parseClassLesson(1, 'no heading')).toBeUndefined();
  });
});

describe('classLessons', () => {
  it('are sorted by number with unique ids', () => {
    const ids = classLessons.map(({ id }) => id);
    expect(ids).toEqual([...new Set(ids)].sort((a, b) => a - b));
  });
});
