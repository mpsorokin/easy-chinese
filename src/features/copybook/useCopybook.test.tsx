// @vitest-environment jsdom
import { act, renderHook } from '@testing-library/react';
import type { StrokeData } from 'hanzi-writer';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { STEPS } from '@/features/copybook/steps.ts';
import { DEFAULT_SETTINGS } from '@/features/settings/settings.ts';
import { t } from '@/shared/i18n/en.ts';
import {
  AFTER_ANIMATION_DELAY,
  NEXT_STEP_DELAY,
  useCopybook,
} from '@/features/copybook/useCopybook.ts';

const item = { c: '人', py: 'rén', en: 'person' };
const data = { strokes: ['M0 0', 'M1 1'], medians: [[], []] };

function setup() {
  const writerRef = {
    current: {
      animate: vi.fn((onDone?: () => void) => onDone?.()),
      highlight: vi.fn(),
    },
  };
  const onFinish = vi.fn();
  const hook = renderHook(() =>
    useCopybook({
      item,
      data,
      settings: DEFAULT_SETTINGS,
      writerRef,
      onFinish,
    }),
  );
  return { hook, writerRef, onFinish };
}

type CopybookHook = ReturnType<typeof setup>['hook'];

// Simulates WritingCell reporting a finished attempt, then waits for the next step.
function completeStep(hook: CopybookHook, totalMistakes = 0) {
  act(() =>
    hook.result.current.handlers.onComplete({ totalMistakes, paths: [] }),
  );
  act(() => {
    vi.advanceTimersByTime(NEXT_STEP_DELAY);
  });
}

describe('useCopybook', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('starts at step 0 with the first step outline and badge', () => {
    const { hook } = setup();
    const r = hook.result.current;
    const first = STEPS[0]!;
    expect(r.step).toBe(0);
    expect(r.active).toBe(true);
    expect(r.summary).toBeNull();
    expect(r.outline).toBe(first.outline);
    expect(r.badge).toBe(t.steps[first.id].badge);
  });

  it('follows STEPS outlines while advancing', () => {
    const { hook } = setup();
    for (const [i, s] of STEPS.entries()) {
      expect(hook.result.current.step).toBe(i);
      expect(hook.result.current.outline).toBe(s.outline);
      completeStep(hook);
    }
  });

  it('shows a summary and calls onFinish once after the last step', () => {
    const { hook, onFinish } = setup();
    for (let i = 0; i < STEPS.length; i++) completeStep(hook, i === 0 ? 1 : 0);

    const r = hook.result.current;
    expect(r.active).toBe(false);
    expect(r.badge).toBeNull();
    expect(r.summary).toEqual({ grade: 3, total: 1 });
    expect(r.status.text).toBe(t.status.summary);
    expect(onFinish).toHaveBeenCalledTimes(1);
    expect(onFinish).toHaveBeenCalledWith('人', { grade: 3, total: 1 });
  });

  it('reset() returns to step 0 without a summary', () => {
    const { hook } = setup();
    for (let i = 0; i < STEPS.length; i++) completeStep(hook);
    act(() => hook.result.current.reset());

    const r = hook.result.current;
    expect(r.step).toBe(0);
    expect(r.results).toEqual([]);
    expect(r.summary).toBeNull();
    expect(r.active).toBe(true);
  });

  it('reset() cancels the pending step transition', () => {
    const { hook } = setup();
    act(() =>
      hook.result.current.handlers.onComplete({ totalMistakes: 0, paths: [] }),
    );
    act(() => hook.result.current.reset());
    act(() => {
      vi.advanceTimersByTime(NEXT_STEP_DELAY);
    });
    expect(hook.result.current.step).toBe(0);
  });

  it('showAnimation() after finishing restarts the copybook', () => {
    const { hook, writerRef } = setup();
    for (let i = 0; i < STEPS.length; i++) completeStep(hook);

    act(() => hook.result.current.showAnimation());
    expect(writerRef.current.animate).toHaveBeenCalledTimes(1);
    expect(hook.result.current.summary).toBeNull(); // hidden while animating

    act(() => {
      vi.advanceTimersByTime(AFTER_ANIMATION_DELAY);
    });
    const r = hook.result.current;
    expect(r.step).toBe(0);
    expect(r.results).toEqual([]);
    expect(r.active).toBe(true);
  });

  it('ignores an animation that finishes after reset()', () => {
    const { hook, writerRef } = setup();
    let finishAnimation = () => {};
    writerRef.current.animate.mockImplementation((onDone?: () => void) => {
      finishAnimation = () => onDone?.();
    });
    for (let i = 0; i < STEPS.length; i++) completeStep(hook);

    act(() => hook.result.current.showAnimation());
    act(() => hook.result.current.reset()); // e.g. switched to another character
    completeStep(hook);
    expect(hook.result.current.step).toBe(1);

    act(() => finishAnimation());
    act(() => {
      vi.advanceTimersByTime(AFTER_ANIMATION_DELAY);
    });
    expect(hook.result.current.step).toBe(1); // progress is kept
  });

  it('reset() cancels the restart scheduled after an animation', () => {
    const { hook } = setup();
    for (let i = 0; i < STEPS.length; i++) completeStep(hook);
    act(() => hook.result.current.showAnimation()); // mock finishes at once
    act(() => hook.result.current.reset());
    act(() =>
      hook.result.current.handlers.onComplete({ totalMistakes: 0, paths: [] }),
    );
    act(() => {
      vi.advanceTimersByTime(AFTER_ANIMATION_DELAY);
    });
    expect(hook.result.current.results).toHaveLength(1); // not wiped by a restart
  });

  it('showHint() highlights the current stroke', () => {
    const { hook, writerRef } = setup();
    act(() =>
      hook.result.current.handlers.onCorrect({
        strokeNum: 0,
        strokesRemaining: 1,
      } as StrokeData),
    );
    act(() => hook.result.current.showHint());
    expect(writerRef.current.highlight).toHaveBeenCalledWith(1);
    expect(hook.result.current.status.text).toBe(t.status.hintFor(2));
  });

  it('adds the hint suffix after enough mistakes', () => {
    const { hook } = setup();
    act(() =>
      hook.result.current.handlers.onMistake({
        strokeNum: 0,
        isBackwards: false,
        mistakesOnStroke: DEFAULT_SETTINGS.hint,
      } as StrokeData),
    );
    expect(hook.result.current.status).toEqual({
      text: t.status.mistake(1) + t.status.seeHint,
      kind: 'err',
    });
  });
});
