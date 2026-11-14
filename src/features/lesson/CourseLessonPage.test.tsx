// @vitest-environment jsdom
import { fireEvent, render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { expect, it } from 'vitest';
import { lesson4 } from '../../data/lessons/lesson4.ts';
import CourseLessonPage from './CourseLessonPage.tsx';

it('shows art for every lesson four exercise and falls back on a broken image', () => {
  const router = createMemoryRouter(
    [{ path: '/hsk/:level/lessons/:lesson', element: <CourseLessonPage /> }],
    { initialEntries: ['/hsk/1/lessons/4'] },
  );
  const { container } = render(<RouterProvider router={router} />);
  const illustrations = container.querySelectorAll('.course-lesson-art img');

  expect(illustrations).toHaveLength(lesson4.exercises.length);

  const father = container.querySelector(
    '[data-exercise="exercise15"] .course-lesson-art img',
  )!;
  expect(father.getAttribute('src')).toMatch(/father\.webp$/);
  fireEvent.error(father);

  expect(
    container.querySelector('[data-exercise="exercise15"] .course-lesson-art')
      ?.childElementCount,
  ).toBe(0);
  expect(container.querySelectorAll('.course-lesson-art img')).toHaveLength(
    lesson4.exercises.length - 1,
  );
});
