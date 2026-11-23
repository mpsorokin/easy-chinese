// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { useProgress } from '@/features/progress/useProgress.ts';
import { _resetProgressCache } from '@/features/progress/progressStore.ts';

const attempt = (char: string) => ({
  char,
  mode: 'copybook',
  grade: 3 as const,
  mistakes: 0,
  at: 1,
});

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear();
    _resetProgressCache();
  });

  it('shares one copy between callers in the same tab', () => {
    const a = renderHook(() => useProgress());
    const b = renderHook(() => useProgress());
    act(() => a.result.current.record(attempt('人')));
    expect(b.result.current.best['人']).toBe(3);
    expect(localStorage.getItem('hanzi:progress')).toContain('人');
  });

  it('reloads after a write from another tab', () => {
    const { result } = renderHook(() => useProgress());
    const stored = {
      version: 2,
      chars: { 大: { best: 2, attempts: 1, mistakes: 1, lastAt: 1 } },
      lessons: {},
    };
    act(() => {
      localStorage.setItem('hanzi:progress', JSON.stringify(stored));
      window.dispatchEvent(
        new StorageEvent('storage', { key: 'hanzi:progress' }),
      );
    });
    expect(result.current.best['大']).toBe(2);
  });
});
