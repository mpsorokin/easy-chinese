import { useState } from 'react';
import { Navigate, useParams } from 'react-router';
import { exerciseLines, isLinesExercise } from '@/data/courseLessons.ts';
import { t } from '@/shared/i18n/en.ts';
import { courseLessonPath } from '@/shared/paths.ts';
import { useCourseParams } from '@/features/lesson/lessonRoute.ts';
import DialogueReader from '@/features/lesson/DialogueReader.tsx';

export default function CourseExercisePage() {
  const { level, lesson } = useCourseParams();
  const exercise = useParams().exercise;
  const [shown, setShown] = useState(false); // pinyin and English start hidden

  const lines =
    lesson && isLinesExercise(exercise)
      ? exerciseLines(lesson, exercise)
      : undefined;
  if (!level || !lesson || !isLinesExercise(exercise) || !lines?.length)
    return <Navigate to="/" replace />;

  return (
    <DialogueReader
      title={t.courseExercises(exercise)}
      subtitle={<span lang="zh-Hans">{t.courseExerciseChinese(exercise)}</span>}
      lines={lines}
      backTo={courseLessonPath(level.id, lesson.id)}
      backLabel={t.lessonN(lesson.id)}
      shown={shown}
      onToggle={() => setShown((v) => !v)}
    />
  );
}
