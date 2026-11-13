import { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { levelData } from '../../data/hsk.ts';
import {
  courseLesson,
  exerciseLines,
  isLinesExercise,
} from '../../data/courseLessons.ts';
import { t } from '../../shared/i18n/en.ts';
import { courseLessonPath } from './lessonNav.ts';
import CourseExerciseView from './CourseExerciseView.tsx';

export default function CourseExercisePage() {
  const params = useParams();
  const level = levelData(params.level);
  const lesson = courseLesson(params.lesson);
  const [shown, setShown] = useState(false); // pinyin and English start hidden

  const exercise = params.exercise;
  const lines =
    lesson && isLinesExercise(exercise)
      ? exerciseLines(lesson, exercise)
      : undefined;
  if (!level || !lesson || !isLinesExercise(exercise) || !lines?.length)
    return <Navigate to="/" replace />;

  return (
    <CourseExerciseView
      exercise={exercise}
      lines={lines}
      backTo={courseLessonPath(level.id, lesson.id)}
      backLabel={t.lessonN(lesson.id)}
      shown={shown}
      onToggle={() => setShown((v) => !v)}
    />
  );
}
