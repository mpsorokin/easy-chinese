import { describe, expect, it } from 'vitest';
import {
  addXp,
  currentStreak,
  dayKey,
  isDaily,
  todayXp,
} from '@/domain/daily.ts';

const at = (y: number, m: number, d: number, h = 12) =>
  new Date(y, m - 1, d, h).getTime();

describe('daily XP and streak', () => {
  it('starts a streak of 1 on the first XP', () => {
    expect(addXp(undefined, 5, at(2026, 3, 10))).toEqual({
      day: '2026-03-10',
      xp: 5,
      streak: 1,
    });
  });

  it('adds XP within the same day', () => {
    const d = addXp(undefined, 5, at(2026, 3, 10, 9));
    expect(addXp(d, 3, at(2026, 3, 10, 22))).toEqual({
      day: '2026-03-10',
      xp: 8,
      streak: 1,
    });
  });

  it('grows the streak on the next day, across a month end', () => {
    const d = addXp(undefined, 5, at(2026, 3, 31));
    expect(addXp(d, 2, at(2026, 4, 1))).toEqual({
      day: '2026-04-01',
      xp: 2,
      streak: 2,
    });
  });

  it('restarts the streak after a missed day', () => {
    const d = { day: '2026-03-10', xp: 40, streak: 7 };
    expect(addXp(d, 1, at(2026, 3, 12)).streak).toBe(1);
  });

  it('shows the streak until the end of the next day, today’s XP only today', () => {
    const d = { day: '2026-03-10', xp: 40, streak: 7 };
    expect(currentStreak(d, at(2026, 3, 10))).toBe(7);
    expect(currentStreak(d, at(2026, 3, 11))).toBe(7);
    expect(currentStreak(d, at(2026, 3, 12))).toBe(0);
    expect(todayXp(d, at(2026, 3, 10))).toBe(40);
    expect(todayXp(d, at(2026, 3, 11))).toBe(0);
  });

  it('formats local dates and validates stored data', () => {
    expect(dayKey(at(2026, 1, 5))).toBe('2026-01-05');
    expect(isDaily({ day: '2026-01-05', xp: 0, streak: 1 })).toBe(true);
    expect(isDaily({ day: 'x', xp: 0, streak: 1 })).toBe(false);
    expect(isDaily({ day: '2026-01-05', xp: 0, streak: 0 })).toBe(false);
  });
});
