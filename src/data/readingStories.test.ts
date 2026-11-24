import { expect, it } from 'vitest';
import { COURSE_LESSONS } from '@/data/courseLessons.ts';
import { readingStories } from '@/data/readingStories.ts';
import { vocabularyEntry } from '@/data/vocabulary.ts';

const HAN = /\p{Script=Han}/u;

it('stories have unique URL-safe ids', () => {
  const ids = readingStories.map(({ id }) => id);
  expect(new Set(ids).size).toBe(ids.length);
  for (const id of ids) expect(id).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
});

it.each(readingStories)('$id has titles and complete lines', (story) => {
  expect(story.titleZh).toMatch(HAN);
  expect(story.titlePinyin).not.toMatch(HAN);
  expect(story.titleEn.trim()).not.toBe('');
  expect(story.lines.length).toBeGreaterThan(0);
  for (const line of story.lines) {
    expect(line.zh).toMatch(HAN);
    expect(line.pinyin).not.toMatch(HAN);
    expect(line.en).toMatch(/[A-Za-z]/);
  }
});

it.each(readingStories.filter((story) => story.lessons))(
  '$id points at existing course lessons',
  ({ lessons }) => {
    const [first, last] = lessons!;
    const ids = COURSE_LESSONS.map(({ id }) => id);
    expect(first).toBeLessThanOrEqual(last);
    expect(ids).toContain(first);
    expect(ids).toContain(last);
  },
);

it.each(readingStories)('$id splits every line into its words', ({ lines }) => {
  for (const line of lines) {
    expect(line.tokens.join('')).toBe(line.zh);
    expect(line.tokens).not.toContain('');
  }
});

it.each(readingStories)(
  '$id has a gloss for every Chinese word',
  ({ lines }) => {
    const missing = lines
      .flatMap((line) => line.tokens)
      .filter((token) => HAN.test(token) && !vocabularyEntry(token));
    expect(missing).toEqual([]);
  },
);

it.each(readingStories)(
  '$id reads Latin text aloud only via `spoken`',
  ({ lines }) => {
    for (const line of lines) {
      if (/[A-Za-z]/.test(line.zh)) expect(line.spoken).toMatch(HAN);
      else expect(line.spoken).toBeUndefined();
    }
  },
);
