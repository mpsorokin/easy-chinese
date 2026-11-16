import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  bestGrades,
  emptyProgress,
  gainXp,
  lessonStatus,
  migrateBestGrades,
  normalizeProgress,
  recordAnswer,
  recordAttempt,
  recordJourney,
  recordLesson,
  writeResult,
} from './progress.ts';
import type { AttemptResult } from './progress.ts';
import { loadProgress } from './progressStore.ts';

const attempt = (over: Partial<AttemptResult> = {}): AttemptResult => ({
  char: '人',
  mode: 'copybook',
  grade: 2,
  mistakes: 3,
  at: 1000,
  ...over,
});

describe('recordAttempt', () => {
  it('creates an entry on the first attempt', () => {
    const p = recordAttempt(emptyProgress(), attempt());
    expect(p.chars['人']).toEqual({
      best: 2,
      attempts: 1,
      mistakes: 3,
      lastAt: 1000,
    });
  });

  it('keeps the best grade and accumulates attempts and mistakes', () => {
    let p = recordAttempt(emptyProgress(), attempt({ grade: 3, mistakes: 0 }));
    p = recordAttempt(p, attempt({ grade: 1, mistakes: 5, at: 2000 }));
    expect(p.chars['人']).toEqual({
      best: 3,
      attempts: 2,
      mistakes: 5,
      lastAt: 2000,
    });
  });

  it('does not mutate the input', () => {
    const p = emptyProgress();
    recordAttempt(p, attempt());
    expect(p).toEqual(emptyProgress());
  });
});

describe('normalizeProgress', () => {
  it('returns undefined for missing or foreign data', () => {
    for (const raw of [
      undefined,
      null,
      'x',
      { 人: 3 },
      { version: 2 },
      { version: 3, chars: {} },
    ])
      expect(normalizeProgress(raw), JSON.stringify(raw)).toBeUndefined();
  });

  it('drops invalid entries and keeps valid ones', () => {
    const raw = {
      version: 1,
      chars: {
        人: { best: 3, attempts: 2, mistakes: 1, lastAt: 5 },
        大: { best: 4, attempts: 1, mistakes: 0, lastAt: 5 },
        小: { best: 2, attempts: -1, mistakes: 0 },
        山: { best: 1, attempts: 1, mistakes: 0 }, // lastAt missing → 0
      },
    };
    expect(normalizeProgress(raw)).toEqual({
      version: 2,
      chars: {
        人: { best: 3, attempts: 2, mistakes: 1, lastAt: 5 },
        山: { best: 1, attempts: 1, mistakes: 0, lastAt: 0 },
      },
      lessons: {},
    });
  });

  it('drops keys that are not a single character, including __proto__', () => {
    const entry = { best: 3, attempts: 1, mistakes: 0, lastAt: 0 };
    const raw: unknown = JSON.parse(
      JSON.stringify({ version: 1, chars: { 人: entry, ab: entry } }).replace(
        '"ab"',
        '"__proto__"',
      ),
    );
    const p = normalizeProgress(raw);
    expect(Object.keys(p?.chars ?? {})).toEqual(['人']);
    expect(Object.getPrototypeOf(p?.chars)).toBe(Object.prototype);
  });
});

describe('lesson progress', () => {
  it('keeps valid lesson results and drops invalid ones', () => {
    const raw = {
      version: 2,
      chars: {},
      lessons: {
        '1:3': { meaning: { best: 3, at: 7 }, pinyin: { best: 5 }, foo: {} },
        '1:4': { write: { best: 2 } }, // at missing → 0
        bad: { write: { best: 2, at: 1 } },
        '1:5': { pinyin: { best: 0 } }, // nothing valid → dropped
      },
    };
    expect(normalizeProgress(raw)?.lessons).toEqual({
      '1:3': { meaning: { best: 3, at: 7 } },
      '1:4': { write: { best: 2, at: 0 } },
    });
  });

  it('records the best grade per exercise', () => {
    let p = recordLesson(emptyProgress(), '1:1', 'meaning', 3, 10);
    p = recordLesson(p, '1:1', 'meaning', 1, 20);
    p = recordLesson(p, '1:1', 'pinyin', 2, 30);
    expect(p.lessons['1:1']).toEqual({
      meaning: { best: 3, at: 20 },
      pinyin: { best: 2, at: 30 },
    });
  });

  it('counts a lesson complete when every exercise has two stars or more', () => {
    let p = emptyProgress();
    expect(lessonStatus(p, '1:1', ['人'])).toMatchObject({
      done: 0,
      total: 4,
      started: false,
      complete: false,
    });
    p = recordAttempt(p, attempt({ grade: 2, at: 1 }));
    p = recordLesson(p, '1:1', 'meaning', 3, 2);
    p = recordLesson(p, '1:1', 'pinyin', 1, 3);
    expect(lessonStatus(p, '1:1', ['人'])).toMatchObject({
      done: 2,
      started: true,
      complete: false,
      lastAt: 3,
    });
    p = recordLesson(p, '1:1', 'pinyin', 2, 4);
    p = recordLesson(p, '1:1', 'words', 3, 5);
    expect(lessonStatus(p, '1:1', ['人']).complete).toBe(true);
    expect(lessonStatus(p, '1:1', ['人', '大']).complete).toBe(false);
  });
});

