import {
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useRef,
  useState,
} from 'react';
import type { ReactNode, Ref } from 'react';
import HanziWriter from 'hanzi-writer';
import CanvasCell from '../../shared/ui/CanvasCell.tsx';
import { drawGrid } from '../../shared/lib/draw.ts';
import { loadCharData } from '../../data/charData.ts';
import type { GridKind, StrokePaths } from '../../domain/types.ts';
import { rgba, writingColors } from '../../shared/theme.ts';
import type { WritingColors } from '../../shared/theme.ts';
import { vibrate } from '../../shared/lib/haptics.ts';
import { useTheme } from '../settings/useTheme.ts';
import type { QuizCallbacks, WriterHandle } from './types.ts';
import './WritingCell.css';

const writerColors = (colors: WritingColors, outline: number) => ({
  strokeColor: colors.ink,
  drawingColor: colors.drawing,
  highlightColor: colors.highlight,
  outlineColor:
    outline >= 1 ? colors.outlineSolid : rgba(colors.outlineRgb, outline),
});
const padFor = (size: number) => Math.round(size * 0.06);

type WritingCellProps = QuizCallbacks & {
  ref?: Ref<WriterHandle>;
  char: string;
  gridKind: GridKind;
  outline: number;
  active: boolean;
  quizKey: string;
  strict: number;
  hint: number;
  speed: number;
  children?: ReactNode;
};

// Show (stroke animation) and Hint (stroke highlight) speeds; 1 is the normal pace.
const animationSpeeds = (speed: number) => ({
  strokeAnimationSpeed: 1.1 * speed,
  delayBetweenStrokes: Math.round(220 / speed),
  strokeHighlightSpeed: 2 * speed,
});

/**
 * Large cell for finger writing. Wraps HanziWriter (an imperative library).
 *
 * props:
 *  char, gridKind
 *  outline   — outline visibility for the current step (0..1)
 *  active    — whether the quiz is currently running
 *  quizKey   — changing it restarts the quiz
 *  strict, hint — quiz settings (numbers, see config/settings.ts)
 *  speed     — Show / Hint animation speed, 1 = normal
 *  onStart(), onCorrect(sd), onMistake(sd), onComplete({ totalMistakes, paths })
 *
 *  If stroke data fails to load, the cell stays empty; changing quizKey retries.
 *
 * ref (React 19 regular prop): animate(onDone), highlight(strokeIndex)
 */
