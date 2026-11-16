import { describe, expect, it } from 'vitest';
import {
  COURSE_LESSONS,
  courseParts,
  coursePart,
} from '../../data/courseLessons.ts';
import { HSK1_LEVEL } from '../../data/hsk.ts';
import type { Question } from '../../domain/exercises.ts';
import { DAY_MS } from '../../domain/srs.ts';
import {
  courseLessonKey,
  emptyProgress,
  journeyKey,
  recordAnswer,
  recordAttempt,
  recordJourney,
  recordLesson,
} from '../progress/progress.ts';
import type { Progress } from '../progress/progress.ts';
import {
  REVIEW_MIN,
  buildJourney,
  nodeStatus,
  placeJourney,
} from './journey.ts';
import {
  CHECKPOINT,
  PRACTICE_SIZE,
  checkpointQuiz,
  practiceQuiz,
  reviewQuiz,
  sentenceLines,
} from './journeyQuiz.ts';

// Deterministic rng.
const seeded =
  (seed = 1) =>
  () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

const lesson1 = COURSE_LESSONS[0]!;
const regions = buildJourney('1');
const node = (id: string) =>
  regions.flatMap((r) => r.nodes).find((n) => n.id === id)!;

const writeAll = (p: Progress, chars: readonly string[], grade: 1 | 2 | 3) =>
  chars.reduce(
    (acc, c) =>
      recordAttempt(acc, {
        char: c,
        mode: 'copybook',
        grade,
        mistakes: 0,
        at: 1,
      }),
    p,
  );

describe('buildJourney', () => {
  it('has a region per lesson: story, learn + practice per part, checkpoint', () => {
    expect(regions).toHaveLength(COURSE_LESSONS.length);
    for (const r of regions) {
      const parts = courseParts(r.lesson).length;
      expect(r.nodes.map((n) => n.kind)).toEqual([
        'story',
        ...Array.from({ length: parts }, () => ['learn', 'practice']).flat(),
        'checkpoint',
      ]);
    }
  });

  it('links steps to their pages, the existing ones flagged to return to the map', () => {
    const [story, learn, practice] = regions[0]!.nodes;
    expect(story!.href).toBe('/hsk/1/lessons/1/play/1?from=journey');
    expect(learn!.href).toBe('/hsk/1/lessons/1/write/1?from=journey');
    expect(practice!.href).toBe('/hsk/1/journey/practice/1/1');
    expect(regions[0]!.nodes.at(-1)!.href).toBe('/hsk/1/journey/checkpoint/1');
  });
});

describe('nodeStatus', () => {
  const learn = node(`${courseLessonKey('1', 1, 1)}:learn`);
  const practice = node(journeyKey('1', 1, 'practice', 1));

  it('derives learning from the copybook results of the part', () => {
    expect(nodeStatus(learn, emptyProgress(), '1').state).toBe('untouched');
    const some = writeAll(emptyProgress(), learn.chars.slice(0, 1), 3);
    expect(nodeStatus(learn, some, '1').state).toBe('started');
    expect(
      nodeStatus(learn, writeAll(emptyProgress(), learn.chars, 3), '1'),
    ).toEqual({ state: 'mastered', stars: 3 });
  });

  it('counts practice from the journey round or from all part quizzes', () => {
    const own = recordJourney(emptyProgress(), practice.id, 2, 1);
    expect(nodeStatus(practice, own, '1')).toEqual({ state: 'done', stars: 2 });

    const key = courseLessonKey('1', 1, 1);
    let p = recordLesson(emptyProgress(), key, 'meaning', 3, 1);
    expect(nodeStatus(practice, p, '1').state).toBe('started');
    p = recordLesson(p, key, 'pinyin', 3, 1);
    p = recordLesson(p, key, 'words', 2, 1);
    expect(nodeStatus(practice, p, '1')).toEqual({ state: 'done', stars: 2 });
  });
});