describe('writeResult', () => {
  it('needs every character written and averages their best grades', () => {
    let p = recordAttempt(
      emptyProgress(),
      attempt({ char: '人', grade: 3, at: 5 }),
    );
    expect(writeResult(p, ['人', '大'])).toBeUndefined();
    p = recordAttempt(p, attempt({ char: '大', grade: 2, at: 9 }));
    expect(writeResult(p, ['人', '大'])).toEqual({ best: 2, at: 9 });
    expect(writeResult(p, [])).toBeUndefined();
  });
});

describe('migrateBestGrades / bestGrades', () => {
  it('round-trips best grades', () => {
    const best = { 人: 3, 大: 1 } as const;
    expect(bestGrades(migrateBestGrades(best))).toEqual(best);
  });
});

describe('loadProgress', () => {
  const data = new Map<string, string>();
  beforeEach(() => {
    data.clear();
    vi.stubGlobal('localStorage', {
      getItem: (k: string) => data.get(k) ?? null,
      setItem: (k: string, v: string) => data.set(k, v),
    });
  });
  afterEach(() => vi.unstubAllGlobals());

  it('migrates legacy hanzi:best when there is no progress yet', () => {
    data.set('hanzi:best', JSON.stringify({ 人: 3, 大: 'bad' }));
    expect(loadProgress(undefined)).toEqual({
      version: 2,
      chars: { 人: { best: 3, attempts: 1, mistakes: 0, lastAt: 0 } },
      lessons: {},
    });
  });

  it('prefers v1 progress over legacy data and upgrades it to v2', () => {
    data.set('hanzi:best', JSON.stringify({ 人: 1 }));
    const v1 = {
      version: 1,
      chars: { 人: { best: 3, attempts: 4, mistakes: 2, lastAt: 9 } },
    };
    expect(loadProgress(v1)).toEqual({ ...v1, version: 2, lessons: {} });
  });

  it('starts empty when nothing is stored', () => {
    expect(loadProgress(undefined)).toEqual(emptyProgress());
  });
});

describe('journey fields', () => {
  it('keeps valid journey results, review boxes and daily XP, drops the rest', () => {
    const raw = {
      version: 2,
      chars: {},
      lessons: {},
      journey: {
        '1:c3:story': { best: 3, at: 4 },
        '1:c3p2:practice': { best: 2 }, // at missing → 0
        '1:c3:bogus': { best: 2, at: 1 },
        '1:c3:checkpoint': { best: 7, at: 1 },
      },
      srs: {
        人: { box: 2, due: 9 },
        老师: { box: 0, due: 1 },
        ab: { box: 1, due: 1 },
        大: { box: 99, due: 1 },
      },
      daily: { day: '2026-03-10', xp: 12, streak: 3 },
    };
    expect(normalizeProgress(raw)).toEqual({
      version: 2,
      chars: {},
      lessons: {},
      journey: {
        '1:c3:story': { best: 3, at: 4 },
        '1:c3p2:practice': { best: 2, at: 0 },
      },
      srs: { 人: { box: 2, due: 9 }, 老师: { box: 0, due: 1 } },
      daily: { day: '2026-03-10', xp: 12, streak: 3 },
    });
  });

  it('leaves the fields out until they are used', () => {
    const p = normalizeProgress({ version: 2, chars: {}, lessons: {} });
    expect(p && Object.keys(p)).toEqual(['version', 'chars', 'lessons']);
  });

  it('records journey bests, review answers and XP', () => {
    let p = recordJourney(emptyProgress(), '1:c1:checkpoint', 3, 1);
    p = recordJourney(p, '1:c1:checkpoint', 1, 2);
    expect(p.journey?.['1:c1:checkpoint']).toEqual({ best: 3, at: 2 });
    p = recordAnswer(p, '人', false, 5);
    expect(p.srs?.['人']).toEqual({ box: 0, due: 5 });
    expect(recordAnswer(p, 'x', true, 5)).toBe(p);
    expect(gainXp(p, 0, 5)).toBe(p);
    expect(gainXp(p, 4, new Date(2026, 0, 2).getTime()).daily).toEqual({
      day: '2026-01-02',
      xp: 4,
      streak: 1,
    });
  });
});
