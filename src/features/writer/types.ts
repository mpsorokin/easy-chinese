// Contract between the writing cell and the exercise modes that drive it.
import type { StrokeData } from 'hanzi-writer';
import type { StrokePaths } from '../../domain/types.ts';

// Imperative API of WritingCell, available through its ref.
export type WriterHandle = {
  animate: (onDone?: () => void) => void;
  highlight: (strokeIndex: number) => void;
};

// Result of one full attempt at the character.
export type AttemptComplete = {
  totalMistakes: number;
  paths: StrokePaths;
};

export type QuizCallbacks = {
  onStart?: () => void;
  onCorrect?: (sd: StrokeData) => void;
  onMistake?: (sd: StrokeData) => void;
  onComplete?: (summary: AttemptComplete) => void;
};
