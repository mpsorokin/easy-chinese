// Lesson exercise ids and question shapes. Pure TypeScript, no React.
export const EXERCISES = [
  'write',
  'wordWrite',
  'pick',
  'meaning',
  'pinyin',
  'words',
] as const;
export type ExerciseId = (typeof EXERCISES)[number];

export const isExercise = (x: unknown): x is ExerciseId =>
  typeof x === 'string' && (EXERCISES as readonly string[]).includes(x);

// Exercises run as a quiz; writing runs in the copybook instead.
export type QuizId = Exclude<ExerciseId, 'write'>;

// The exercises a set of characters offers. Without words there is no word quiz; without
// multi-character words there is nothing to write as a word or to pick from tiles.
export const availableExercises = ({
  hasWords,
  hasMultiWords,
}: {
  hasWords: boolean;
  hasMultiWords: boolean;
}): ExerciseId[] =>
  EXERCISES.filter(
    (ex) =>
      (ex !== 'words' || hasWords) &&
      ((ex !== 'wordWrite' && ex !== 'pick') || hasMultiWords),
  );

export type Rng = () => number;

// What the speaker button pronounces. `afterAnswer`: only once answered, when hearing it
// would give the answer away (the reading in the pinyin quiz, the word to build).
export type Audio = { text: string; afterAnswer?: boolean };

// One multiple-choice question: `prompt` is shown big (a character or word), `hint` under it.
// Options are shown as text; for 'build' questions they are characters to tap in order.
// Modes: 'show' shows the prompt (default); 'listen' hides it when audio is available;
// 'listenOnly' requires playback before choosing and hides the prompt until answered.
// optionLang 'zh' — the options are Chinese words (shown with a CJK font).
export type ChoiceQuestion = {
  kind: 'choice';
  mode?: 'show' | 'listen' | 'listenOnly' | 'toWord';
  optionLang?: 'zh';
  prompt: string;
  hint?: string;
  options: string[];
  answer: number; // index into options
  // Shown after answering: the full entry, so a wrong answer still teaches.
  reveal: string;
  audio?: Audio;
  // The character or word the question checks (spaced repetition keys on it).
  item?: string;
};

// Tile questions, all shown with the "Build the word" layout:
//  build   — meaning + pinyin given, tap the word's characters in order;
//  listen  — only the sound is given, tap the characters (dictation);
//  reading — the word is given, tap its syllables in order (tone practice);
//  gap     — pick the word's characters from 5–7 tiles, all slots empty;
//  sentence — a short line of a lesson dialogue from its translation.
type BuildMode = 'build' | 'listen' | 'reading' | 'gap' | 'sentence';

export type BuildQuestion = {
  kind: 'build';
  mode: BuildMode;
  prompt: string; // the meaning, or the word itself for 'reading'
  hint?: string;
  cells: string[]; // the full answer, one cell per character or syllable
  blanks: number[]; // indexes of the cells to fill, in order; the rest are shown
  tiles: string[]; // the missing cells plus distractors, shuffled
  tileLang: 'zh' | 'pinyin';
  reveal: string;
  audio?: Audio;
  item?: string;
};

// Write a whole word by hand, several passes with a fading outline.
export type WriteQuestion = {
  kind: 'write';
  prompt: string; // the meaning
  hint: string; // pinyin
  answer: string; // the word
  reveal: string;
  audio: Audio;
  item?: string;
};

export type Question = ChoiceQuestion | BuildQuestion | WriteQuestion;

export const OPTIONS = 4;
