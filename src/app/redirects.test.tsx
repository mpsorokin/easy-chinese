// @vitest-environment jsdom
import { render } from '@testing-library/react';
import { createMemoryRouter, RouterProvider, useLocation } from 'react-router';
import { describe, expect, it } from 'vitest';
import { LessonsTab, OldTopic, TopicsTab } from './redirects.tsx';

function Where() {
  const { pathname, search } = useLocation();
  return <p>{pathname + search}</p>;
}

// Same paths as router.tsx; real pages are replaced by a component that prints the URL.
function landOn(url: string) {
  const router = createMemoryRouter(
    [
      { path: 'hsk/:level', element: <Where /> },
      { path: 'hsk/:level/topics', element: <TopicsTab /> },
      { path: 'hsk/:level/topics/:lesson', element: <Where /> },
      { path: 'hsk/:level/topics/:lesson/write', element: <Where /> },
      { path: 'hsk/:level/topics/:lesson/:exercise', element: <Where /> },
      { path: 'hsk/:level/lessons', element: <LessonsTab /> },
      { path: 'hsk/:level/lessons/:lesson', element: <Where /> },
      { path: 'hsk/:level/:lesson', element: <OldTopic /> },
      { path: 'hsk/:level/:lesson/:exercise', element: <OldTopic /> },
    ],
    { initialEntries: [url] },
  );
  const { container, unmount } = render(<RouterProvider router={router} />);
  const at = container.textContent;
  unmount();
  return at;
}

describe('redirects', () => {
  it('moves old topic links under /topics', () => {
    expect(landOn('/hsk/1/3')).toBe('/hsk/1/topics/3');
    expect(landOn('/hsk/1/3/pinyin')).toBe('/hsk/1/topics/3/pinyin');
  });

  it('sends an old link with a bad exercise to the topic', () => {
    expect(landOn('/hsk/1/3/nope')).toBe('/hsk/1/topics/3');
  });

  it('keeps lessons of the Lessons tab where they are', () => {
    expect(landOn('/hsk/1/lessons/1')).toBe('/hsk/1/lessons/1');
  });

  it('opens the tabs for the bare section paths', () => {
    expect(landOn('/hsk/1/lessons')).toBe('/hsk/1?tab=lessons');
    expect(landOn('/hsk/1/topics')).toBe('/hsk/1');
  });
});
