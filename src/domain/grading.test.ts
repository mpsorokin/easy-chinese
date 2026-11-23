import { describe, expect, it } from 'vitest';
import { finalGrade, gradeFor, normalizeBest } from '@/domain/grading.ts';
import type { Grade } from '@/domain/grading.ts';

describe('gradeFor', () => {
  it('gives 3 stars when there are no mistakes', () => {
    expect(gradeFor(0, 10)).toBe(3);
  });

  it('gives 2 stars for a few mistakes within tolerance', () => {
    expect(gradeFor(1, 9)).toBe(2);
    expect(gradeFor(3, 9)).toBe(2);
  });

  it('gives 1 star when mistakes exceed tolerance', () => {
    expect(gradeFor(4, 9)).toBe(1);
  });
});

describe('finalGrade', () => {
  it('sums mistakes and picks grade from average', () => {
    const results = [
      { grade: 3, mistakes: 0 },
      { grade: 3, mistakes: 0 },
      { grade: 3, mistakes: 1 },
    ] as const;
    expect(finalGrade(results)).toEqual({ grade: 3, total: 1 });
  });

  it('uses 2.8 and 2.0 average as grade boundaries', () => {
    const r = (...grades: Grade[]) =>
      grades.map((grade) => ({ grade, mistakes: 0 }));
    // avg 2.8 -> 3 stars
    expect(finalGrade(r(3, 3, 3, 3, 2)).grade).toBe(3);
    // avg 2.6 -> 2 stars
    expect(finalGrade(r(3, 3, 3, 2, 2)).grade).toBe(2);
    // avg 2.0 -> 2 stars
    expect(finalGrade(r(3, 1)).grade).toBe(2);
    // avg 1.5 -> 1 star
    expect(finalGrade(r(2, 1)).grade).toBe(1);
  });

  it('rejects an empty result list instead of returning NaN-based grade', () => {
    expect(() => finalGrade([])).toThrow('no results');
  });

  it('returns a low grade when attempts were weak', () => {
    const results = [
      { grade: 1, mistakes: 5 },
      { grade: 1, mistakes: 4 },
    ] as const;
    expect(finalGrade(results)).toEqual({ grade: 1, total: 9 });
  });
});

describe('normalizeBest', () => {
  it('keeps valid grades and drops everything else', () => {
    expect(normalizeBest({ 人: 3, 大: 1, 小: 0, 山: '2', 水: 4 })).toEqual({
      人: 3,
      大: 1,
    });
  });

  it('returns an empty object for missing or broken data', () => {
    for (const raw of [undefined, null, 'x', 3, [3]])
      expect(normalizeBest(raw), String(raw)).toEqual({});
  });
});
