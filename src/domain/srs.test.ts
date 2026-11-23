import { describe, expect, it } from 'vitest';
import {
  DAY_MS,
  SRS_DAYS,
  dueItems,
  isSrsEntry,
  srsAnswer,
} from '@/domain/srs.ts';

describe('srsAnswer', () => {
  const now = 10 * DAY_MS;

  it('puts a new item answered right into box 1, due tomorrow', () => {
    expect(srsAnswer(undefined, true, now)).toEqual({
      box: 1,
      due: now + DAY_MS,
    });
  });

  it('sends a wrong answer back to box 0, due at once', () => {
    expect(srsAnswer({ box: 4, due: now + DAY_MS }, false, now)).toEqual({
      box: 0,
      due: now,
    });
  });

  it('moves a due item up one box', () => {
    expect(srsAnswer({ box: 2, due: now }, true, now)).toEqual({
      box: 3,
      due: now + SRS_DAYS[3] * DAY_MS,
    });
  });

  it('does not promote an item that is not due yet', () => {
    const e = { box: 2, due: now + DAY_MS };
    expect(srsAnswer(e, true, now)).toBe(e);
  });

  it('stays in the top box', () => {
    const top = SRS_DAYS.length - 1;
    expect(srsAnswer({ box: top, due: now }, true, now).box).toBe(top);
  });
});

describe('dueItems', () => {
  it('lists due items, the longest overdue first', () => {
    expect(
      dueItems(
        {
          人: { box: 1, due: 5 },
          大: { box: 0, due: 1 },
          山: { box: 2, due: 50 },
        },
        10,
      ),
    ).toEqual(['大', '人']);
  });
});

describe('isSrsEntry', () => {
  it('accepts valid entries only', () => {
    expect(isSrsEntry({ box: 0, due: 0 })).toBe(true);
    expect(isSrsEntry({ box: 9, due: 0 })).toBe(false);
    expect(isSrsEntry({ box: 1.5, due: 0 })).toBe(false);
    expect(isSrsEntry({ box: 1, due: -1 })).toBe(false);
    expect(isSrsEntry(null)).toBe(false);
  });
});
