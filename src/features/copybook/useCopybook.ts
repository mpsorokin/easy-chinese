import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { CharacterJson, StrokeData } from 'hanzi-writer';
import { STEPS } from './steps.ts';
import type { Settings } from '../settings/settings.ts';
import { finalGrade, gradeFor } from '../../domain/grading.ts';
import type { FinalGrade, StepResult } from '../../domain/grading.ts';
import type { CharEntry } from '../../domain/types.ts';
import { vibrate } from '../../shared/lib/haptics.ts';
import { t } from '../../shared/i18n/en.ts';
import type { AttemptComplete, WriterHandle } from '../writer/types.ts';

export const NEXT_STEP_DELAY = 1100; // ms between finishing a step and starting the next one
export const AFTER_ANIMATION_DELAY = 500;

type Status = { text: string; kind: '' | 'ok' | 'err' };

/**
 * State machine of one copybook exercise: STEPS.length attempts of the same character
 * with a fading outline, then a summary.
 *
 * @param item       current character entry { c, py, en }
 * @param data       stroke data for item.c, or null while loading
 * @param settings   normalized settings ({ hint, ... })
 * @param writerRef  ref to WritingCell's imperative API (animate, highlight)
 * @param onFinish   (char, summary) => void, called once when the last step is completed
 */
export function useCopybook({
  item,
  data,
  settings,
  writerRef,
  onFinish,
}: {
  item: CharEntry;
  data: CharacterJson | null;
  settings: Settings;
  writerRef: RefObject<WriterHandle | null>;
  onFinish?: (char: string, summary: FinalGrade) => void;
}) {
  const [step, setStep] = useState(0);
  const [results, setResults] = useState<StepResult[]>([]);
  const [curStroke, setCurStroke] = useState(0);
  const [status, setStatus] = useState<Status>({
    text: t.status.initial,
    kind: '',
  });
  const [animating, setAnimating] = useState(false);
  const [quizKey, setQuizKey] = useState(0); // bump to restart the quiz

  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Bumped by reset() and showAnimation(): late callbacks from an older run are ignored.
  const generation = useRef(0);

  const done = step >= STEPS.length;
  const active = !done && !animating;

  // Derived: shown only after all steps are done and no animation is playing.
  const summary = useMemo(
    () => (done && !animating ? finalGrade(results) : null),
    [done, animating, results],
  );

  useEffect(() => () => clearTimeout(timer.current ?? undefined), []);

  const reset = useCallback(() => {
    clearTimeout(timer.current ?? undefined);
    generation.current++;
    setStep(0);
    setResults([]);
    setAnimating(false);
    setQuizKey((k) => k + 1);
  }, []);

  // Callbacks for WritingCell.
  const strokeCount = data?.strokes.length ?? 0;
  const currentStep = STEPS[step];
  const currentBadge = currentStep ? t.steps[currentStep.id].badge : null;
  const handlers = {
    onStart() {
      setCurStroke(0);
      setStatus({
        text: t.status.step(step + 1, currentBadge ?? ''),
        kind: '',
      });
    },
    onCorrect(sd: StrokeData) {
      setCurStroke(sd.strokeNum + 1);
      setStatus({
        text: sd.strokesRemaining
          ? t.status.correct(sd.strokeNum + 1, strokeCount)
          : t.status.lastCorrect,
        kind: 'ok',
      });
    },
    onMistake(sd: StrokeData) {
      let text = sd.isBackwards
        ? t.status.backwards
        : t.status.mistake(sd.strokeNum + 1);
      if (settings.hint > 0 && sd.mistakesOnStroke >= settings.hint)
        text += t.status.seeHint;
      setStatus({ text, kind: 'err' });
    },
    onComplete({ totalMistakes, paths }: AttemptComplete) {
      const grade = gradeFor(totalMistakes, strokeCount);
      const next = results.slice();
      next[step] = { grade, mistakes: totalMistakes, paths };
      const isLast = step === STEPS.length - 1;

      setResults(next);
      setStatus({
        text:
          totalMistakes === 0
            ? t.status.clean
            : t.status.finished(totalMistakes),
        kind: 'ok',
      });
      vibrate(15);
      if (isLast) onFinish?.(item.c, finalGrade(next));

      timer.current = setTimeout(() => {
        setStep((s) => s + 1);
        if (isLast) setStatus({ text: t.status.summary, kind: '' });
      }, NEXT_STEP_DELAY);
    },
  };

  // Plays the stroke-order animation, then resumes (or restarts a finished exercise).
  const showAnimation = () => {
    clearTimeout(timer.current ?? undefined);
    const gen = ++generation.current;
    const restart = done;
    setAnimating(true);
    setStatus({ text: t.status.watching, kind: '' });
    writerRef.current?.animate(() => {
      // reset() or a newer animation took over (e.g. the character was switched).
      if (gen !== generation.current) return;
      timer.current = setTimeout(() => {
        if (restart) {
          setStep(0);
          setResults([]);
        }
        setAnimating(false);
        setQuizKey((k) => k + 1);
      }, AFTER_ANIMATION_DELAY);
    });
  };

  const showHint = () => {
    if (!active) return;
    writerRef.current?.highlight(curStroke);
    setStatus({ text: t.status.hintFor(curStroke + 1), kind: '' });
  };

  return {
    step,
    results,
    summary,
    status,
    active,
    curStroke: active ? curStroke : -1,
    outline: done ? 1 : (currentStep?.outline ?? 1),
    badge: active ? currentBadge : null,
    quizKey: `${quizKey}-${step}`,
    handlers,
    reset,
    showAnimation,
    showHint,
  };
}
