import { describe, expect, it } from 'vitest';
import { DAY_MS } from '@/domain/srs.ts';
import {
  emptyProgress,
  gainXp,
  logActivity,
  normalizeProgress,
  recordAttempt,
  type Progress,
} from '@/features/progress/progress.ts';
import {
  activityCalendar,
  activityLevel,
  activityTotals,
  charStats,
  recentChars,
  weakChars,
  wordPractice,
  wordStats,
} from '@/features/stats/stats.ts';

const at = (y: number, m: number, d: number) =>
  new Date(y, m - 1, d, 12).getTime();
const NOW = at(2026, 11, 25); // a Wednesday

function written(
  p: Progress,
  char: string,
  grade: 1 | 2 | 3,
  mistakes = 0,
  when = NOW,
) {
  return recordAttempt(p, {
    char,
    mode: 'copybook',
    grade,
    mistakes,
    at: when,
  });
}

describe('day history', () => {
  it('adds XP, characters and answers to the day', () => {
    let p = gainXp(emptyProgress(), 3, NOW);
    p = logActivity(p, NOW, { chars: 1 });
    p = logActivity(p, NOW + 1000, { answers: 2 });
    expect(p.history).toEqual({
      '2026-11-25': { xp: 3, chars: 1, answers: 2 },
    });
  });

  it('drops days older than a year', () => {
    let p = logActivity(emptyProgress(), NOW - 400 * DAY_MS, { xp: 5 });
    p = logActivity(p, NOW, { xp: 1 });
    expect(Object.keys(p.history!)).toEqual(['2026-11-25']);
  });

  it('survives storage and drops invalid entries', () => {
    const p = normalizeProgress({
      version: 2,
      chars: {},
      lessons: {},
      history: {
        '2026-11-25': { xp: 4, chars: -1, answers: 'x' },
        yesterday: { xp: 1 },
      },
    });
    expect(p?.history).toEqual({
      '2026-11-25': { xp: 4, chars: 0, answers: 0 },
    });
  });
});

describe('word practice', () => {
  it('counts a word as written once every character is, with the lowest grade', () => {
    let p = written(emptyProgress(), '朋', 3);
    expect(wordPractice(p, '朋友').written).toBeUndefined();
    p = written(p, '友', 2);
    expect(wordPractice(p, '朋友').written).toBe(2);
  });

  it('reads the quiz box of the word itself', () => {
    const p = { ...emptyProgress(), srs: { 朋友: { box: 4, due: 0 } } };
    expect(wordPractice(p, '朋友').box).toBe(4);
    expect(wordPractice(p, '朋').box).toBeUndefined();
  });

  it('sums statuses, written and remembered words', () => {
    let p = written(emptyProgress(), '人', 3);
    p = { ...p, srs: { 人: { box: 3, due: 0 }, 大: { box: 2, due: 0 } } };
    const words = [
      { w: '人', py: 'rén', en: 'person' },
      { w: '大', py: 'dà', en: 'big' },
      { w: '小', py: 'xiǎo', en: 'small' },
    ];
    expect(wordStats(p, { 人: 'known', 大: 'learning' }, words)).toEqual({
      total: 3,
      known: 1,
      learning: 1,
      fresh: 1,
      written: 1,
      remembered: 1,
    });
  });
});

describe('characters', () => {
  const p = [
    ['人', 3, 0, NOW - 3000],
    ['大', 1, 4, NOW - 2000],
    ['小', 2, 1, NOW - 1000],
    ['中', 1, 9, NOW - 4000],
  ].reduce(
    (acc, [c, g, m, w]) =>
      written(acc, c as string, g as 1 | 2 | 3, m as number, w as number),
    emptyProgress(),
  );

  it('counts written and three-star characters and level coverage', () => {
    expect(charStats(p, ['人', '大', '口'])).toEqual({
      written: 4,
      mastered: 1,
      levelWritten: 2,
      levelTotal: 3,
    });
  });

  it('lists the newest first and the weakest first', () => {
    expect(recentChars(p, 2).map((c) => c.char)).toEqual(['小', '大']);
    expect(weakChars(p, 5).map((c) => c.char)).toEqual(['中', '大', '小']);
  });
});

describe('activity', () => {
  const p = logActivity(
    logActivity(emptyProgress(), NOW, { xp: 40 }),
    NOW - 2 * DAY_MS,
    { xp: 5, chars: 1 },
  );

  it('lays out whole weeks from Monday up to today', () => {
    const weeks = activityCalendar(p, NOW, 2);
    expect(weeks).toHaveLength(2);
    expect(weeks[0]![0]!.day).toBe('2026-11-16');
    expect(weeks[0]).toHaveLength(7);
    expect(weeks[1]!.map((d) => d.day)).toEqual([
      '2026-11-23',
      '2026-11-24',
      '2026-11-25',
    ]);
    expect(weeks[1]![2]!.activity?.xp).toBe(40);
  });

  it('sums the last days', () => {
    expect(activityTotals(p, NOW, 7)).toEqual({
      activeDays: 2,
      xp: 45,
      chars: 1,
      answers: 0,
    });
    expect(activityTotals(p, NOW, 1).activeDays).toBe(1);
  });

  it('shades days against the goal', () => {
    const level = (xp: number) =>
      activityLevel({ xp, chars: 0, answers: 0 }, 30);
    expect(
      [undefined, 0, 5, 20, 30, 60].map((xp) =>
        xp === undefined ? activityLevel(undefined, 30) : level(xp),
      ),
    ).toEqual([0, 0, 1, 2, 3, 4]);
  });
});
