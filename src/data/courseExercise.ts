// Exercise ids of the "Lessons" tab. Kept apart from courseLessons.ts, which bundles every
// lesson's dialogues, so that shared code (e.g. i18n) can use them without that data.

// Exercises that show a dialogue: exercise1, exercise2, ... with no upper limit.
export type DialogueExercise = `exercise${number}`;

export type CourseExercise = DialogueExercise | 'words';

export const isDialogueExercise = (x: unknown): x is DialogueExercise =>
  typeof x === 'string' && /^exercise[1-9]\d*$/.test(x);

// The number of a dialogue exercise: 12 for "exercise12".
export const exerciseNumber = (ex: DialogueExercise) =>
  Number(ex.slice('exercise'.length));
