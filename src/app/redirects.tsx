// Routes that only redirect: short forms and old addresses.
import { Navigate, useParams } from 'react-router';
import {
  exercisePath,
  journeyPath,
  lessonPath,
  levelLessonsPath,
  levelPath,
} from '../shared/paths.ts';
import { isExercise } from '../domain/exercises.ts';

// '/hsk/<level>/lessons' alone is the Lessons tab of the level page.
export function LessonsTab() {
  const { level = '1' } = useParams();
  return <Navigate to={levelLessonsPath(level)} replace />;
}

// '/hsk/<level>/journey' alone is the Journey tab.
export function JourneyTab() {
  const { level = '1' } = useParams();
  return <Navigate to={journeyPath(level)} replace />;
}

// '/hsk/<level>/topics' alone is the Topics tab.
export function TopicsTab() {
  const { level = '1' } = useParams();
  return <Navigate to={levelPath(level)} replace />;
}

// Topics used to live at '/hsk/<level>/<n>[/<exercise>]'.
export function OldTopic() {
  const { level = '1', lesson, exercise } = useParams();
  const n = Number(lesson);
  if (!Number.isInteger(n)) return <Navigate to={levelPath(level)} replace />;
  const to = isExercise(exercise)
    ? exercisePath(level, n, exercise)
    : lessonPath(level, n);
  return <Navigate to={to} replace />;
}