describe('placeJourney', () => {
  it('starts at the first story', () => {
    const { next } = placeJourney('1', emptyProgress(), 0);
    expect(next?.node.id).toBe(journeyKey('1', 1, 'story'));
  });

  it('moves on as steps get done', () => {
    let p = recordJourney(emptyProgress(), journeyKey('1', 1, 'story'), 3, 1);
    p = writeAll(
      p,
      coursePart(lesson1, 1)!.map((e) => e.c),
      2,
    );
    expect(placeJourney('1', p, 0).next?.node.id).toBe(
      journeyKey('1', 1, 'practice', 1),
    );
  });

  it('puts the review after the last finished step once enough is due', () => {
    let p = recordJourney(emptyProgress(), journeyKey('1', 1, 'story'), 3, 1);
    for (const c of ['你', '我']) p = recordAnswer(p, c, false, 0);
    expect(placeJourney('1', p, DAY_MS).regions[0]!.nodes[1]!.node.kind).toBe(
      'learn',
    );
    for (const c of ['他', '好'].slice(0, REVIEW_MIN - 2))
      p = recordAnswer(p, c, false, 0);
    const placed = placeJourney('1', p, DAY_MS);
    expect(placed.regions[0]!.nodes[1]!.node.kind).toBe('review');
    expect(placed.next?.node.id).toBe('1:review');
    expect(placed.due).toBe(REVIEW_MIN);
  });
});

const items = (qs: Question[]) => qs.map((q) => q.item).filter(Boolean);

describe('journey quizzes', () => {
  it('practice: each item once, ends with one word to write', () => {
    const qs = practiceQuiz(HSK1_LEVEL, lesson1, 1, seeded());
    const mixed = qs.filter((q) => q.kind !== 'write');
    expect(mixed.length).toBeLessThanOrEqual(PRACTICE_SIZE);
    expect(new Set(items(mixed)).size).toBe(items(mixed).length);
    expect(qs.filter((q) => q.kind === 'write').length).toBeLessThanOrEqual(1);
    if (qs.some((q) => q.kind === 'write'))
      expect(qs.at(-1)!.kind).toBe('write');
  });

  it('checkpoint: characters and words of the lesson, then dialogue lines', () => {
    const qs = checkpointQuiz(HSK1_LEVEL, lesson1, seeded(3));
    const sentences = qs.filter(
      (q) => q.kind === 'build' && q.mode === 'sentence',
    );
    expect(sentences.length).toBe(CHECKPOINT.sentences);
    expect(qs.slice(-sentences.length)).toEqual(sentences);
    expect(qs.length).toBeLessThanOrEqual(
      CHECKPOINT.chars + CHECKPOINT.words + CHECKPOINT.sentences,
    );
  });

  it('dialogue lines keep only characters with readings', () => {
    for (const l of sentenceLines(lesson1)) {
      expect(l.chars.every((c) => /\p{Script=Han}/u.test(c))).toBe(true);
      // Erhua (哪儿 nǎr) reads as one syllable, so only check there is a reading.
      expect(l.py.length).toBeGreaterThan(0);
    }
  });

  it('review: characters and known words among the due items', () => {
    const qs = reviewQuiz(HSK1_LEVEL, ['你', '好', '老师', 'zz'], seeded());
    expect(new Set(items(qs))).toEqual(new Set(['你', '好', '老师']));
  });
});

describe('unfinished rounds on the map', () => {
  it('shows how far a round got and resumes the dialogues at their step', () => {
    const practiceId = journeyKey('1', 1, 'practice', 1);
    const storyId = journeyKey('1', 1, 'story');
    const sessions = {
      quiz: {
        [practiceId]: {
          questions: practiceQuiz(HSK1_LEVEL, lesson1, 1, seeded()),
          answers: [{ right: true, reveal: '' }],
          at: 0,
        },
      },
      story: { [storyId]: { step: 4, total: 13, at: 0 } },
    };
    const placed = placeJourney('1', emptyProgress(), 0, sessions);
    const [story, , practice] = placed.regions[0]!.nodes;
    expect(story!.status).toMatchObject({
      state: 'started',
      partial: { done: 3, total: 13 },
    });
    expect(story!.node.href).toBe('/hsk/1/lessons/1/play/4?from=journey');
    expect(practice!.status.state).toBe('started');
    expect(practice!.status.partial?.done).toBe(1);
    expect(placed.next?.node.id).toBe(storyId);
  });

  it('counts the steps done', () => {
    const p = recordJourney(emptyProgress(), journeyKey('1', 1, 'story'), 3, 1);
    const placed = placeJourney('1', p, 0);
    expect(placed.done).toBe(1);
    expect(placed.total).toBe(regions.flatMap((r) => r.nodes).length);
  });
});
