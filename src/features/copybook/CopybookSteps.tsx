import type { CSSProperties } from 'react';
import type { CharacterJson } from 'hanzi-writer';
import CanvasCell from '@/shared/ui/CanvasCell.tsx';
import {
  drawGrid,
  toCharSpace,
  fillStrokes,
  drawUserPaths,
} from '@/shared/lib/draw.ts';
import { STEPS } from '@/features/copybook/steps.ts';
import type { GridKind } from '@/domain/types.ts';
import { rgba, writingColors } from '@/shared/theme.ts';
import { useTheme } from '@/features/settings/useTheme.ts';
import { t } from '@/shared/i18n/en.ts';
import type { StepResult } from '@/domain/grading.ts';
import '@/features/copybook/copybook.css';

const FILL: CSSProperties = { width: '100%', height: '100%', display: 'block' };
const CELL_SIZE = 64;

// "Copybook" strip: one cell per step. Completed cells show what the user drew.
export default function CopybookSteps({
  data,
  step,
  results,
  gridKind,
}: {
  data: CharacterJson | null;
  step: number;
  results: StepResult[];
  gridKind: GridKind;
}) {
  const colors = writingColors[useTheme().resolved];
  const strokes = data?.strokes ?? []; // empty while loading: cells show only the grid
  const n = strokes.length;
  return (
    <section className="write-steps" aria-label={t.copybook}>
      <div className="write-section-head">
        <span>
          {step < STEPS.length ? t.stepOf(step + 1, STEPS.length) : t.done}
        </span>
      </div>
      <div className="steps">
        {STEPS.map((s, i) => {
          const r = results[i];
          const cls =
            'step' +
            (i === step && !r ? ' active' : '') +
            (r ? ' g' + r.grade : '');
          return (
            <div
              key={i}
              className={cls}
              aria-current={i === step ? 'step' : undefined}
            >
              <CanvasCell
                size={CELL_SIZE}
                style={FILL}
                aria-hidden="true"
                draw={(ctx, w) => {
                  drawGrid(ctx, w, gridKind, colors.gridRgb, 0.3);
                  ctx.save();
                  toCharSpace(ctx, w, 3);
                  if (r) {
                    fillStrokes(ctx, strokes, 0, n, colors.stepBehindUser);
                    drawUserPaths(ctx, r.paths, colors.ink);
                  } else if (s.outline > 0) {
                    fillStrokes(
                      ctx,
                      strokes,
                      0,
                      n,
                      rgba(colors.stepOutlineRgb, 0.25 + 0.45 * s.outline),
                    );
                  }
                  ctx.restore();
                }}
              />
              <span className="tag">{r ? '★'.repeat(r.grade) : i + 1}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
