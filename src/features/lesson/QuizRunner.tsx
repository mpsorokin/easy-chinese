import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { WORD_PASSES } from '../../domain/exercises.ts';
import type {
  Audio,
  BuildQuestion,
  ChoiceQuestion,
  Question,
  WriteQuestion,
} from '../../domain/exercises.ts';
import { gradeFor, quizGrade } from '../../domain/grading.ts';
import type { Grade } from '../../domain/grading.ts';
import Meter from '../../shared/ui/Meter.tsx';
import { stars, t } from '../../shared/i18n/en.ts';
import { canSpeak, speakChinese } from '../../shared/lib/speech.ts';
import { vibrate } from '../../shared/lib/haptics.ts';
import { usePersistentState } from '../../shared/hooks/usePersistentState.ts';
import { useCharData } from '../../data/useCharData.ts';
import WritingCell from '../writer/WritingCell.tsx';
import type { AttemptComplete, WriterHandle } from '../writer/types.ts';
import { copybookStore } from '../copybook/copybookStore.ts';
import { normalizeSettings } from '../settings/settings.ts';
import type { QuizAnswer } from '../progress/sessionStore.ts';
import './quiz.css';

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
            {t.quizAgain}
          </button>
          <button className="btn primary" onClick={onExit}>
            {exitLabel}
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
      ) : q.kind === 'build' ? (
        <Build key={i} q={q} onAnswer={answer} />
      ) : (
        <WriteWord key={i} q={q} onAnswer={answer} />
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

      {current && (manualNext || !current.right) && (
        <button className="btn primary" onClick={goNext}>
          {t.quizNext}
        </button>
      )}
    </div>
  );
}

const CHOICE_LABEL = {
  show: undefined,
  listen: t.quizListenChoose,
  toWord: t.quizToWord,
} as const;

