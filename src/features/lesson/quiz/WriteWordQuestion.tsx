import { useEffect, useRef, useState } from 'react';
import { WORD_PASSES } from '@/domain/exercises/index.ts';
import type { WriteQuestion } from '@/domain/exercises/index.ts';
import { gradeFor } from '@/domain/grading.ts';
import { t } from '@/shared/i18n/en.ts';
import { vibrate } from '@/shared/lib/haptics.ts';
import { usePersistentState } from '@/shared/hooks/usePersistentState.ts';
import { useCharData } from '@/data/useCharData.ts';
import WritingCell from '@/features/writer/WritingCell.tsx';
import type { AttemptComplete, WriterHandle } from '@/features/writer/types.ts';
import { copybookStore } from '@/features/copybook/copybookStore.ts';
import { normalizeSettings } from '@/features/settings/settings.ts';
import Prompt from '@/features/lesson/quiz/Prompt.tsx';

// Pause after a character is written, so the finished glyph is seen before the next one.
const NEXT_CHAR_MS = 650;

// "Write the word": every character of the word in turn, WORD_PASSES times, with the
// outline fading each pass. Right when the whole run grades at least two stars.
export default function WriteWordQuestion({
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
