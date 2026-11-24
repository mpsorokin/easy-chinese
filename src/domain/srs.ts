// Spaced repetition (Leitner boxes) for characters and words seen in quizzes. Pure TypeScript.

export type SrsEntry = {
  box: number; // 0..SRS_DAYS.length - 1
  due: number; // time it should be reviewed again (Date.now() scale)
};

export const DAY_MS = 86_400_000;
// Days until the next review for each box.
export const SRS_DAYS = [0, 1, 3, 7, 14, 30] as const;
export const TOP_BOX = SRS_DAYS.length - 1;

// A wrong answer sends an item back to box 0, due at once. A right answer moves it up one
// box, but only when it was due: answering the same item twice in a session counts once.
export function srsAnswer(
  prev: SrsEntry | undefined,
  right: boolean,
  now: number,
): SrsEntry {
  if (!right) return { box: 0, due: now };
  if (prev && prev.due > now) return prev;
  const box = prev ? Math.min(prev.box + 1, TOP_BOX) : 1;
  return { box, due: now + SRS_DAYS[box]! * DAY_MS };
}

// Items due for review, the longest overdue first.
export function dueItems(
  srs: Readonly<Record<string, SrsEntry>>,
  now: number,
): string[] {
  return Object.entries(srs)
    .filter(([, e]) => e.due <= now)
    .sort((a, b) => a[1].due - b[1].due)
    .map(([item]) => item);
}

export const isSrsEntry = (x: unknown): x is SrsEntry => {
  if (x === null || typeof x !== 'object') return false;
  const r = x as Record<string, unknown>;
  return (
    typeof r.box === 'number' &&
    Number.isInteger(r.box) &&
    r.box >= 0 &&
    r.box <= TOP_BOX &&
    typeof r.due === 'number' &&
    r.due >= 0
  );
};
