import { stars, t } from '../../shared/i18n/en.ts';
import type { CharEntry } from '../../domain/types.ts';
import type { FinalGrade } from '../../domain/grading.ts';
import './copybook.css';

// Result card shown over the writing cell after the last step.
// The wrapper is always rendered so the CSS fade-in transition can run.
export default function SummaryOverlay({
  item,
  summary,
  onAgain,
  onNext,
  nextLabel = t.nextChar,
}: {
  item: CharEntry;
  summary: FinalGrade | null;
  onAgain: () => void;
  onNext: () => void;
  nextLabel?: string;
}) {
  return (
    <div className={'copybook-summary' + (summary ? ' show' : '')}>
      {summary && (
        <>
          <div className="big">{stars(summary.grade)}</div>
          <div className="t">{t.summaryTitle(summary.grade)}</div>
          <div className="d">{t.summaryDetails(item, summary.total)}</div>
          <div className="acts">
            <button className="btn" onClick={onAgain}>
              {t.again}
            </button>
            <button className="btn primary" onClick={onNext}>
              {nextLabel}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
