// Grades are 1..3 stars.
import type { StrokePaths } from '@/domain/types.ts';

export type Grade = 1 | 2 | 3;

export const isGrade = (x: unknown): x is Grade =>
  x === 1 || x === 2 || x === 3;

export type StepResult = {
  grade: Grade;
  mistakes: number;
  paths: StrokePaths;
};

// Best grade per character, as stored in progress.
export type BestGrades = Record<string, Grade>;

export type FinalGrade = {
  grade: Grade;
  total: number;
};

// Grade for a single attempt.
export function gradeFor(mistakes: number, strokeCount: number): Grade {
  if (mistakes === 0) return 3;
  return mistakes <= Math.max(1, Math.ceil(strokeCount / 3)) ? 2 : 1;
}

// Final grade for a whole copybook exercise, from per-step results ({ grade, mistakes }).
export function finalGrade(
  results: readonly Pick<StepResult, 'grade' | 'mistakes'>[],
): FinalGrade {
  if (results.length === 0) throw new Error('finalGrade: no results');
  const total = results.reduce((a, r) => a + r.mistakes, 0);
  const avg = results.reduce((a, r) => a + r.grade, 0) / results.length;
  const grade: Grade = avg >= 2.8 ? 3 : avg >= 2 ? 2 : 1;
  return { grade, total };
}

// Grade for a quiz exercise from the share of right answers.
export function quizGrade(right: number, total: number): Grade {
  if (total <= 0) throw new Error('quizGrade: no questions');
  const share = right / total;
  return share >= 0.9 ? 3 : share >= 0.7 ? 2 : 1;
}

// Best grade per character from storage: drops anything that is not a valid grade.
export function normalizeBest(raw: unknown): BestGrades {
  if (raw === null || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return Object.fromEntries(
    Object.entries(raw).filter((e): e is [string, Grade] => isGrade(e[1])),
  );
}
