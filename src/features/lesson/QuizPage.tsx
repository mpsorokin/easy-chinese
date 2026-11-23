import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import type { Question } from '@/domain/exercises.ts';
import type { Grade } from '@/domain/grading.ts';
import { t } from '@/shared/i18n/en.ts';
import ThemeControl from '@/features/settings/ThemeControl.tsx';
import { useProgress } from '@/features/progress/useProgress.ts';
import {
  clearQuiz,
  loadQuiz,
  saveQuiz,
} from '@/features/progress/sessionStore.ts';
import type { QuizAnswer } from '@/features/progress/sessionStore.ts';
import QuizRunner from '@/features/lesson/QuizRunner.tsx';

// The page around a quiz: close link, title and the runner. Pages that use it must give it
// a `key` that changes with the exercise, so new route params build new questions.
// Every answer feeds the review boxes and today's XP. With a `session` key the round is
// saved after each answer, and opening the page again resumes it where it was left.
export default function QuizPage({
  session,
  title,
  back,
  build,
  onFinish,
  exitLabel,
  resultNote,
  className,
}: {
  session?: string;
  title: ReactNode;
  back: string;
  build: () => Question[];
  onFinish: (grade: Grade) => void;
  exitLabel?: string;
  resultNote?: (right: number, total: number, grade: Grade) => ReactNode;
  className?: string;
}) {
  const navigate = useNavigate();
  const { answer } = useProgress();
  // A new round (same exercise, new shuffle) on "again".
  const [round, setRound] = useState(0);
  const [start] = useState(() => {
    const saved = session ? loadQuiz(session) : undefined;
    return saved ?? { questions: build(), answers: [] as QuizAnswer[] };
  });
  const [questions, setQuestions] = useState<Question[]>(start.questions);
  const [initialAnswers, setInitialAnswers] = useState(start.answers);

  if (questions.length === 0) return <Navigate to={back} replace />;

  return (
    <main
      className={
        'app page-frame quiz-page' + (className ? ` ${className}` : '')
      }
    >
      <header className="quiz-head">
        <Link
          className="quiz-close"
          to={back}
          aria-label={exitLabel ?? t.quizToLesson}
        >
          {t.quizExit}
        </Link>
        <h1>{title}</h1>
        <ThemeControl />
      </header>
      <QuizRunner
        key={round}
        questions={questions}
        initialAnswers={initialAnswers}
        onProgress={(answers) => {
          if (session) saveQuiz(session, questions, answers);
        }}
        onFinish={onFinish}
        onAnswer={(q, right) => answer(q.item, right)}
        exitLabel={exitLabel}
        resultNote={resultNote}
        onAgain={() => {
          if (session) clearQuiz(session);
          setInitialAnswers([]);
          setQuestions(build());
          setRound((r) => r + 1);
        }}
        onExit={() => void navigate(back)}
      />
    </main>
  );
}
