import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import type { Question } from '@/domain/exercises/index.ts';
import { quizGrade } from '@/domain/grading.ts';
import type { Grade } from '@/domain/grading.ts';
import Meter from '@/shared/ui/Meter.tsx';
import { stars, t } from '@/shared/i18n/en.ts';
import type { QuizAnswer } from '@/features/progress/sessionStore.ts';
import ChoiceQuestion from '@/features/lesson/quiz/ChoiceQuestion.tsx';
import BuildQuestion from '@/features/lesson/quiz/BuildQuestion.tsx';
import WriteWordQuestion from '@/features/lesson/quiz/WriteWordQuestion.tsx';
import '@/features/lesson/quiz/quiz.css';

// By default a right answer moves on after this delay.
const AUTO_NEXT_MS = 700;

type Answer = QuizAnswer;

// Runs a list of questions one by one, then shows the score.
// onAnswer is called for every answer; onFinish once, when the last question is answered.
// `resultNote` adds a line to the result screen (e.g. the XP earned). A saved round resumes
// from `initialAnswers`; `onProgress` gets all answers so far after each one.
export default function QuizRunner({
  questions,
  initialAnswers = [],
  onProgress,
  onFinish,
  onAnswer,
  onAgain,
  onExit,
  exitLabel = t.quizToLesson,
  resultNote,
  manualNext = false,
}: {
  questions: Question[];
  initialAnswers?: Answer[];
  onProgress?: (answers: Answer[]) => void;
  onFinish?: (grade: Grade) => void;
  onAnswer?: (q: Question, right: boolean) => void;
  onAgain: () => void;
  onExit: () => void;
  exitLabel?: string;
  resultNote?: (right: number, total: number, grade: Grade) => ReactNode;
  manualNext?: boolean;
}) {
  const [i, setI] = useState(initialAnswers.length);
  const [answers, setAnswers] = useState<Answer[]>(initialAnswers);
  const q = questions[i];
  const answered = answers.length > i;
  const current = answers[i];

  const answer = (right: boolean) => {
    if (!q || answered) return;
    const next = [...answers, { right, reveal: q.reveal }];
    setAnswers(next);
    onAnswer?.(q, right);
    onProgress?.(next);
    if (next.length === questions.length)
      onFinish?.(quizGrade(next.filter((a) => a.right).length, next.length));
  };
  const goNext = () => setI((n) => n + 1);

  useEffect(() => {
    if (manualNext || !current?.right) return;
    const id = setTimeout(() => setI((n) => n + 1), AUTO_NEXT_MS);
    return () => clearTimeout(id);
  }, [current, manualNext]);

  if (!q) {
    const right = answers.filter((a) => a.right).length;
    const grade = quizGrade(right, Math.max(1, answers.length));
    const mistakes = answers.filter((a) => !a.right);
    return (
      <div className="quiz-result">
        <div className="quiz-result-stars">{stars(grade)}</div>
        <h2>{t.quizDone(grade)}</h2>
        <p>{t.quizScore(right, answers.length)}</p>
        {resultNote && (
          <p className="quiz-result-note">
            {resultNote(right, answers.length, grade)}
          </p>
        )}
        {mistakes.length > 0 && (
          <div className="quiz-mistakes">
            <h3 className="label">{t.quizMistakes}</h3>
            <ul>
              {mistakes.map((a, k) => (
                <li key={k}>{a.reveal}</li>
              ))}
            </ul>
          </div>
        )}
        <div className="quiz-result-actions">
          <button className="btn" onClick={onAgain}>
            {t.again}
          </button>
          <button className="btn primary" onClick={onExit}>
            {exitLabel}
          </button>
        </div>
      </div>
    );
  }

  const listening =
    q.kind === 'choice' && q.mode === 'listenOnly' ? q : undefined;

  return (
    <div className="quiz">
      <div className="quiz-top">
        <Meter value={i + 1} max={questions.length} />
        <span>{t.stepOfTotal(i + 1, questions.length)}</span>
      </div>

      {q.kind === 'choice' ? (
        <ChoiceQuestion key={i} q={q} onAnswer={answer} />
      ) : q.kind === 'build' ? (
        <BuildQuestion key={i} q={q} onAnswer={answer} />
      ) : (
        <WriteWordQuestion key={i} q={q} onAnswer={answer} />
      )}

      <div
        className={
          'quiz-feedback' + (current ? (current.right ? ' ok' : ' err') : '')
        }
        role="status"
      >
        {current && (
          <>
            <b>{current.right ? t.quizRight : t.quizWrong}</b>
            {listening ? (
              <span className="quiz-listening-reveal">
                <strong lang="zh-Hans">{listening.prompt}</strong>
                {listening.hint && (
                  <span lang="zh-Latn-pinyin">{listening.hint}</span>
                )}
                <span lang="en">{listening.options[listening.answer]}</span>
              </span>
            ) : (
              <span>{current.reveal}</span>
            )}
          </>
        )}
      </div>

      {current && (manualNext || !current.right) && (
        <button className="btn primary" onClick={goNext}>
          {t.nextArrow}
        </button>
      )}
    </div>
  );
}
