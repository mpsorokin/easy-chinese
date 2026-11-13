// localStorage keys owned by the HSK character list (same `hanzi:` prefix as the rest of the app).
import type { PrintOptions } from './printOptions.ts';
import { createStore } from '../../shared/lib/storage.ts';

type HskStorage = {
  hskSelection: string[]; // characters chosen on the HSK 1 list
  printOptions: PrintOptions; // worksheet settings of the print dialog
} & Record<
  `hskSelection:${string}` | `hskWritingSelection:${string}`,
  string[]
>;

export const hskStore = createStore<HskStorage>('hanzi:');

// Selection of a level's list: the Write tool keeps its own one, apart from Print.
export const hskSelectionKey = (level: string, writingOnly: boolean) =>
  writingOnly
    ? (`hskWritingSelection:${level}` as const)
    : level === '1'
      ? ('hskSelection' as const)
      : (`hskSelection:${level}` as const);
