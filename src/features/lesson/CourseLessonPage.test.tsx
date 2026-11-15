// @vitest-environment jsdom
import { fireEvent, render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { expect, it } from 'vitest';
import { COURSE_LESSONS } from '../../data/courseLessons.ts';
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
