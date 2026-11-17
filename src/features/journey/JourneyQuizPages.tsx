import { Navigate } from 'react-router';
import { coursePart } from '../../data/courseLessons.ts';
import type { Grade } from '../../domain/grading.ts';
import { t } from '../../shared/i18n/en.ts';
import QuizPage from '../lesson/QuizPage.tsx';
import { journeyPath } from '../lesson/lessonNav.ts';
import { useCourseParams, useLevelParam } from '../lesson/lessonRoute.ts';
import { PASS_GRADE, XP, journeyKey } from '../progress/progress.ts';
import { getProgress } from '../progress/progressStore.ts';
import { useProgress } from '../progress/useProgress.ts';
import { REVIEW_MAX, reviewItems, reviewKey } from './journey.ts';
import { checkpointQuiz, practiceQuiz, reviewQuiz } from './journeyQuiz.ts';
import './journey.css';

// XP of a finished round: one per right answer, plus the bonus for passing.
const roundXp = (right: number, grade: Grade) =>
  right * XP.answer + (grade >= PASS_GRADE ? XP.step : 0);

const xpNote = (right: number, _total: number, grade: Grade) =>
  t.journey.xpGained(roundXp(right, grade));

// '/hsk/<level>/journey/practice/<lesson>/<part>': a mixed round over one part.
export function JourneyPracticePage() {
  const { level, lesson, part } = useCourseParams();
  const { recordStep } = useProgress();
  if (!level) return <Navigate to="/" replace />;
  const back = journeyPath(level.id);
  if (!lesson || !coursePart(lesson, part)?.length)
    return <Navigate to={back} replace />;
  return (
    <QuizPage
      key={`${level.id}:${lesson.id}:${part}`}
      session={journeyKey(level.id, lesson.id, 'practice', part)}
      title={t.journey.practiceTitle(lesson.id, part)}
      back={back}
      exitLabel={t.journey.toMap}
      build={() => practiceQuiz(level, lesson, part)}
      onFinish={(grade) =>
        recordStep(journeyKey(level.id, lesson.id, 'practice', part), grade)
      }
      resultNote={xpNote}
    />
  );
}

// '/hsk/<level>/journey/checkpoint/<lesson>': the whole lesson; two stars seal it.
export function JourneyCheckpointPage() {
  const { level, lesson } = useCourseParams();
  const { recordStep } = useProgress();
  if (!level) return <Navigate to="/" replace />;
  const back = journeyPath(level.id);
  if (!lesson) return <Navigate to={back} replace />;
  return (
    <QuizPage
      key={`${level.id}:${lesson.id}`}
      session={journeyKey(level.id, lesson.id, 'checkpoint')}
      className="journey-checkpoint"
      title={t.journey.checkpointTitle(lesson.id)}
      back={back}
      exitLabel={t.journey.toMap}
      build={() => checkpointQuiz(level, lesson)}
      onFinish={(grade) =>
        recordStep(journeyKey(level.id, lesson.id, 'checkpoint'), grade)
      }
      resultNote={(right, total, grade) => (
        <>
          <span
            className={'journey-seal' + (grade >= PASS_GRADE ? ' sealed' : '')}
          >
            {grade >= PASS_GRADE ? t.journey.sealed : t.journey.notSealed}
          </span>{' '}
          {xpNote(right, total, grade)}
        </>
      )}
    />
  );
}

// '/hsk/<level>/journey/review': the characters and words due, longest overdue first.
export function JourneyReviewPage() {
  const level = useLevelParam();
  if (!level) return <Navigate to="/" replace />;
  return (
    <QuizPage
      key={level.id}
      session={reviewKey(level.id)}
      title={t.journey.reviewTitle}
      back={journeyPath(level.id)}
      exitLabel={t.journey.toMap}
      // Items due now (read at build time, so "again" takes the ones still due).
      build={() =>
        reviewQuiz(
          level,
          reviewItems(getProgress(), Date.now()).slice(0, REVIEW_MAX),
        )
      }
      onFinish={() => {}}
      resultNote={(right) => t.journey.xpGained(right * XP.answer)}
    />
  );
}
