import { useState } from 'react';
import type { BuildQuestion as Question } from '@/domain/exercises/index.ts';
import { t } from '@/shared/i18n/en.ts';
import Prompt from '@/features/lesson/quiz/Prompt.tsx';
import { useAutoplay } from '@/features/lesson/quiz/useAutoplay.ts';

const BUILD_LABEL = {
  build: t.quizBuild,
  listen: t.quizListenBuild,
  reading: t.quizReading,
  gap: t.quizGap,
  sentence: t.quizSentence,
} as const;

const fills = (q: Question, picked: readonly number[]) =>
  q.blanks.every((cell, j) => q.tiles[picked[j] ?? -1] === q.cells[cell]);

export default function BuildQuestion({
  q,
  onAnswer,
}: {
  q: Question;
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
