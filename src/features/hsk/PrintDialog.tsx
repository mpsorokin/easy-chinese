import { useEffect, useRef } from 'react';
import Seg from '../../shared/ui/Seg.tsx';
import { t } from '../../shared/i18n/en.ts';
import { PRINT_ROWS } from './printOptions.ts';
import type { PrintOptions } from './printOptions.ts';
import type { GridKind } from '../../domain/types.ts';

const ROW_OPTIONS = PRINT_ROWS.map((n) => [n, String(n)] as const);
const GRID_OPTIONS = [
  ['tian', '田'],
  ['mi', '米'],
] as const satisfies readonly (readonly [GridKind, string])[];

export type PrintState =
  | { status: 'idle' | 'loading' | 'error' }
  | { status: 'done'; pages: number };

// Bottom sheet shown before printing: chosen characters, rows per character and grid type.
// A native modal <dialog>: Esc closes it, focus stays inside, the page behind is inert;
// a click on the backdrop (outside the panel) closes it too.
export default function PrintDialog({
  selection,
  meta,
  options,
  printState,
  onChange,
  onPrint,
  onClose,
}: {
  selection: string[];
  meta: string;
  options: PrintOptions;
  printState: PrintState;
  onChange: (options: PrintOptions) => void;
  onPrint: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  // Open as a modal on mount; unmounting removes it (no close() here: under StrictMode the
  // effect re-runs, and close() would fire a 'close' event that unmounts the dialog).
  useEffect(() => {
    const dialog = ref.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  return (
    <dialog
      ref={ref}
      className="print-dialog"
      aria-label={t.printTitle}
      onClose={onClose}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="print-dialog-panel">
        <div className="print-dialog-top">
          <div className="print-dialog-head">
            <b>{t.printTitle}</b>
            <button
              className="print-dialog-close"
              onClick={onClose}
              aria-label={t.close}
            >
              ×
            </button>
          </div>
          <p className="print-dialog-meta">{meta}</p>
          <div className="print-dialog-chars">{selection.join('')}</div>
        </div>
        <div className="print-dialog-body">
          <div className="print-dialog-row">
            <span>{t.printRows}</span>
            <Seg
              value={options.rows}
              options={ROW_OPTIONS}
              onChange={(rows) => onChange({ ...options, rows })}
            />
          </div>
          <div className="print-dialog-row">
            <span>{t.printGrid}</span>
            <Seg
              value={options.grid}
              options={GRID_OPTIONS}
              onChange={(grid) => onChange({ ...options, grid })}
            />
          </div>
          <button
            className="btn primary print-dialog-go"
            onClick={onPrint}
            disabled={printState.status === 'loading'}
          >
            {printState.status === 'loading' ? t.preparing : t.printGo}
          </button>
          {printState.status === 'error' && (
            <div className="print-dialog-msg hsk-error" role="alert">
              {t.printError}
            </div>
          )}
          {printState.status === 'done' && (
            <div className="print-dialog-msg" role="status">
              {t.printDone(printState.pages)}
            </div>
          )}
        </div>
      </div>
    </dialog>
  );
}
