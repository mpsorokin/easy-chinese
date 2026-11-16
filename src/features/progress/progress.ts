// Learning progress per character and per lesson exercise: pure data operations,
// no React or storage.
import { isGrade } from '../../domain/grading.ts';
import type { BestGrades, Grade } from '../../domain/grading.ts';
import { EXERCISES, isExercise } from '../../domain/exercises.ts';
import type { ExerciseId } from '../../domain/exercises.ts';

// One finished exercise on a character, reported by an exercise mode.
export type AttemptResult = {
  char: string;
  mode: string; // exercise mode id, e.g. 'copybook'
  grade: Grade;
  mistakes: number;
  at: number; // Date.now()
};

export type CharProgress = {
  best: Grade;
  attempts: number; // finished exercises
  mistakes: number; // total over all attempts
  lastAt: number; // time of the last attempt, 0 if unknown (migrated data)
};

// Best result of each exercise of one lesson.
export type ExerciseProgress = { best: Grade; at: number };
export type LessonProgress = Partial<Record<ExerciseId, ExerciseProgress>>;

// v2 added `lessons`; v1 data is read as v2 with no lessons.
export type Progress = {
  version: 2;
  chars: Record<string, CharProgress>;
  lessons: Record<string, LessonProgress>; // by lessonKey
};

export const emptyProgress = (): Progress => ({
  version: 2,
  chars: {},
  lessons: {},
});

// Storage key of a lesson: level id and lesson id, "1:3".
export const lessonKey = (level: string, lesson: number) =>
  `${level}:${lesson}`;
// Lessons of the Lessons tab, kept apart from the themed topics with the same number.
export const courseLessonKey = (level: string, lesson: number, part: number) =>
  `${level}:c${lesson}p${part}`;
const LESSON_KEY = /^[0-9-]+:(\d+|c\d+(p\d+)?)$/;

const SINGLE_CHAR = /^.$/u;

const isCount = (x: unknown): x is number =>
  typeof x === 'number' && Number.isInteger(x) && x >= 0;

