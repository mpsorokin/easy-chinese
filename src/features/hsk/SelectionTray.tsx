import { HSK_MAX } from '../../data/hsk.ts';
import { t } from '../../shared/i18n/en.ts';

// Sticky bottom bar: chosen characters as removable chips, count, Write and Print PDF
// (which opens the print dialog).
export default function SelectionTray({
  selection,
  onRemove,
  onRemoveLast,
  onClear,
  onWrite,
  onPrint,
}: {
  selection: string[];
  onRemove: (c: string) => void;
  onRemoveLast: () => void;
  onClear: () => void;
  onWrite: () => void;
  onPrint?: () => void;
}) {
  const empty = selection.length === 0;
  return (
    <div className="hsk-tray">
      <div className="hsk-tray-row">
        <div className="hsk-chips">
          {empty ? (
            <span className="hsk-empty">{t.emptyTray}</span>
          ) : (
            selection.map((c) => (
              <button
                key={c}
                className="hsk-chip"
                onClick={() => onRemove(c)}
                aria-label={t.remove(c)}
              >
                {c}
                <span aria-hidden="true">×</span>
              </button>
            ))
          )}
        </div>
        <span className="hsk-count">
          {t.selected(selection.length, HSK_MAX)}
        </span>
        <button
          className="hsk-del"
          onClick={onRemoveLast}
          disabled={empty}
          aria-label={t.removeLast}
        >
          ⌫
        </button>
        <button className="hsk-clear" onClick={onClear} disabled={empty}>
          {t.clear}
        </button>
      </div>
      <div className="hsk-tray-actions">
        <button className="btn primary" onClick={onWrite} disabled={empty}>
          {t.write}
        </button>
        {onPrint && (
          <button className="btn" onClick={onPrint} disabled={empty}>
            {t.print}
          </button>
        )}
      </div>
    </div>
  );
}
