import { expect, test } from 'vitest';
import { t } from './en.ts';
import { isDialogueExercise } from '../../data/courseLessons.ts';

test('exercise titles are generated for any number', () => {
  expect(t.courseExercises('exercise1')).toBe('Exercise 1');
  expect(t.courseExercises('exercise42')).toBe('Exercise 42');
  expect(t.courseExercises('words')).toBe('Words');
});

test('Chinese exercise subtitles use Chinese numerals', () => {
  expect(t.courseExerciseChinese('exercise1')).toBe('练习一');
  expect(t.courseExerciseChinese('exercise10')).toBe('练习十');
  expect(t.courseExerciseChinese('exercise12')).toBe('练习十二');
  expect(t.courseExerciseChinese('exercise27')).toBe('练习二十七');
  expect(t.courseExerciseChinese('exercise40')).toBe('练习四十');
  expect(t.courseExerciseChinese('words')).toBe('生词');
});

test('any exerciseN is a dialogue exercise', () => {
  expect(isDialogueExercise('exercise28')).toBe(true);
  expect(isDialogueExercise('exercise150')).toBe(true);
  expect(isDialogueExercise('exercise0')).toBe(false);
  expect(isDialogueExercise('exercise')).toBe(false);
  expect(isDialogueExercise('words')).toBe(false);
});
