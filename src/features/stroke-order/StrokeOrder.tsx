import { useEffect, useRef } from 'react';
import type { CharacterJson } from 'hanzi-writer';
import CanvasCell from '../../shared/ui/CanvasCell.tsx';
import { toCharSpace, fillStrokes } from '../../shared/lib/draw.ts';
import { writingColors } from '../../shared/theme.ts';
import { useTheme } from '../settings/useTheme.ts';
import { t } from '../../shared/i18n/en.ts';
import WriteIcon from '../../shared/ui/WriteIcon.tsx';
import './StrokeOrder.css';

const CELL = 64;

// "Stroke order" strip: each cell shows the previous strokes plus the current one in red.
export default function StrokeOrder({
  data,
  current,
  onPick,
  shown,
  onToggle,
}: {
  data: CharacterJson | null;
  current: number;
  onPick: (index: number) => void;
  shown: boolean;
  onToggle: () => void;
}) {
  const colors = writingColors[useTheme().resolved];
  const boxRef = useRef<HTMLDivElement>(null);
  const strokes = data?.strokes ?? []; // empty while loading
  const n = strokes.length;

  // Keep the current stroke visible in the horizontally scrolling strip.
  useEffect(() => {
    const strip = boxRef.current;
    const el = strip?.children[current];
    if (!strip || !el || !shown) return;
    const { left, right } = el.getBoundingClientRect();
    const bounds = strip.getBoundingClientRect();
    const offset =
      left < bounds.left
        ? left - bounds.left
        : Math.max(0, right - bounds.right);
    if (offset) strip.scrollLeft += offset;
  }, [current, data, shown]);

  return (
    <section className="write-strokes" aria-labelledby="stroke-order-heading">
      <div className="write-section-head">
        <h2 id="stroke-order-heading">
          <WriteIcon name="pencil" /> {t.strokeOrder}
        </h2>
        <button
          type="button"
          className="order-toggle"
          aria-label={`${shown ? t.strokeOrderHide : t.show} ${t.strokeOrder.toLowerCase()}`}
          aria-expanded={shown}
          aria-controls="stroke-order-strip"
          onClick={onToggle}
        >
          {data ? t.strokeCount(n) : t.show}
          <WriteIcon name="chevron" />
        </button>
      </div>
      <div
        className="order"
        id="stroke-order-strip"
        ref={boxRef}
        hidden={!shown}
      >
        {strokes.map((_, i) => (
          <button
            key={i}
            type="button"
            className={i === current ? 'cur' : undefined}
            aria-label={t.strokeTitle(i + 1)}
            aria-current={i === current ? 'step' : undefined}
            onClick={() => onPick(i)}
          >
            <CanvasCell
              size={CELL}
              style={{ width: '100%', height: '100%' }}
              aria-hidden="true"
              draw={(ctx, s) => {
                ctx.save();
                toCharSpace(ctx, s, 6);
                fillStrokes(ctx, strokes, i + 1, n, colors.strokeTodo);
                fillStrokes(ctx, strokes, 0, i, colors.strokeDone);
                fillStrokes(ctx, strokes, i, i + 1, colors.accent);
                ctx.restore();
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
