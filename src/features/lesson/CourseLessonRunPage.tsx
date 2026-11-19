import { useEffect, useState } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router';
import { storySteps } from '../../data/courseLessons.ts';
import { t } from '../../shared/i18n/en.ts';
import {
  FROM_JOURNEY,
  courseLessonPath,
  courseRunPath,
  fromJourney,
  journeyPath,
} from './lessonNav.ts';
import { useCourseParams } from './lessonRoute.ts';
import { journeyKey } from '../progress/progress.ts';
import { useProgress } from '../progress/useProgress.ts';
import { clearStory, saveStory } from '../progress/sessionStore.ts';
import CourseExerciseView from './CourseExerciseView.tsx';

// "Start lesson": every dialogue exercise of the lesson (not the word list) in a row, one
// per page with a progress bar; each step has its own link
// ('/hsk/<level>/lessons/<n>/play/<step>').
export default function CourseLessonRunPage() {
  const { level, lesson } = useCourseParams();
  const step = Number(useParams().step);
  const { search } = useLocation();
  const toMap = fromJourney(search);
  const { readStory } = useProgress();
  // Pinyin and English start hidden; the choice carries over to the next steps.
  const [shown, setShown] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [step]);

  const steps = lesson ? storySteps(lesson) : [];
  const current = steps[step - 1];
  const storyKey =
    level && lesson ? journeyKey(level.id, lesson.id, 'story') : undefined;
  const total = steps.length;

  // The step reached is kept, so the journey map can resume the dialogues there.
  useEffect(() => {
    if (storyKey && step >= 1 && step <= total)
      saveStory(storyKey, step, total);
  }, [storyKey, step, total]);

  if (!level || !lesson || !storyKey) return <Navigate to="/" replace />;
  // A step out of range (an old link): back to the lesson.
  if (!current)
    return <Navigate to={courseLessonPath(level.id, lesson.id)} replace />;

  const lessonPath = courseLessonPath(level.id, lesson.id);
  const last = step === steps.length;
  // Opened from the journey map: every step keeps the flag and the run ends on the map.
  const backTo = toMap ? journeyPath(level.id) : lessonPath;
  const nextTo = courseRunPath(level.id, lesson.id, step + 1);

  return (
    <CourseExerciseView
      exercise={current.ex}
      lines={current.lines}
      backTo={backTo}
      backLabel={toMap ? t.journey.toMap : t.lessonN(lesson.id)}
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
          to={last ? backTo : toMap ? `${nextTo}?${FROM_JOURNEY}` : nextTo}
          onClick={
            last
              ? () => {
                  clearStory(storyKey);
                  readStory(storyKey);
                }
              : undefined
          }
        >
          {last ? t.finishLesson : t.nextExercise}
        </Link>
      }
    />
  );
}