export default function WritingCell(props: WritingCellProps) {
  const {
    ref,
    char,
    gridKind,
    outline,
    active,
    quizKey,
    strict,
    hint,
    speed,
    children,
    onStart,
    onCorrect,
    onMistake,
    onComplete,
  } = props;
  const colors = writingColors[useTheme().resolved];
  const hostRef = useRef<HTMLDivElement>(null);
  const cellRef = useRef<HTMLDivElement>(null);
  const writerRef = useRef<HanziWriter | null>(null);
  const paletteRef = useRef({ colors, outline });
  const [{ width, height }, setDimensions] = useState({ width: 1, height: 1 });
  // Character whose data is loaded into the writer; null until setCharacter() succeeds.
  const loadedRef = useRef<string | null>(null);
  // Set by onLoadCharDataError during setCharacter().
  const loadFailedRef = useRef(false);

  // Always-fresh callbacks for quiz(): refreshed after every commit,
  // before regular effects run and before any user input is handled.
  const cb = useRef<QuizCallbacks>({
    onStart,
    onCorrect,
    onMistake,
    onComplete,
  });
  useLayoutEffect(() => {
    cb.current = { onStart, onCorrect, onMistake, onComplete };
  });

  // Change colors in place so switching theme preserves the active quiz and its paths.
  useLayoutEffect(() => {
    paletteRef.current = { colors, outline };
    const writer = writerRef.current;
    if (!writer) return;

    const options = writerColors(colors, outline);
    writer._options.highlightCompleteColor = colors.good;
    if (!loadedRef.current) {
      Object.assign(writer._options, options);
      return;
    }

    void writer.updateColor('strokeColor', options.strokeColor, {
      duration: 0,
    });
    void writer.updateColor('drawingColor', options.drawingColor, {
      duration: 0,
    });
    void writer.updateColor('highlightColor', options.highlightColor, {
      duration: 0,
    });
    void writer.updateColor('outlineColor', options.outlineColor, {
      duration: 0,
    });
  }, [colors, outline]);

  useLayoutEffect(() => {
    const cell = cellRef.current;
    if (!cell) return;
    const measure = () => {
      const { clientWidth: width, clientHeight: height } = cell;
      if (width && height) {
        setDimensions((previous) =>
          previous.width === width && previous.height === height
            ? previous
            : { width, height },
        );
      }
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(cell);
    return () => observer.disconnect();
  }, []);

  // create the writer once; the character is loaded by the quiz effect below
  useEffect(() => {
    const host = hostRef.current;
    const cell = cellRef.current;
    if (!host || !cell) return;
    const { clientWidth: width, clientHeight: height } = cell;
    const { colors, outline } = paletteRef.current;
    const w = new HanziWriter(host, {
      width,
      height,
      padding: padFor(height),
      renderer: 'svg',
      showCharacter: false,
      showOutline: true,
      radicalColor: null,
      ...writerColors(colors, outline),
      drawingWidth: Math.max(14, Math.round(height / 22)),
      highlightCompleteColor: colors.good,
      ...animationSpeeds(1),
      charDataLoader: (c) => loadCharData(c),
      // Without this handler HanziWriter rethrows, and its later calls throw synchronously.
      onLoadCharDataError: (err) => {
        loadFailedRef.current = true;
        console.error(err);
      },
    });
    writerRef.current = w;
    return () => {
      w.cancelQuiz();
      host.innerHTML = '';
      writerRef.current = null;
      loadedRef.current = null;
    };
  }, []);

  // HanziWriter reads these options on every animation and highlight, so changing them
  // in place takes effect at once without restarting the quiz.
  useEffect(() => {
    const options = writerRef.current?._options;
    if (options) Object.assign(options, animationSpeeds(speed));
  }, [speed]);

  useLayoutEffect(() => {
    writerRef.current?.updateDimensions({
      width,
      height,
      padding: padFor(height),
    });
  }, [width, height]);

  // start the quiz
  useEffect(() => {
    const w = writerRef.current;
    if (!w) return;
    if (!active) {
      w.cancelQuiz();
      return;
    }
    let cancelled = false;
    const paths: StrokePaths = [];

    (async () => {
      if (loadedRef.current !== char) {
        loadedRef.current = null;
        loadFailedRef.current = false;
        await w.setCharacter(char);
        // A newer run owns the writer now (and has started its own load).
        if (cancelled) return;
        if (loadFailedRef.current) return; // shown by useCharData in App
        loadedRef.current = char;
      }
      // These return animation promises; the quiz does not wait for them.
      w.cancelQuiz();
      void w.hideCharacter();
      if (outline > 0) void w.showOutline();
      else void w.hideOutline();
      cb.current.onStart?.();

      void w.quiz({
        leniency: strict,
        showHintAfterMisses: hint > 0 ? hint : false,
        markStrokeCorrectAfterMisses: hint > 0 ? hint + 2 : 4,
        highlightOnComplete: true,
        onCorrectStroke(sd) {
          paths[sd.strokeNum] = sd.drawnPath?.points;
          cb.current.onCorrect?.(sd);
        },
        onMistake(sd) {
          const el = cellRef.current;
          if (el) {
            el.classList.remove('shake');
            void el.offsetWidth;
            el.classList.add('shake');
          }
          vibrate(40);
          cb.current.onMistake?.(sd);
        },
        onComplete(sum) {
          cb.current.onComplete?.({
            totalMistakes: sum.totalMistakes,
            paths: paths.slice(),
          });
        },
      });
    })().catch((err: unknown) => console.error(err));

    return () => {
      cancelled = true;
    };
  }, [char, active, quizKey, outline, strict, hint]);

  useImperativeHandle(
    ref,
    () => ({
      animate(onDone) {
        const w = writerRef.current;
        // Nothing to animate until the character is loaded.
        if (!w || !loadedRef.current) {
          onDone?.();
          return;
        }
        w.cancelQuiz();
        void w.showOutline();
        void w.animateCharacter({ onComplete: () => onDone?.() });
      },
      highlight(i) {
        if (loadedRef.current) void writerRef.current?.highlightStroke(i);
      },
    }),
    [],
  );

  // prevent page scrolling while writing with a finger (iOS)
  useEffect(() => {
    const el = cellRef.current;
    if (!el) return;
    const stop = (e: TouchEvent) => e.preventDefault();
    el.addEventListener('touchmove', stop, { passive: false });
    return () => el.removeEventListener('touchmove', stop);
  }, []);

  return (
    <div className="cell" ref={cellRef}>
      <CanvasCell
        size={width}
        height={height}
        className="grid"
        aria-hidden="true"
        draw={(ctx, s) =>
          drawGrid(ctx, s, gridKind, colors.gridRgb, 0.55, height)
        }
      />
      <div ref={hostRef} className="writer-host" />
      {children}
    </div>
  );
}
