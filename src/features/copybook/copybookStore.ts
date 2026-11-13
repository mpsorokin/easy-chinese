// localStorage keys owned by the copybook (same `hanzi:` prefix as the rest of the app).
import type { Settings } from '../settings/settings.ts';
import { createStore } from '../../shared/lib/storage.ts';

type CopybookStorage = {
  last: string; // open character of the deck copybook ('/write')
  settings: Settings;
  strokeOrderShown: boolean; // stroke-order strip expanded
  // Open character of every other set: 'last:<level>' a whole HSK level, 'last:s<level>'
  // characters chosen on the HSK list, 'last:t<level>:<n>' a topic,
  // 'last:c<level>:<n>:<part>' a part of a lesson of the Lessons tab.
} & Record<`last:${string}`, string>;

export const copybookStore = createStore<CopybookStorage>('hanzi:');

export type LastKey = 'last' | `last:${string}`;
