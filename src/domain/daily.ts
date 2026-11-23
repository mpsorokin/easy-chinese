// Daily XP and the streak of days in a row with practice. Pure TypeScript; days are local
// calendar dates.

export type Daily = {
  day: string; // last day with XP, "YYYY-MM-DD"
  xp: number; // XP earned that day
  streak: number; // days in a row up to and including `day`
};

export const DAILY_GOAL = 30;

const pad = (n: number) => String(n).padStart(2, '0');
const fmt = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const dayKey = (now: number) => fmt(new Date(now));

function yesterdayKey(now: number): string {
  const d = new Date(now);
  return fmt(new Date(d.getFullYear(), d.getMonth(), d.getDate() - 1));
}

export function addXp(prev: Daily | undefined, xp: number, now: number): Daily {
  const day = dayKey(now);
  if (prev?.day === day) return { ...prev, xp: prev.xp + xp };
  const streak = prev?.day === yesterdayKey(now) ? prev.streak + 1 : 1;
  return { day, xp, streak };
}

// The streak still counts until the end of the day after the last practice.
export const currentStreak = (d: Daily | undefined, now: number) =>
  d && (d.day === dayKey(now) || d.day === yesterdayKey(now)) ? d.streak : 0;

export const todayXp = (d: Daily | undefined, now: number) =>
  d?.day === dayKey(now) ? d.xp : 0;

export const isDaily = (x: unknown): x is Daily => {
  if (x === null || typeof x !== 'object') return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.day === 'string' &&
    /^\d{4}-\d{2}-\d{2}$/.test(r.day) &&
    typeof r.xp === 'number' &&
    r.xp >= 0 &&
    typeof r.streak === 'number' &&
    Number.isInteger(r.streak) &&
    r.streak >= 1
  );
};
