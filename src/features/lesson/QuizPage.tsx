import { useState } from 'react';
import type { ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import type { Question } from '../../domain/exercises.ts';
import type { Grade } from '../../domain/grading.ts';
import { t } from '../../shared/i18n/en.ts';
import QuizRunner from './QuizRunner.tsx';

// The page around a quiz: close link, title and the runner. Pages that use it must give it
// a `key` that changes with the exercise, so new route params build new questions.
export default function QuizPage({
  title,
  back,
  build,
  onFinish,
}: {
  title: ReactNode;
  back: string;
  build: () => Question[];
  onFinish: (grade: Grade) => void;
}) {
  const navigate = useNavigate();
  // A new round (same exercise, new shuffle) on "again".
  const [round, setRound] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(build);

  if (questions.length === 0) return <Navigate to={back} replace />;

  return (
    <main className="app quiz-page">
      <header className="quiz-head">
        <Link className="quiz-close" to={back} aria-label={t.quizToLesson}>
          {t.quizExit}
        </Link>
        <h1>{title}</h1>
      </header>
      <QuizRunner
        key={round}
        questions={questions}
        onFinish={onFinish}
        onAgain={() => {
          setQuestions(build());
          setRound((r) => r + 1);
        }}
        onExit={() => void navigate(back)}
      />
    </main>
  );
}
