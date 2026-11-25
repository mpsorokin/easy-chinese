// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { isChunkLoadError, reloadOnce } from '@/shared/lib/staleBuild.ts';

describe('isChunkLoadError', () => {
  it('knows the browsers’ chunk load messages', () => {
    for (const message of [
      'Failed to fetch dynamically imported module: /assets/LevelPage-x.js',
      'Importing a module script failed.',
      'error loading dynamically imported module',
      'Unable to preload CSS for /assets/Seg-x.css',
    ])
      expect(isChunkLoadError(new Error(message))).toBe(true);
  });

  it('leaves other errors alone', () => {
    expect(isChunkLoadError(new Error('x is undefined'))).toBe(false);
    expect(
      isChunkLoadError('Failed to fetch dynamically imported module'),
    ).toBe(false);
  });
});

describe('reloadOnce', () => {
  const reload = vi.fn();
  const assign = vi.fn();
  const location = window.location;
  beforeEach(() => {
    sessionStorage.clear();
    reload.mockClear();
    assign.mockClear();
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { ...location, reload, assign },
    });
  });
  afterEach(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: location,
    });
  });

  it('reloads once, not again right after', () => {
    expect(reloadOnce(undefined, 1_000_000)).toBe(true);
    expect(reloadOnce(undefined, 1_005_000)).toBe(false);
    expect(reload).toHaveBeenCalledTimes(1);
  });

  it('reloads again once the guard has passed', () => {
    reloadOnce(undefined, 1_000_000);
    expect(reloadOnce(undefined, 1_020_000)).toBe(true);
    expect(reload).toHaveBeenCalledTimes(2);
  });

  it('opens the page being navigated to', () => {
    expect(reloadOnce('/hsk/1', 1_000_000)).toBe(true);
    expect(assign).toHaveBeenCalledWith('/hsk/1');
    expect(reload).not.toHaveBeenCalled();
  });
});
