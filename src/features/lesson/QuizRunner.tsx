import { useEffect, useState } from 'react';
import type {
  Audio,
  BuildQuestion,
  ChoiceQuestion,
  Question,
} from '../../domain/exercises.ts';
import { quizGrade } from '../../domain/grading.ts';
import type { Grade } from '../../domain/grading.ts';
import Meter from '../../shared/ui/Meter.tsx';
import { stars, t } from '../../shared/i18n/en.ts';
import { canSpeak, speakChinese } from '../../shared/lib/speech.ts';
import './quiz.css';

// A right answer moves on by itself after this delay; a wrong one waits for "Next".
const AUTO_NEXT_MS = 700;

type Answer = { right: boolean; reveal: string };

// Runs a list of questions one by one, then shows the score.
// onFinish is called once, when the last question is answered.
export default function QuizRunner({
  questions,
  onFinish,
  onAgain,
  onExit,
}: {
  questions: Question[];
  onFinish: (grade: Grade) => void;
  onAgain: () => void;
  onExit: () => void;
}) {
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const q = questions[i];
  const answered = answers.length > i;
  const current = answers[i];

  const answer = (right: boolean) => {
    if (!q || answered) return;
    const next = [...answers, { right, reveal: q.reveal }];
    setAnswers(next);
    if (next.length === questions.length)
      onFinish(quizGrade(next.filter((a) => a.right).length, next.length));
  };
  const goNext = () => setI((n) => n + 1);

  useEffect(() => {
    if (!current?.right) return;
    const id = setTimeout(() => setI((n) => n + 1), AUTO_NEXT_MS);
    return () => clearTimeout(id);
  }, [current]);

  if (!q) {
    const right = answers.filter((a) => a.right).length;
    const grade = quizGrade(right, Math.max(1, answers.length));
    const mistakes = answers.filter((a) => !a.right);
    return (
      <div className="quiz-result">
        <div className="quiz-result-stars">{stars(grade)}</div>
        <h2>{t.quizDone(grade)}</h2>
        <p>{t.quizScore(right, answers.length)}</p>
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
            {t.quizAgain}
          </button>
          <button className="btn primary" onClick={onExit}>
            {t.quizToLesson}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz">
      <div className="quiz-top">
        <Meter value={i + 1} max={questions.length} />
        <span>{t.quizOf(i + 1, questions.length)}</span>
      </div>

      {q.kind === 'choice' ? (
        <Choice key={i} q={q} onAnswer={answer} />
      ) : (
        <Build key={i} q={q} onAnswer={answer} />
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
            <span>{current.reveal}</span>
          </>
        )}
      </div>

      {current && !current.right && (
        <button className="btn primary" onClick={goNext}>
          {t.quizNext}
        </button>
      )}
    </div>
  );
}

function Choice({
  q,
  onAnswer,
}: {
  q: ChoiceQuestion;
  onAnswer: (right: boolean) => void;
}) {
  const [picked, setPicked] = useState<number>();
  const pick = (k: number) => {
    if (picked !== undefined) return;
    setPicked(k);
    onAnswer(k === q.answer);
  };
  return (
    <>
      <Prompt
        text={q.prompt}
        hint={q.hint}
        audio={q.audio}
        answered={picked !== undefined}
      />
      <div className="quiz-options">
        {q.options.map((o, k) => (
          <button
            key={o}
            className={
              'quiz-option' +
              (picked !== undefined && k === q.answer ? ' right' : '') +
              (picked === k && k !== q.answer ? ' wrong' : '')
            }
            disabled={picked !== undefined}
            onClick={() => pick(k)}
          >
            {o}
          </button>
        ))}
      </div>
    </>
  );
}

function Build({
  q,
  onAnswer,
}: {
  q: BuildQuestion;
  onAnswer: (right: boolean) => void;
}) {
  const [picked, setPicked] = useState<number[]>([]); // tile indexes in tap order
  const size = [...q.answer].length;
  const done = picked.length === size;
  const built = picked.map((k) => q.tiles[k]).join('');
  const tap = (k: number) => {
    if (done || picked.includes(k)) return;
    const next = [...picked, k];
    setPicked(next);
    if (next.length === size)
      onAnswer(next.map((x) => q.tiles[x]).join('') === q.answer);
  };
  return (
    <>
      <Prompt
        text={q.prompt}
        hint={q.hint}
        small
        label={t.quizBuild}
        audio={q.audio}
        answered={done}
      />
      <div
        className={
          'quiz-built' +
          (done ? (built === q.answer ? ' right' : ' wrong') : '')
        }
      >
        {Array.from({ length: size }, (_, k) => (
          <span key={k}>{q.tiles[picked[k] ?? -1] ?? ''}</span>
        ))}
        <button
          className="quiz-undo"
          disabled={done || picked.length === 0}
          onClick={() => setPicked((p) => p.slice(0, -1))}
          aria-label={t.quizUndoLabel}
        >
          {t.quizUndo}
        </button>
      </div>
      <div className="quiz-tiles">
        {q.tiles.map((c, k) => (
          <button
            key={k}
            className="quiz-tile"
            disabled={done || picked.includes(k)}
            onClick={() => tap(k)}
          >
            {c}
          </button>
        ))}
      </div>
    </>
  );
}

function Prompt({
  text,
  hint,
  small,
  label,
  audio,
  answered,
}: {
  text: string;
  hint?: string;
  small?: boolean;
  label?: string;
  audio?: Audio;
  answered: boolean;
}) {
  const playable =
    audio && canSpeak() && (!audio.afterAnswer || answered) ? audio : null;
  return (
    <div className={small ? 'quiz-prompt quiz-prompt-build' : 'quiz-prompt'}>
      {playable && (
        <button
          type="button"
          className="quiz-speak"
          aria-label={t.quizListen}
          title={t.quizListen}
          onClick={() => speakChinese(playable.text)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
            <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
            <path
              d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
            />
          </svg>
        </button>
      )}
      {label && <span className="label">{label}</span>}
      <span
        className={
          !small && text.length > 1
            ? 'quiz-prompt-text quiz-prompt-word'
            : 'quiz-prompt-text'
        }
        lang={small ? undefined : 'zh-Hans'}
      >
        {text}
      </span>
      {hint && <span className="quiz-prompt-hint">{hint}</span>}
    </div>
  );
}
