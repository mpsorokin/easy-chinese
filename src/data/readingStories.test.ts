import { expect, it } from 'vitest';
import { COURSE_LESSONS } from '@/data/courseLessons.ts';
import { readingStories } from '@/data/readingStories.ts';

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
