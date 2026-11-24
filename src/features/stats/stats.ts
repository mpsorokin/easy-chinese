// Cross-app statistics, derived from stored progress and word statuses. Pure TypeScript:
// nothing here is stored, so it never gets out of step with the data it reads.
import { dayKey } from '@/domain/daily.ts';
import type { Grade } from '@/domain/grading.ts';
import { DAY_MS } from '@/domain/srs.ts';
import type { HskWord } from '@/domain/types.ts';
import type { DayActivity, Progress } from '@/features/progress/progress.ts';
import type { WordStatuses } from '@/features/vocabulary/vocabularyStore.ts';

const HAN = /\p{Script=Han}/u;

// Quiz box from which an item counts as remembered: its next review is a week or more away.
export const REMEMBERED_BOX = 3;

export type WordPractice = {
  written?: Grade; // lowest best grade over the word's characters, once all are written
  box?: number; // quiz box of the word itself, 0..TOP_BOX
};

export function wordPractice(p: Progress, word: string): WordPractice {
  const grades = [...word]
    .filter((c) => HAN.test(c))
    .map((c) => p.chars[c]?.best);
  const written =
    grades.length > 0 && grades.every((g) => g !== undefined)
      ? (Math.min(...grades) as Grade)
      : undefined;
  return { written, box: p.srs?.[word]?.box };
}

export type WordStats = {
  total: number;
  known: number;
  learning: number;
  fresh: number; // status New
  written: number; // every character written
  remembered: number; // quiz box >= REMEMBERED_BOX
};

export function wordStats(
  p: Progress,
  statuses: WordStatuses,
  words: readonly HskWord[],
): WordStats {
  const s: WordStats = {
    total: words.length,
    known: 0,
    learning: 0,
    fresh: 0,
    written: 0,
    remembered: 0,
  };
  for (const { w } of words) {
    const status = statuses[w];
    if (status === 'known') s.known++;
    else if (status === 'learning') s.learning++;
    else s.fresh++;
    const { written, box } = wordPractice(p, w);
    if (written) s.written++;
    if (box !== undefined && box >= REMEMBERED_BOX) s.remembered++;
  }
  return s;
}

export type CharSummary = {
  char: string;
  best: Grade;
  attempts: number;
  mistakes: number;
  lastAt: number;
};

const charList = (p: Progress): CharSummary[] =>
  Object.entries(p.chars).map(([char, c]) => ({ char, ...c }));

export function charStats(p: Progress, levelChars: readonly string[]) {
  const all = charList(p);
  return {
    written: all.length,
    mastered: all.filter((c) => c.best === 3).length,
    levelWritten: levelChars.filter((c) => p.chars[c]).length,
    levelTotal: levelChars.length,
  };
}

// The characters written last, newest first.
export const recentChars = (p: Progress, n: number) =>
  charList(p)
    .filter((c) => c.lastAt > 0)
    .sort((a, b) => b.lastAt - a.lastAt)
    .slice(0, n);

// Characters worth writing again: best grade below three stars, the weakest first, then
// those with the most mistakes per attempt.
export const weakChars = (p: Progress, n: number) =>
  charList(p)
    .filter((c) => c.best < 3)
    .sort(
      (a, b) =>
        a.best - b.best ||
        b.mistakes / Math.max(1, b.attempts) -
          a.mistakes / Math.max(1, a.attempts) ||
        b.lastAt - a.lastAt,
    )
    .slice(0, n);

export type CalendarDay = { day: string; activity?: DayActivity };

// The last `weeks` whole weeks up to today, Monday first, as columns of seven days.
// Days after today (rest of this week) are left out of the last column.
export function activityCalendar(
  p: Progress,
  now: number,
  weeks: number,
): CalendarDay[][] {
  const today = new Date(now);
  const weekday = (today.getDay() + 6) % 7; // Monday 0 … Sunday 6
  const start = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - weekday - 7 * (weeks - 1),
  );
  const columns: CalendarDay[][] = [];
  for (let w = 0; w < weeks; w++) {
    const column: CalendarDay[] = [];
    for (let d = 0; d < 7; d++) {
      const date = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate() + 7 * w + d,
      );
      if (date.getTime() > now) break;
      const day = dayKey(date.getTime());
      column.push({ day, activity: p.history?.[day] });
    }
    columns.push(column);
  }
  return columns;
}

// Totals over the last `days` days, today included.
export function activityTotals(p: Progress, now: number, days: number) {
  const oldest = dayKey(now - (days - 1) * DAY_MS);
  const today = dayKey(now);
  const totals = { activeDays: 0, xp: 0, chars: 0, answers: 0 };
  for (const [day, a] of Object.entries(p.history ?? {})) {
    if (day < oldest || day > today) continue;
    if (a.xp || a.chars || a.answers) totals.activeDays++;
    totals.xp += a.xp;
    totals.chars += a.chars;
    totals.answers += a.answers;
  }
  return totals;
}

// Calendar shade 0..4 from a day's XP, against the daily goal.
export function activityLevel(a: DayActivity | undefined, goal: number) {
  const xp = a?.xp ?? 0;
  if (xp <= 0) return 0;
  if (xp < goal / 2) return 1;
  if (xp < goal) return 2;
  if (xp < goal * 2) return 3;
  return 4;
}
