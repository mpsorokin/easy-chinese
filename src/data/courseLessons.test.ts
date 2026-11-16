import { describe, expect, it } from 'vitest';
import {
  COURSE_LESSONS,
  courseParts,
  courseWords,
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

  // Each lesson brings its own vocabulary and characters.
  it('repeats no word across lessons', () => {
    const words = COURSE_LESSONS.flatMap((l) =>
      (l.words ?? []).map((w) => w.zh),
    );
    expect(words.filter((w, i) => words.indexOf(w) !== i)).toEqual([]);
  });

  it('repeats no practice character across lessons', () => {
    const chars = COURSE_LESSONS.flatMap((l) => [...(l.parts ?? []).join('')]);
    expect(chars.filter((c, i) => chars.indexOf(c) !== i)).toEqual([]);
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

      it('keeps parts short and has words to practise', () => {
        for (const part of lesson.parts ?? [])
          expect([...part].length).toBeLessThanOrEqual(10);
        // A lesson still being written has no "Words" card and no words yet.
        if (lesson.exercises.includes('words'))
          expect(lesson.words?.length).toBeGreaterThan(0);
      });

      // A multi-character word of HSK characters must show up in some part's word quizzes.
      // Lesson 1's parts were chosen by hand and leave out some of its words (老师, 再见).
      it('practises every multi-character word', () => {
        if (lesson.id === 1) return;
        const practised = new Set(
          courseParts(lesson).flatMap((_, i) =>
            courseWords(lesson, i + 1).map((w) => w.w),
          ),
        );
        const missing = (lesson.words ?? [])
          .filter(
            (w) => [...w.zh].length > 1 && [...w.zh].every((c) => hskEntry(c)),
          )
          .filter((w) => !practised.has(w.zh))
          .map((w) => w.zh);
        expect(missing).toEqual([]);
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
