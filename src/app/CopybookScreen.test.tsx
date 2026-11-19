// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
} from '@testing-library/react';
import type { ReactNode } from 'react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { coursePart, courseLesson } from '../data/courseLessons.ts';
import { STEPS } from '../features/copybook/steps.ts';
import { NEXT_STEP_DELAY } from '../features/copybook/useCopybook.ts';
import type { AttemptComplete } from '../features/writer/types.ts';
import { _resetProgressCache } from '../features/progress/progressStore.ts';
import { t } from '../shared/i18n/en.ts';
import { CourseCopybookScreen } from './CopybookScreen.tsx';

// The writing cell is replaced by a button that reports a clean attempt.
vi.mock('../features/writer/WritingCell.tsx', () => ({
  default: ({
    onComplete,
    children,
  }: {
    onComplete: (r: AttemptComplete) => void;
    children: ReactNode;
  }) => (
    <div>
      <button
        type="button"
        data-testid="write"
        onClick={() => onComplete({ totalMistakes: 0, paths: [] })}
      />
      {children}
    </div>
  ),
}));
// jsdom has no canvas: the stroke drawings are left out.
vi.mock('../features/copybook/CopybookSteps.tsx', () => ({
  default: () => null,
}));
vi.mock('../features/stroke-order/StrokeOrder.tsx', () => ({
  default: () => null,
}));
vi.mock('../data/useCharData.ts', () => ({
  useCharData: () => ({
    status: 'ready',
    data: { strokes: ['M0 0'], medians: [[]] },
    retry: () => {},
  }),
}));

const chars = coursePart(courseLesson('1')!, 1)!.map((e) => e.c);

function renderPart() {
  const router = createMemoryRouter(
    [
      {
        path: '/hsk/:level/lessons/:lesson/write/:part',
        element: <CourseCopybookScreen />,
      },
    ],
    { initialEntries: ['/hsk/1/lessons/1/write/1'] },
  );
  return render(<RouterProvider router={router} />).container;
}

// The header arrows (the word strip has arrows with the same labels).
const arrow = (label: string) =>
  document.querySelector<HTMLButtonElement>(
    `.write-header > button[aria-label="${label}"]`,
  )!;
const glyph = (c: HTMLElement) => c.querySelector('.write-glyph')!.textContent;

// Every step of the open character, then the summary's next button.
function writeChar() {
  for (let i = 0; i < STEPS.length; i++) {
    fireEvent.click(screen.getByTestId('write'));
    act(() => {
      vi.advanceTimersByTime(NEXT_STEP_DELAY);
    });
  }
}

describe('course copybook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    localStorage.clear();
    _resetProgressCache();
  });
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('has more than one character to test with', () => {
    expect(chars.length).toBeGreaterThan(1);
  });

  it('ends the set after the last character instead of starting over', () => {
    const c = renderPart();
    expect(glyph(c)).toBe(chars[0]);
    expect(arrow(t.prev)).toHaveProperty('disabled', true);

    chars.forEach((ch, i) => {
      expect(glyph(c)).toBe(ch);
      writeChar();
      const last = i === chars.length - 1;
      fireEvent.click(
        screen.getByText(last ? t.finishSet : t.nextChar, {
          selector: '.copybook-summary button',
        }),
      );
    });

    expect(screen.getByText(t.setDoneTitle)).toBeTruthy();
    expect(c.querySelector('.write-glyph')).toBeNull();

    // "Write again" starts a new pass at the first character.
    fireEvent.click(screen.getByText(t.setWriteAgain));
    expect(glyph(c)).toBe(chars[0]);
  });

  it('comes back to a skipped character after the last one', () => {
    const c = renderPart();
    // Skip the first character with the arrow, then write the rest.
    fireEvent.click(arrow(t.next));
    for (const ch of chars.slice(1)) {
      expect(glyph(c)).toBe(ch);
      writeChar();
      fireEvent.click(
        screen.getByText(t.nextChar, { selector: '.copybook-summary button' }),
      );
    }
    expect(glyph(c)).toBe(chars[0]);
    expect(arrow(t.next)).toHaveProperty('disabled', false);
  });

  it('disables the next arrow on the last character', () => {
    const c = renderPart();
    for (let i = 1; i < chars.length; i++) fireEvent.click(arrow(t.next));
    expect(glyph(c)).toBe(chars.at(-1));
    expect(arrow(t.next)).toHaveProperty('disabled', true);
    fireEvent.click(arrow(t.next));
    expect(glyph(c)).toBe(chars.at(-1));
  });
});
