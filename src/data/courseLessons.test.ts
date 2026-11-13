import { describe, expect, it } from 'vitest';
import {
  COURSE_LESSONS,
  courseParts,
  exerciseLines,
  isExerciseReady,
  isLinesExercise,
} from './courseLessons.ts';
import { hskEntry } from './hsk.ts';

describe('COURSE_LESSONS', () => {
  it('has unique lesson ids', () => {
    const ids = COURSE_LESSONS.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  for (const lesson of COURSE_LESSONS) {
    describe(`lesson ${lesson.id}`, () => {
      // A character missing from the HSK data would be dropped silently from its part.
      it('uses only HSK characters in its parts', () => {
        const missing = (lesson.parts ?? [])
          .flatMap((p) => [...p])
          .filter((c) => !hskEntry(c));
        expect(missing).toEqual([]);
      });

      // Own descriptions, when given, must cover every exercise: a missing one would
      // silently fall back to lesson 1's topic.
      it('describes every exercise if it has its own descriptions', () => {
        if (!lesson.descriptions) return;
        for (const ex of lesson.exercises)
          expect(lesson.descriptions[ex]?.trim()).toBeTruthy();
      });

      it('has no empty practice part', () => {
        for (const part of courseParts(lesson))
          expect(part.length).toBeGreaterThan(0);
      });

      it('has content for every listed exercise it calls ready', () => {
        for (const ex of lesson.exercises) {
          if (!isExerciseReady(lesson, ex)) continue;
          expect(isLinesExercise(ex)).toBe(true);
          if (!isLinesExercise(ex)) continue;
          for (const line of exerciseLines(lesson, ex) ?? []) {
            expect(line.segments.length).toBeGreaterThan(0);
            expect(line.en.trim()).not.toBe('');
          }
        }
      });
    });
  }
});
