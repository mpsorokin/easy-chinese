import type { ComponentType } from 'react';
import { Navigate, createBrowserRouter } from 'react-router';
import { COURSE_LEVEL, levelPath } from '@/shared/paths.ts';
import RootLayout from '@/app/RootLayout.tsx';
import RouteError from '@/app/RouteError.tsx';
import {
  JourneyTab,
  LessonsTab,
  OldTopic,
  TopicsTab,
} from '@/app/redirects.tsx';

// Old links and installed PWAs may still open '#/hsk'; rewrite them to the path form
// before the router below reads the URL.
const hash = /^#\/(.*)$/.exec(window.location.hash);
if (hash)
  window.history.replaceState(
    null,
    '',
    import.meta.env.BASE_URL + (hash[1] ?? ''),
  );

// Every page is its own chunk, so the first visit loads only the page it opens
// (the copybook's hanzi-writer, the lessons' data and CSS come with their pages).
const page =
  <M extends Record<string, unknown>>(
    load: () => Promise<M>,
    name: keyof M & string = 'default',
  ) =>
  async () => ({
    Component: (await load())[name] as ComponentType,
  });

const copybook = () => import('@/features/copybook/CopybookScreen.tsx');
const journey = () => import('@/features/journey/JourneyQuizPages.tsx');
// '/' home; '/write[/<level>]' the copybook; '/hsk/<level>' a level ('/hsk' alone opens
// HSK 1) with the tabs Lessons, Topics and All characters;
// '/hsk/<level>/topics/<n>[/<exercise>|/write]' a themed topic;
// '/hsk/<level>/lessons/<n>[/…]' a lesson of the Lessons tab;
// '/hsk/<level>/journey[/…]' the journey map (a tab) and its rounds; unknown paths go home.
// The basename lets the app work when deployed under a subdirectory. The host must
// serve index.html for unknown paths (SPA fallback); the service worker does the same offline.
export const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      errorElement: <RouteError />,
      children: [
        {
          index: true,
          lazy: page(() => import('@/features/home/HomePage.tsx')),
        },
        {
          path: 'my-classes/:lesson?',
          lazy: page(() => import('@/features/my-classes/MyClassesPage.tsx')),
        },
        {
          path: 'reading/:story?',
          lazy: page(() => import('@/features/reading/ReadingPage.tsx')),
        },
        {
          path: 'vocabulary',
          lazy: page(() => import('@/features/vocabulary/VocabularyPage.tsx')),
        },
        {
          path: 'stats',
          lazy: page(() => import('@/features/stats/StatsPage.tsx')),
        },
        {
          path: 'my-classes/:lesson/practice/:direction',
          lazy: page(
            () => import('@/features/my-classes/ClassTranslationPage.tsx'),
          ),
        },
        { path: 'write/:level?', lazy: page(copybook) },
        {
          path: 'hsk',
          element: <Navigate to={levelPath(COURSE_LEVEL)} replace />,
        },
        {
          path: 'hsk/:level',
          lazy: page(() => import('@/features/lesson/LevelPage.tsx')),
        },

        { path: 'hsk/:level/topics', element: <TopicsTab /> },
        {
          path: 'hsk/:level/topics/:lesson',
          lazy: page(() => import('@/features/lesson/LessonPage.tsx')),
        },
        {
          path: 'hsk/:level/topics/:lesson/write',
          lazy: page(copybook, 'TopicCopybookScreen'),
        },
        {
          path: 'hsk/:level/topics/:lesson/:exercise',
          lazy: page(() => import('@/features/lesson/ExercisePage.tsx')),
        },

        { path: 'hsk/:level/lessons', element: <LessonsTab /> },
        {
          path: 'hsk/:level/lessons/:lesson',
          lazy: page(() => import('@/features/lesson/CourseLessonPage.tsx')),
        },
        {
          path: 'hsk/:level/lessons/:lesson/:exercise',
          lazy: page(() => import('@/features/lesson/CourseExercisePage.tsx')),
        },
        {
          path: 'hsk/:level/lessons/:lesson/play/:step',
          lazy: page(() => import('@/features/lesson/CourseLessonRunPage.tsx')),
        },
        {
          path: 'hsk/:level/lessons/:lesson/write/:part',
          lazy: page(copybook, 'CourseCopybookScreen'),
        },
        {
          path: 'hsk/:level/lessons/:lesson/quiz/:part/:exercise',
          lazy: page(() => import('@/features/lesson/CourseQuizPage.tsx')),
        },

        { path: 'hsk/:level/journey', element: <JourneyTab /> },
        {
          path: 'hsk/:level/journey/practice/:lesson/:part',
          lazy: page(journey, 'JourneyPracticePage'),
        },
        {
          path: 'hsk/:level/journey/checkpoint/:lesson',
          lazy: page(journey, 'JourneyCheckpointPage'),
        },
        {
          path: 'hsk/:level/journey/review',
          lazy: page(journey, 'JourneyReviewPage'),
        },

        { path: 'hsk/:level/:lesson', element: <OldTopic /> },
        { path: 'hsk/:level/:lesson/:exercise', element: <OldTopic /> },
        { path: '*', element: <Navigate to="/" replace /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
