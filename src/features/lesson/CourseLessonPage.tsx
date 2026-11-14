import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { levelData } from '../../data/hsk.ts';
import {
  courseLesson,
  courseParts,
  courseWords,
  isExerciseReady,
} from '../../data/courseLessons.ts';
import { EXERCISES } from '../../domain/exercises.ts';
import type { ExerciseId } from '../../domain/exercises.ts';
import { courseLessonKey, lessonResults } from '../progress/progress.ts';
import { useProgress } from '../progress/useProgress.ts';
import LessonExerciseCards from './LessonExerciseCards.tsx';
import { t } from '../../shared/i18n/en.ts';
import { courseExerciseArt } from './courseExerciseArt.ts';
import {
  courseExercisePath,
  courseQuizPath,
  courseRunPath,
  courseWritePath,
  levelLessonsPath,
} from './lessonNav.ts';
import bookIcon from './icons/book.svg';
import chevronIcon from './icons/chevron.svg';
import lockIcon from './icons/lock.svg';
import volumeIcon from './icons/volume.svg';
import './courseLesson.css';

function CourseCardArt({ src }: { src: string | undefined }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="course-lesson-art" aria-hidden="true">
      {src && !failed && (
        <img src={src} alt="" onError={() => setFailed(true)} />
      )}
    </span>
  );
}

export default function CourseLessonPage() {
  const params = useParams();
  const level = levelData(params.level);
  const lesson = courseLesson(params.lesson);
  const { progress } = useProgress();
  const navigate = useNavigate();
  if (!level) return <Navigate to="/" replace />;
  if (!lesson) return <Navigate to={levelLessonsPath(level.id)} replace />;

  // Practice in short parts, each with the exercises of a topic lesson. A part keeps its
  // number (it is in the links and progress keys) even if an empty part before it is skipped.
  const parts = courseParts(lesson)
    .map((p, i) => ({ part: i + 1, chars: p.map((c) => c.c) }))
    .filter(({ chars }) => chars.length > 0);

  // Each part's copybook has its own link; it opens at the first character not
  // written yet.
  const write = (chars: string[], part: number) => {
    const first = chars.find((c) => !progress.chars[c]) ?? chars[0];
    void navigate(courseWritePath(level.id, lesson.id, part), {
      state: first ? { start: first } : null,
    });
  };

  const levelTitle = t.levelTitle(level.id);
  const total = lesson.exercises.length;
  const available = lesson.exercises.filter((exercise) =>
    isExerciseReady(lesson, exercise),
  ).length;

  return (
    <main className="course-lesson">
      <header className="course-lesson-header">
        <Link className="course-lesson-back" to={levelLessonsPath(level.id)}>
          <img src={chevronIcon} alt="" />
          {levelTitle}
        </Link>
        <div className="course-lesson-hero">
          <h1>{t.lessonN(lesson.id)}</h1>
          {parts.length > 0 && (
            <a className="course-lesson-jump" href="#course-practice">
              {t.exercisesLabel}
              <img src={chevronIcon} alt="" />
            </a>
          )}
        </div>
      </header>

      {available > 0 && (
        <div className="course-lesson-start">
          <Link
            className="course-lesson-start-button"
            to={courseRunPath(level.id, lesson.id, 1)}
          >
            {t.startLesson}
          </Link>
        </div>
      )}

      <section aria-labelledby="course-exercises-title">
        <div className="course-lesson-section-heading">
          <h2
            className="course-lesson-section-title"
            id="course-exercises-title"
          >
            {t.studyLabel}
          </h2>
          <span>{t.courseExercisesAvailable(available, total)}</span>
        </div>
        <ol className="course-lesson-exercises" role="list">
          {lesson.exercises.map((exercise) => {
            const ready = isExerciseReady(lesson, exercise);
            const art = courseExerciseArt[lesson.id]?.[exercise];
            const cardClass = ready
              ? 'course-lesson-card is-ready'
              : 'course-lesson-card';
            const content = (
              <>
                <CourseCardArt key={art} src={art} />
                <span className="course-lesson-tile" aria-hidden="true">
                  <img
                    src={exercise === 'words' ? bookIcon : volumeIcon}
                    alt=""
                  />
                </span>
                <span className="course-lesson-copy">
                  <span className="course-lesson-card-title">
                    {t.courseExercises(exercise)}
                  </span>
                  <span className="course-lesson-description">
                    {lesson.descriptions?.[exercise] ??
                      t.courseExerciseDescriptions[exercise]}
                  </span>
                </span>
              </>
            );

            return (
              <li key={exercise} data-exercise={exercise}>
                {ready ? (
                  <Link
                    className={cardClass}
                    to={courseExercisePath(level.id, lesson.id, exercise)}
                  >
                    {content}
                    <span className="course-lesson-arrow" aria-hidden="true">
                      <img src={chevronIcon} alt="" />
                    </span>
                  </Link>
                ) : (
                  <div className={cardClass} aria-disabled="true">
                    {content}
                    <span className="course-lesson-soon">
                      <img src={lockIcon} alt="" />
                      {t.soon}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {parts.length > 0 && (
        <div id="course-practice" tabIndex={-1}>
          {parts.map(({ part, chars }) => {
            const practice = EXERCISES.filter(
              (ex) => ex !== 'words' || courseWords(lesson, part).length > 0,
            );
            return (
              <LessonExerciseCards
                key={part}
                title={
                  <>
                    {parts.length > 1 ? t.partN(part) : t.exercisesLabel}
                    <span className="course-part-chars" lang="zh">
                      {chars.join('')}
                    </span>
                  </>
                }
                exercises={practice}
                results={lessonResults(
                  progress,
                  courseLessonKey(level.id, lesson.id, part),
                  chars,
                )}
                written={chars.filter((c) => progress.chars[c]).length}
                totalChars={chars.length}
                onOpen={(ex: ExerciseId) =>
                  ex === 'write'
                    ? write(chars, part)
                    : void navigate(
                        courseQuizPath(level.id, lesson.id, part, ex),
                      )
                }
              />
            );
          })}
        </div>
      )}
    </main>
  );
}
