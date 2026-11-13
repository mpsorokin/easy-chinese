import { useState } from 'react';
import { ALL, CHAR_GROUPS, charAt } from '../../data/chars.ts';
import type { LevelData } from '../../data/hsk.ts';
import { t } from '../../shared/i18n/en.ts';
import type { BestGrades } from '../../domain/grading.ts';
import './CharPicker.css';

// Bottom sheet with character groups as tabs.
// Parent passes key={`${open}-${currentIdx}`} so the tab resets when the sheet opens.
export default function CharPicker({
  open,
  currentIdx,
  hsk,
  best,
  onPick,
  onClose,
}: {
  open: boolean;
  currentIdx: number;
  hsk?: LevelData;
  best: BestGrades;
  onPick: (index: number) => void;
  onClose: () => void;
}) {
  const [tab, setTab] = useState(charAt(currentIdx).g);
  const items = hsk?.chars ?? ALL;

  return (
    <div
      className={'sheet' + (open ? ' open' : '')}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="panel">
        <div className="head">
          <b>{t.pickerTitle}</b>
          <button className="close" onClick={onClose} aria-label={t.close}>
            ×
          </button>
        </div>
        {!hsk && (
          <div className="tabs">
            {CHAR_GROUPS.map((g, gi) => (
              <button
                key={g.name}
                className={gi === tab ? 'on' : ''}
                onClick={() => setTab(gi)}
              >
                {g.name}
              </button>
            ))}
          </div>
        )}
        <div className="chars">
          {items.map((it, i) => {
            if ('g' in it && it.g !== tab) return null;
            const score = best[it.c];
            return (
              <button
                key={it.c}
                className={'tile' + (i === currentIdx ? ' cur' : '')}
                onClick={() => onPick(i)}
              >
                <span className="c">{it.c}</span>
                <span className="p">{it.py}</span>
                <span className="r">{it.en}</span>
                <span className="s">{score ? '★'.repeat(score) : ''}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