function Choice({
  q,
  onAnswer,
}: {
  q: ChoiceQuestion;
  onAnswer: (right: boolean) => void;
}) {
  const [picked, setPicked] = useState<number>();
  const mode = q.mode ?? 'show';
  const pick = (k: number) => {
    if (picked !== undefined) return;
    setPicked(k);
    onAnswer(k === q.answer);
  };
  useAutoplay(mode === 'listen' ? q.audio?.text : undefined);
  return (
    <>
      <Prompt
        text={q.prompt}
        hint={q.hint}
        small={mode === 'toWord'}
        label={CHOICE_LABEL[mode]}
        audio={q.audio}
        answered={picked !== undefined}
        listen={mode === 'listen'}
      />
      <div className="quiz-options">
        {q.options.map((o, k) => (
          <button
            key={o}
            className={
              'quiz-option' +
              (q.optionLang === 'zh' ? ' quiz-option-zh' : '') +
              (picked !== undefined && k === q.answer ? ' right' : '') +
              (picked === k && k !== q.answer ? ' wrong' : '')
            }
            lang={q.optionLang === 'zh' ? 'zh-Hans' : undefined}
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

// Plays a word once when a listening question opens.
function useAutoplay(text: string | undefined) {
  useEffect(() => {
    if (text && canSpeak()) speakChinese(text);
  }, [text]);
}

const BUILD_LABEL = {
  build: t.quizBuild,
  listen: t.quizListenBuild,
  reading: t.quizReading,
  gap: t.quizGap,
  sentence: t.quizSentence,
} as const;

const fills = (q: BuildQuestion, picked: readonly number[]) =>
  q.blanks.every((cell, j) => q.tiles[picked[j] ?? -1] === q.cells[cell]);

function Build({
  q,
  onAnswer,
}: {
  q: BuildQuestion;
  onAnswer: (right: boolean) => void;
}) {
  const [picked, setPicked] = useState<number[]>([]); // tile indexes in tap order
  const size = q.blanks.length;
  const done = picked.length === size;
  const tap = (k: number) => {
    if (done || picked.includes(k)) return;
    const next = [...picked, k];
    setPicked(next);
    if (next.length === size) onAnswer(fills(q, next));
  };
  useAutoplay(q.mode === 'listen' ? q.audio?.text : undefined);
  const pinyin = q.tileLang === 'pinyin';
  const tileLang = pinyin ? 'zh-Latn-pinyin' : 'zh-Hans';
  return (
    <>
      <Prompt
        text={q.prompt}
        hint={q.hint}
        small={q.mode !== 'reading'}
        label={BUILD_LABEL[q.mode]}
        audio={q.audio}
        answered={done}
        listen={q.mode === 'listen'}
      />
      <div
        className={
          'quiz-built' +
          (pinyin ? ' quiz-built-pinyin' : '') +
          (done ? (fills(q, picked) ? ' right' : ' wrong') : '')
        }
      >
        {q.cells.map((cell, k) => {
          const blank = q.blanks.indexOf(k);
          if (blank < 0)
            return (
              <span key={k} className="given" lang="zh-Hans">
                {cell}
              </span>
            );
          return (
            <span
              key={k}
              className={blank === picked.length && !done ? 'current' : ''}
              lang={tileLang}
            >
              {q.tiles[picked[blank] ?? -1] ?? ''}
            </span>
          );
        })}
        <button
          className="quiz-undo"
          disabled={done || picked.length === 0}
          onClick={() => setPicked((p) => p.slice(0, -1))}
          aria-label={t.quizUndoLabel}
        >
          {t.quizUndo}
        </button>
      </div>
      <div className={pinyin ? 'quiz-tiles quiz-tiles-pinyin' : 'quiz-tiles'}>
        {q.tiles.map((c, k) => (
          <button
            key={k}
            className="quiz-tile"
            disabled={done || picked.includes(k)}
            onClick={() => tap(k)}
            lang={tileLang}
          >
            {c}
          </button>
        ))}
      </div>
    </>
  );
}

// Pause after a character is written, so the finished glyph is seen before the next one.
const NEXT_CHAR_MS = 650;

// "Write the word": every character of the word in turn, WORD_PASSES times, with the
// outline fading each pass. Right when the whole run grades at least two stars.
function WriteWord({
  q,
  onAnswer,
}: {
  q: WriteQuestion;
  onAnswer: (right: boolean) => void;
}) {
  const chars = [...q.answer];
  const [pass, setPass] = useState(0);
  const [k, setK] = useState(0);
  const [waiting, setWaiting] = useState(false);
  const [done, setDone] = useState(false);
  const [animating, setAnimating] = useState(false);
  const [replay, setReplay] = useState(0);
  const tally = useRef({ mistakes: 0, strokes: 0 });
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const writerRef = useRef<WriterHandle>(null);
  const [settings] = usePersistentState(
    copybookStore,
    'settings',
    normalizeSettings,
  );
  const char = chars[k] ?? '';
  const { data } = useCharData(char);
  const passes = WORD_PASSES.length;

  useEffect(() => () => clearTimeout(timer.current), []);

  const onComplete = ({ totalMistakes }: AttemptComplete) => {
    const sum = tally.current;
    sum.mistakes += totalMistakes;
    sum.strokes += data?.strokes.length ?? 1;
    vibrate(15);
    setWaiting(true);
    timer.current = setTimeout(() => {
      setWaiting(false);
      if (k + 1 < chars.length) setK(k + 1);
      else if (pass + 1 < passes) {
        setPass(pass + 1);
        setK(0);
      } else {
        setDone(true);
        onAnswer(gradeFor(sum.mistakes, sum.strokes) >= 2);
      }
    }, NEXT_CHAR_MS);
  };

  const show = () => {
    if (done || waiting || animating) return;
    setAnimating(true);
    writerRef.current?.animate(() => {
      setAnimating(false);
      setReplay((r) => r + 1);
    });
  };

  return (
    <>
      <Prompt
        text={q.prompt}
        hint={q.hint}
        small
        label={t.quizWriteWord}
        audio={q.audio}
        answered={done}
      />
      <div className="quiz-write-status">
        <div className={'quiz-built' + (done ? ' right' : '')}>
          {chars.map((c, j) => (
            <span
              key={j}
              lang="zh-Hans"
              className={j === k && !done && !waiting ? 'current' : ''}
            >
              {done || j < k || (j === k && waiting) ? c : ''}
            </span>
          ))}
        </div>
        <span className="quiz-passes">
          {WORD_PASSES.map((_, j) => (
            <i
              key={j}
              className={j < pass || done ? 'done' : j === pass ? 'now' : ''}
            />
          ))}
          <span>{t.quizPass(pass + 1, passes)}</span>
        </span>
      </div>
      <div className="quiz-write">
        <WritingCell
          ref={writerRef}
          char={char}
          gridKind={settings.grid}
          outline={WORD_PASSES[pass] ?? 0}
          active={!done && !animating}
          quizKey={`${pass}-${k}-${replay}`}
          strict={settings.strict}
          hint={settings.hint}
          speed={settings.speed}
          onComplete={onComplete}
        />
        <button
          type="button"
          className="btn quiz-write-show"
          onClick={show}
          disabled={done || waiting || animating}
        >
          {t.show}
        </button>
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
  listen,
}: {
  text: string;
  hint?: string;
  small?: boolean;
  label?: string;
  audio?: Audio;
  answered: boolean;
  listen?: boolean; // only the sound until answered
}) {
  const playable =
    audio && canSpeak() && (!audio.afterAnswer || answered) ? audio : null;
  // Without speech the listening question falls back to showing the prompt.
  const hidden = listen && !answered && canSpeak();
  return (
    <div
      className={
        (small ? 'quiz-prompt quiz-prompt-build' : 'quiz-prompt') +
        (hidden ? ' quiz-prompt-listen' : '')
      }
    >
      {playable && (
        <button
          type="button"
          className={hidden ? 'quiz-speak quiz-speak-big' : 'quiz-speak'}
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
      {!hidden && (
        <>
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
        </>
      )}
    </div>
  );
}
