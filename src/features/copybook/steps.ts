// Copybook steps: outline is the outline visibility (1 = solid, 0 = hidden).
// One pass over a faint outline, one over a barely visible one, then solo repetitions.
// Labels live in i18n (t.steps[id]).
type StepId = 'faint' | 'barely' | 'free';

type Step = {
  id: StepId;
  outline: number;
};

const SOLO_COUNT = 6;

export const STEPS: readonly Step[] = [
  { id: 'faint', outline: 0.7 },
  { id: 'barely', outline: 0.25 },
  ...Array.from({ length: SOLO_COUNT }, (): Step => ({
    id: 'free',
    outline: 0,
  })),
];
