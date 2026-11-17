import { describe, expect, it } from 'vitest';
import { COURSE_LESSONS } from '../../../data/courseLessons.ts';
import { courseExerciseArt } from '../courseExerciseArt.ts';
import { art, artPaths } from './index.ts';

describe('lesson art', () => {
  it('has a unique name for every picture', () => {
    const names = artPaths.map((p) => p.slice(p.lastIndexOf('/') + 1));
    expect(new Set(names).size).toBe(names.length);
  });

  it('throws for an unknown name', () => {
    expect(() => art('no-such-picture')).toThrow(/no-such-picture/);
  });

  it('gives every exercise card of every lesson a picture', () => {
    for (const lesson of COURSE_LESSONS)
      for (const ex of lesson.exercises)
        expect(courseExerciseArt(lesson.id, ex), `${lesson.id}:${ex}`).toMatch(
          /\.webp$/,
        );
  });
});
