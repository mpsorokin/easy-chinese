// @vitest-environment jsdom
import { fireEvent, render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { COURSE_LESSONS, storySteps } from '../../data/courseLessons.ts';
import { t } from '../../shared/i18n/en.ts';
import { journeyKey } from '../progress/progress.ts';
import { saveStory } from '../progress/sessionStore.ts';
import CourseLessonPage from './CourseLessonPage.tsx';

function renderLesson(id: number) {
  const router = createMemoryRouter(
    [{ path: '/hsk/:level/lessons/:lesson', element: <CourseLessonPage /> }],
    { initialEntries: [`/hsk/1/lessons/${id}`] },
  );
  return render(<RouterProvider router={router} />).container;
}

it.each(COURSE_LESSONS)('illustrates every card in lesson $id', (lesson) => {
  const container = renderLesson(lesson.id);
  expect(
    container.querySelectorAll('.course-lesson-card .course-lesson-art img'),
  ).toHaveLength(lesson.exercises.length);
  expect(
    container.querySelectorAll('#course-practice .course-lesson-art img'),
  ).toHaveLength(
    container.querySelectorAll('#course-practice .lesson-ex').length,
  );
});

it('uses the fallback when an illustration fails to load', () => {
  const container = renderLesson(4);
  const father = container.querySelector(
    '[data-exercise="exercise15"] .course-lesson-art img',
  )!;
  expect(father.getAttribute('src')).toMatch(/father\.webp$/);
  fireEvent.error(father);

  expect(
    container.querySelector('[data-exercise="exercise15"] .course-lesson-art')
      ?.childElementCount,
  ).toBe(0);
});

describe('start lesson button', () => {
  afterEach(() => localStorage.clear());
  const lesson = COURSE_LESSONS.find((l) => storySteps(l).length >= 2)!;
  const button = (c: HTMLElement) =>
    c.querySelector<HTMLAnchorElement>('.course-lesson-start-button')!;

  it('starts at the first step', () => {
    const c = renderLesson(lesson.id);
    expect(button(c).textContent).toBe(t.startLesson);
    expect(button(c).getAttribute('href')).toBe(
      `/hsk/1/lessons/${lesson.id}/play/1`,
    );
  });

  it('resumes the dialogues at the saved step', () => {
    saveStory(journeyKey('1', lesson.id, 'story'), 2, 99);
    const c = renderLesson(lesson.id);
    const total = storySteps(lesson).length;
    expect(button(c).textContent).toBe(t.continueLesson(2, total));
    expect(button(c).getAttribute('href')).toBe(
      `/hsk/1/lessons/${lesson.id}/play/2`,
    );
  });

  it('ignores a saved step past the end', () => {
    const total = storySteps(lesson).length;
    saveStory(journeyKey('1', lesson.id, 'story'), total + 1, total + 1);
    const c = renderLesson(lesson.id);
    expect(button(c).textContent).toBe(t.startLesson);
  });
});
