import { Link, Navigate, useNavigate } from 'react-router';
import {
  courseParts,
  courseWords,
  isExerciseReady,
  storySteps,
} from '@/data/courseLessons.ts';
import { readingStories } from '@/data/readingStories.ts';
import { availableExercises } from '@/domain/exercises.ts';
import type { ExerciseId } from '@/domain/exercises.ts';
import {
  courseLessonKey,
  journeyKey,
  lessonResults,
} from '@/features/progress/progress.ts';
import { loadSessions } from '@/features/progress/sessionStore.ts';
import { useProgress } from '@/features/progress/useProgress.ts';
import {
  COURSE_LEVEL,
  courseExercisePath,
  courseQuizPath,
  courseRunPath,
  courseWritePath,
  levelLessonsPath,
  readingStoryPath,
} from '@/shared/paths.ts';
import PageToolbar from '@/features/settings/PageToolbar.tsx';
import WriteIcon from '@/shared/ui/WriteIcon.tsx';
import CourseCardArt from '@/features/lesson/CourseCardArt.tsx';
import LessonExerciseCards from '@/features/lesson/LessonExerciseCards.tsx';
import {
  useCourseParams,
  useOpenCopybook,
} from '@/features/lesson/lessonRoute.ts';
import { t } from '@/shared/i18n/en.ts';
import {
  courseExerciseArt,
  coursePracticeArt,
} from '@/features/lesson/courseExerciseArt.ts';
import '@/features/lesson/courseLesson.css';

export default function CourseLessonPage() {
  const { level, lesson } = useCourseParams();
  const { progress } = useProgress();
  const navigate = useNavigate();
  const openCopybook = useOpenCopybook();
  if (!level) return <Navigate to="/" replace />;
  if (!lesson) return <Navigate to={levelLessonsPath(level.id)} replace />;

  // Practice in short parts, each with the exercises of a topic lesson. A part keeps its
  // number (it is in the links and progress keys) even if an empty part before it is skipped.
  const parts = courseParts(lesson)
    .map((p, i) => ({ part: i + 1, chars: p.map((c) => c.c) }))
    .filter(({ chars }) => chars.length > 0);

  const levelTitle = t.levelTitle(level.id);
  const total = lesson.exercises.length;
  const available = lesson.exercises.filter((exercise) =>
    isExerciseReady(lesson, exercise),
  ).length;
  // The dialogues left mid-way (here or on the journey map) resume at the step reached.
  // A saved step past the end (the dialogues changed since) starts over.
  const stored = loadSessions().story[journeyKey(level.id, lesson.id, 'story')];
  const steps = storySteps(lesson).length;
  const saved = stored && stored.step <= steps ? stored : undefined;
  const stories =
    level.id === COURSE_LEVEL
      ? readingStories.filter(
          ({ lessons }) =>
            lessons && lesson.id >= lessons[0] && lesson.id <= lessons[1],
        )
      : [];

  return (
    <main className="page-frame course-lesson">
      <header className="course-lesson-header">
        <PageToolbar
          back={{
            to: levelLessonsPath(level.id),
            icon: 'chevron',
            className: 'course-lesson-back',
            children: levelTitle,
          }}
        />
        <div className="course-lesson-hero">
          <h1>{t.lessonN(lesson.id)}</h1>
          {parts.length > 0 && (
            <a className="course-lesson-jump" href="#course-practice">
              {t.exercisesLabel}
              <WriteIcon name="chevron" />
            </a>
          )}
        </div>
      </header>

      {available > 0 && (
        <div className="course-lesson-start">
          <Link
            className="course-lesson-start-button"
            to={courseRunPath(level.id, lesson.id, saved?.step ?? 1)}
          >
            {saved ? t.continueLesson(saved.step, steps) : t.startLesson}
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
            const art = courseExerciseArt(lesson.id, exercise);
            const cardClass = ready
              ? 'course-lesson-card is-ready'
              : 'course-lesson-card';
            const content = (
              <>
                <CourseCardArt key={art} src={art} />
                <span className="course-lesson-tile" aria-hidden="true">
                  <WriteIcon name={exercise === 'words' ? 'book' : 'volume'} />
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
                      <WriteIcon name="chevron" />
                    </span>
                  </Link>
                ) : (
                  <div className={cardClass} aria-disabled="true">
                    {content}
                    <span className="course-lesson-soon">
                      <WriteIcon name="lock" />
                      {t.soon}
                    </span>
                  </div>
                )}
              </li>
            );
          })}
        </ol>
      </section>

      {stories.length > 0 && (
        <section aria-labelledby="course-reading-title">
          <div className="course-lesson-section-heading">
            <h2
              className="course-lesson-section-title"
              id="course-reading-title"
            >
              {t.reading} <span lang="zh-Hans">阅读</span>
            </h2>
          </div>
          <ul className="course-lesson-exercises" role="list">
            {stories.map((story) => (
              <li key={story.id}>
                <Link
                  className="course-lesson-card is-ready"
                  to={readingStoryPath(story.id)}
                >
                  <span className="course-lesson-tile" aria-hidden="true">
                    <WriteIcon name="book" />
                  </span>
                  <span className="course-lesson-copy">
                    <span className="course-lesson-card-title" lang="zh-Hans">
                      {story.titleZh}
                    </span>
                    <span className="course-lesson-description">
                      {story.titleEn}
                    </span>
                  </span>
                  <span className="course-lesson-arrow" aria-hidden="true">
                    <WriteIcon name="chevron" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {parts.length > 0 && (
        <div id="course-practice" tabIndex={-1}>
          {parts.map(({ part, chars }) => {
            // A part's words are all multi-character (see courseWords).
            const hasWords = courseWords(lesson, part).length > 0;
            const practice = availableExercises({
              hasWords,
              hasMultiWords: hasWords,
            });
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
                art={coursePracticeArt}
                results={lessonResults(
                  progress,
                  courseLessonKey(level.id, lesson.id, part),
                  chars,
                )}
                written={chars.filter((c) => progress.chars[c]).length}
                totalChars={chars.length}
                onOpen={(ex: ExerciseId) =>
                  // Each part's copybook has its own link; it opens at the
                  // first character not written yet.
                  ex === 'write'
                    ? openCopybook(
                        courseWritePath(level.id, lesson.id, part),
                        chars,
                      )
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
