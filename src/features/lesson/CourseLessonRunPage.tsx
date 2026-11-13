import { useEffect, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { levelData } from '../../data/hsk.ts';
import {
  courseLesson,
  exerciseLines,
  isDialogueExercise,
} from '../../data/courseLessons.ts';
import { t } from '../../shared/i18n/en.ts';
import { courseLessonPath, courseRunPath } from './lessonNav.ts';
import CourseExerciseView from './CourseExerciseView.tsx';

// "Start lesson": every dialogue exercise of the lesson (not the word list) in a row, one
// per page with a progress bar; each step has its own link
// ('/hsk/<level>/lessons/<n>/play/<step>').
export default function CourseLessonRunPage() {
  const params = useParams();
  const level = levelData(params.level);
  const lesson = courseLesson(params.lesson);
  const step = Number(params.step);
  // Pinyin and English start hidden; the choice carries over to the next steps.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const steps = lesson
    ? lesson.exercises.flatMap((ex) => {
        const lines = isDialogueExercise(ex) ? exerciseLines(lesson, ex) : [];
        return isDialogueExercise(ex) && lines?.length ? [{ ex, lines }] : [];
      })
    : [];
  const current = steps[step - 1];
  if (!level || !lesson || !current) return <Navigate to="/" replace />;

  const lessonPath = courseLessonPath(level.id, lesson.id);
  const last = step === steps.length;

  return (
    <CourseExerciseView
      exercise={current.ex}
      lines={current.lines}
      backTo={lessonPath}
      backLabel={t.lessonN(lesson.id)}
      shown={shown}
      onToggle={() => setShown((v) => !v)}
      progress={
        <div className="course-run-progress">
          <div
            className="course-run-bar"
            role="progressbar"
            aria-label={t.lessonProgressLabel}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-valuenow={step}
          >
            <span style={{ width: `${(step / steps.length) * 100}%` }} />
          </div>
          <span className="course-run-count">
            {t.stepOfTotal(step, steps.length)}
          </span>
        </div>
      }
      footer={
        <Link
          className="course-run-next"
          to={last ? lessonPath : courseRunPath(level.id, lesson.id, step + 1)}
        >
          {last ? t.finishLesson : t.nextExercise}
        </Link>
      }
    />
  );
}
