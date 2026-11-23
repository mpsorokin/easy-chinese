import { describe, expect, it } from 'vitest';
import { plural } from '@/shared/lib/plural.ts';

describe('plural', () => {
  it('uses the singular only for 1', () => {
    expect(plural(1, 'stroke')).toBe('stroke');
    for (const n of [0, 2, 11, 21]) expect(plural(n, 'stroke')).toBe('strokes');
  });

  it('accepts an irregular plural', () => {
    expect(plural(2, 'child', 'children')).toBe('children');
  });
});