function normalizeCharProgress(raw: unknown): CharProgress | undefined {
  if (raw === null || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  if (!isGrade(r.best) || !isCount(r.attempts) || !isCount(r.mistakes))
    return undefined;
  const lastAt = typeof r.lastAt === 'number' && r.lastAt >= 0 ? r.lastAt : 0;
  return {
    best: r.best,
    attempts: r.attempts,
    mistakes: r.mistakes,
    lastAt,
  };
}

function normalizeLessonProgress(raw: unknown): LessonProgress | undefined {
  if (raw === null || typeof raw !== 'object') return undefined;
  const entries: [ExerciseId, ExerciseProgress][] = [];
  for (const [ex, v] of Object.entries(raw)) {
    if (!isExercise(ex) || v === null || typeof v !== 'object') continue;
    const r = v as Record<string, unknown>;
    if (!isGrade(r.best)) continue;
    const at = typeof r.at === 'number' && r.at >= 0 ? r.at : 0;
    entries.push([ex, { best: r.best, at }]);
  }
  return entries.length ? Object.fromEntries(entries) : undefined;
}

function normalizeLessons(raw: unknown): Record<string, LessonProgress> {
  if (raw === null || typeof raw !== 'object') return {};
  const entries: [string, LessonProgress][] = [];
  for (const [k, v] of Object.entries(raw)) {
    const p = normalizeLessonProgress(v);
    if (p && LESSON_KEY.test(k)) entries.push([k, p]);
  }
  return Object.fromEntries(entries);
}

// Stored progress → valid Progress. Invalid entries are dropped; v1 data gets empty lessons.
// Returns undefined when raw is not a v1/v2 progress object at all (missing or foreign data),
// so the caller can fall back to migrating older formats.
export function normalizeProgress(raw: unknown): Progress | undefined {
  if (raw === null || typeof raw !== 'object') return undefined;
  const r = raw as Record<string, unknown>;
  if (
    (r.version !== 1 && r.version !== 2) ||
    r.chars === null ||
    typeof r.chars !== 'object'
  )
    return undefined;
  const entries: [string, CharProgress][] = [];
  for (const [c, v] of Object.entries(r.chars)) {
    const p = normalizeCharProgress(v);
    // Keys are characters; anything longer ('__proto__', junk) is dropped.
    if (p && SINGLE_CHAR.test(c)) entries.push([c, p]);
  }
  // fromEntries defines own properties, so no key can touch the prototype.
  return {
    version: 2,
    chars: Object.fromEntries(entries),
    lessons: r.version === 2 ? normalizeLessons(r.lessons) : {},
  };
}

// Builds progress from the pre-v1 format, where only the best grade per character was kept.
export function migrateBestGrades(best: BestGrades): Progress {
  const chars: Record<string, CharProgress> = {};
  for (const [c, grade] of Object.entries(best))
    chars[c] = { best: grade, attempts: 1, mistakes: 0, lastAt: 0 };
  return { version: 2, chars, lessons: {} };
}

export function recordAttempt(p: Progress, r: AttemptResult): Progress {
  const prev = p.chars[r.char];
  const next: CharProgress = {
    best: prev && prev.best > r.grade ? prev.best : r.grade,
    attempts: (prev?.attempts ?? 0) + 1,
    mistakes: (prev?.mistakes ?? 0) + r.mistakes,
    lastAt: r.at,
  };
  return { ...p, chars: { ...p.chars, [r.char]: next } };
}

export function bestGrades(p: Progress): BestGrades {
  return Object.fromEntries(
    Object.entries(p.chars).map(([c, v]) => [c, v.best]),
  );
}

// Keeps the best grade of a lesson exercise.
export function recordLesson(
  p: Progress,
  key: string,
  ex: ExerciseId,
  grade: Grade,
  at: number,
): Progress {
  const lesson = p.lessons[key] ?? {};
  const prev = lesson[ex];
  const best = prev && prev.best > grade ? prev.best : grade;
  return {
    ...p,
    lessons: { ...p.lessons, [key]: { ...lesson, [ex]: { best, at } } },
  };
}

// A lesson counts as done when every exercise has at least two stars.
export const PASS_GRADE: Grade = 2;

// The writing exercise is not stored per lesson: it is derived from the copybook results of
// the lesson's characters, once every one of them has been written.
export function writeResult(
  p: Progress,
  chars: readonly string[],
): ExerciseProgress | undefined {
  const results = chars.map((c) => p.chars[c]);
  if (!results.length || results.some((r) => !r)) return undefined;
  const done = results as CharProgress[];
  const avg = done.reduce((a, r) => a + r.best, 0) / done.length;
  return {
    best: avg >= 2.8 ? 3 : avg >= 2 ? 2 : 1,
    at: Math.max(...done.map((r) => r.lastAt)),
  };
}

// Results of all exercises of a lesson.
export function lessonResults(
  p: Progress,
  key: string,
  chars: readonly string[],
): LessonProgress {
  const write = writeResult(p, chars);
  return { ...p.lessons[key], ...(write ? { write } : {}) };
}

export type LessonStatus = {
  done: number; // exercises passed
  total: number;
  complete: boolean;
  started: boolean;
  lastAt: number;
};

// Exercises a lesson's status counts. Writing and picking whole words are extra practice, so adding it
// did not take "complete" away from lessons finished before it existed.
const COUNTED = EXERCISES.filter((ex) => ex !== 'wordWrite' && ex !== 'pick');

export function lessonStatus(
  p: Progress,
  key: string,
  chars: readonly string[],
): LessonStatus {
  const lesson = lessonResults(p, key, chars);
  const results = COUNTED.flatMap((ex) => lesson[ex] ?? []);
  const done = results.filter((r) => r.best >= PASS_GRADE).length;
  return {
    done,
    total: COUNTED.length,
    complete: done === COUNTED.length,
    started: results.length > 0,
    lastAt: Math.max(0, ...results.map((r) => r.at)),
  };
}
