import { Link } from 'react-router';
import { stars, t } from '../../shared/i18n/en.ts';
import type { BestGrades } from '../../domain/grading.ts';
import type { CharEntry } from '../../domain/types.ts';
import './copybook.css';

// Shown instead of the writing cell once every character of a set is written, so the
// copybook ends rather than starting over from the first character.
export default function SetComplete({
  list,
  best,
  back,
  onAgain,
}: {
  list: readonly CharEntry[];
  best: BestGrades;
  back: { to: string; label: string };
  onAgain: () => void;
}) {
  return (
    <section className="set-complete" aria-labelledby="set-complete-title">
      <h2 id="set-complete-title">{t.setDoneTitle}</h2>
      <p>{t.setDoneDetails(list.length)}</p>
      <ul className="set-complete-chars">
        {list.map((e) => (
          <li key={e.c}>
            <span className="set-complete-glyph" lang="zh-Hans">
              {e.c}
            </span>
            <span className="set-complete-stars">{stars(best[e.c] ?? 0)}</span>
          </li>
        ))}
      </ul>
      <div className="set-complete-actions">
        <button type="button" className="btn" onClick={onAgain}>
          {t.setWriteAgain}
        </button>
        <Link className="btn primary" to={back.to}>
          {back.label}
        </Link>
      </div>
    </section>
  );
}
