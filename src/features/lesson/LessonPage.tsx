import { useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { lessonStore } from '@/features/lesson/lessonStore.ts';
import { lessonChars, lessonWords } from '@/data/hsk.ts';
import { availableExercises } from '@/domain/exercises/index.ts';
import type { ExerciseId } from '@/domain/exercises/index.ts';
import {
  lessonKey,
  lessonResults,
  PASS_GRADE,
} from '@/features/progress/progress.ts';
import { useProgress } from '@/features/progress/useProgress.ts';
import { t } from '@/shared/i18n/en.ts';
import PageToolbar from '@/features/settings/PageToolbar.tsx';
import WriteIcon from '@/shared/ui/WriteIcon.tsx';
import Meter from '@/shared/ui/Meter.tsx';
import LessonExerciseCards from '@/features/lesson/LessonExerciseCards.tsx';
import {
  useOpenCopybook,
  useTopicParams,
} from '@/features/lesson/lessonRoute.ts';
import {
  exercisePath,
  lessonPath,
  levelPath,
  topicWritePath,
} from '@/shared/paths.ts';
import '@/shared/ui/page.css';
import '@/features/lesson/lesson.css';

// One lesson: its characters and words, and the four exercises with their best results.
export default function LessonPage() {
  const { level, idx, lesson } = useTopicParams();
  const { progress, best } = useProgress();
  const navigate = useNavigate();
  const openCopybook = useOpenCopybook();

  const key = level && lesson ? lessonKey(level.id, lesson.id) : '';
  useEffect(() => {
    if (key) lessonStore.set('lastLesson', key);
  }, [key]);

  if (!level) return <Navigate to="/" replace />;
  if (!lesson) return <Navigate to={levelPath(level.id)} replace />;

  const chars = lessonChars(level, idx);
  const words = lessonWords(level, idx);
  const results = lessonResults(progress, key, lesson.chars);
  const exercises = availableExercises({
    hasWords: words.length > 0,
    hasMultiWords: words.some((w) => [...w.w].length > 1),
  });
  const passed = exercises.filter(
    (ex) => (results[ex]?.best ?? 0) >= PASS_GRADE,
  ).length;
  const written = lesson.chars.filter((c) => progress.chars[c]).length;
  const prev = level.lessons[idx - 1];
  const next = level.lessons[idx + 1];

  // The topic's copybook has its own link; it starts at the first character not written yet.
  const open = (ex: ExerciseId) =>
    ex === 'write'
      ? openCopybook(topicWritePath(level.id, lesson.id), lesson.chars)
      : void navigate(exercisePath(level.id, lesson.id, ex));

  return (
    <main className="app page-frame lesson-page">
      <header className="lesson-head">
        <PageToolbar
          back={{
            to: levelPath(level.id),
            icon: 'chevron',
            className: 'hsk-back lesson-back',
            children: t.levelTitle(level.id),
          }}
        />
        <p className="lesson-kicker">{t.lessonN(lesson.id)}</p>
        <h1>{lesson.title}</h1>
        <div className="lesson-overview">
          <span className="lesson-counts">
            <WriteIcon name="book" className="lesson-icon" />
            {t.levelMeta(chars.length, words.length)}
          </span>
          <div className="lesson-summary-progress">
            <span>{t.lessonProgressLabel}</span>
            <Meter value={passed} max={exercises.length} />
            <span>{t.exercisesDone(passed, exercises.length)}</span>
          </div>
        </div>
      </header>

      <section className="lesson-section">
        <h2>{t.lessonChars(chars.length)}</h2>
        <div className="lesson-grid">
          {chars.map((e) => (
            <div key={e.c} className="lesson-card">
              <span className="lesson-c" lang="zh-Hans">
                {e.c}
              </span>
              <span className="lesson-py" lang="zh-Latn">
                {e.py}
              </span>
              <span className="lesson-en">{e.en}</span>
              {best[e.c] ? (
                <span className="lesson-stars">{'★'.repeat(best[e.c]!)}</span>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <section className="lesson-section lesson-vocabulary">
        <h2>{t.lessonWords(words.length)}</h2>
        {words.length ? (
          <ul className="lesson-words">
            {words.map((w) => (
              <li key={w.w}>
                <span className="lesson-word" lang="zh-Hans">
                  {w.w}
                </span>
                <span className="lesson-py" lang="zh-Latn">
                  {w.py}
                </span>
                <span className="lesson-en">{w.en}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="lesson-empty">{t.noWords}</p>
        )}
      </section>

      <LessonExerciseCards
        exercises={exercises}
        results={results}
        written={written}
        totalChars={lesson.chars.length}
        onOpen={open}
      />

      <nav className="lesson-nav">
        {prev ? (
          <Link className="btn" to={lessonPath(level.id, prev.id)}>
            <WriteIcon name="chevron" className="lesson-icon previous" />
            {t.prev}
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link className="btn lesson-next" to={lessonPath(level.id, next.id)}>
            {t.next}
            <WriteIcon name="chevron" className="lesson-icon" />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </main>
  );
}
