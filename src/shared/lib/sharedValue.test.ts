// @vitest-environment jsdom
import { beforeEach, describe, expect, it } from 'vitest';
import { createStore, sharedValue } from '@/shared/lib/storage.ts';

describe('sharedValue', () => {
  const normalize = (raw: unknown) => (typeof raw === 'number' ? raw : 0);
  const make = () =>
    sharedValue(createStore<{ n: number }>('test:'), 'n', normalize);
  const otherTab = (value: number) => {
    localStorage.setItem('test:n', JSON.stringify(value));
    window.dispatchEvent(new StorageEvent('storage', { key: 'test:n' }));
  };

  beforeEach(() => localStorage.clear());

  it('shares one copy and notifies subscribers on write', () => {
    const value = make();
    const seen: number[] = [];
    const stop = value.subscribe(() => seen.push(value.get()));
    value.set(2);
    expect(value.get()).toBe(2);
    expect(localStorage.getItem('test:n')).toBe('2');
    expect(seen).toEqual([2]);
    stop();
  });

  it('reloads after a write from another tab', () => {
    const value = make();
    const stop = value.subscribe(() => {});
    expect(value.get()).toBe(0);
    otherTab(5);
    expect(value.get()).toBe(5);
    stop();
  });

  it('does not keep a stale copy once nobody listens', () => {
    const value = make();
    const stop = value.subscribe(() => {});
    expect(value.get()).toBe(0);
    stop();
    otherTab(7); // no listener: no storage event reaches the copy
    expect(value.get()).toBe(7);
  });
});
