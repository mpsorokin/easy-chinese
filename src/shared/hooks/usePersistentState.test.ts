// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { createStore } from '../lib/storage.ts';
import { usePersistentState } from './usePersistentState.ts';

type Schema = { n: number };
const store = createStore<Schema>('test:');
const num = (raw: unknown) => (typeof raw === 'number' ? raw : 0);

// Simulates a write from another tab: storage changes, then a `storage` event fires here.
function writeFromOtherTab(key: string, value: string | null) {
  if (value === null) localStorage.removeItem(key);
  else localStorage.setItem(key, value);
  window.dispatchEvent(new StorageEvent('storage', { key, newValue: value }));
}

describe('usePersistentState', () => {
  beforeEach(() => localStorage.clear());

  it('reads the stored value and writes changes back', () => {
    localStorage.setItem('test:n', '5');
    const { result } = renderHook(() => usePersistentState(store, 'n', num));
    expect(result.current[0]).toBe(5);
    act(() => result.current[1](6));
    expect(localStorage.getItem('test:n')).toBe('6');
  });

  it('picks up writes from another tab', () => {
    const { result } = renderHook(() => usePersistentState(store, 'n', num));
    act(() => writeFromOtherTab('test:n', '9'));
    expect(result.current[0]).toBe(9);
  });

  it('ignores other keys and other tabs when sync is off', () => {
    const { result } = renderHook(() =>
      usePersistentState(store, 'n', num, { sync: false }),
    );
    act(() => writeFromOtherTab('test:n', '9'));
    act(() => writeFromOtherTab('test:other', '1'));
    expect(result.current[0]).toBe(0);
  });

  it('starts from `initial` instead of the stored value and stores it', () => {
    localStorage.setItem('test:n', '5');
    const { result } = renderHook(() =>
      usePersistentState(store, 'n', num, { initial: 7 }),
    );
    expect(result.current[0]).toBe(7);
    expect(localStorage.getItem('test:n')).toBe('7');
  });
});
