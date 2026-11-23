import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { hskSelectionKey, hskStore } from '@/features/hsk/hskStore.ts';
import {
  HSK_MAX,
  byLetter,
  normalizeHskChars,
  searchHsk,
  unknownChars,
} from '@/data/hsk.ts';
import type { LevelData } from '@/data/hsk.ts';
import { PRINT_PRESETS } from '@/data/presets.ts';
import type { HskChar } from '@/domain/types.ts';
import type { BestGrades } from '@/domain/grading.ts';
import { useProgress } from '@/features/progress/useProgress.ts';
import { usePersistentState } from '@/shared/hooks/usePersistentState.ts';
import { t } from '@/shared/i18n/en.ts';
import SelectionTray from '@/features/hsk/SelectionTray.tsx';
import PrintDialog from '@/features/hsk/PrintDialog.tsx';
import PresetCard from '@/features/hsk/PresetCard.tsx';
import { useWorksheetPrint } from '@/features/hsk/useWorksheetPrint.ts';
import { selectionWritePath } from '@/shared/paths.ts';
import '@/features/hsk/hsk.css';

const HAN = /\p{Script=Han}/u;

// "All characters" tab of the HSK level: choose up to HSK_MAX characters, then practise
// them in the copybook (Write) or print a worksheet (Print PDF).
export default function HskChars({
  level,
  writingOnly,
}: {
  level: LevelData;
  writingOnly: boolean;
}) {
  const [query, setQuery] = useState('');
  const normalizeSelection = useCallback(
    (raw: unknown) => normalizeHskChars(raw, level),
    [level],
  );
  const [selection, setSelection] = usePersistentState(
    hskStore,
    hskSelectionKey(level.id, writingOnly),
    normalizeSelection,
  );
  const { best } = useProgress();
  const navigate = useNavigate();
  const selected = useMemo(() => new Set(selection), [selection]);

  const toggle = (c: string) =>
    setSelection((sel) =>
      sel.includes(c)
        ? sel.filter((x) => x !== c)
        : sel.length < HSK_MAX
          ? [...sel, c]
          : sel,
    );
  const addAll = (chars: string[]) =>
    setSelection((sel) =>
      [...sel, ...chars.filter((c) => !sel.includes(c))].slice(0, HSK_MAX),
    );

  const results = useMemo(() => searchHsk(query, level), [query, level]);
  const pasteMode = HAN.test(query);
  const skipped = useMemo(
    () => (pasteMode ? unknownChars(query, level) : []),
    [pasteMode, query, level],
  );

  // The chosen characters go into the copybook's URL; it starts at the first one.
  const write = () => {
    const [first] = selection;
    if (!first) return;
    void navigate(
      selectionWritePath(
        level.id,
        selection,
        writingOnly ? 'write' : undefined,
      ),
      { state: { start: first } },
    );
  };

  const printer = useWorksheetPrint(level);

  return (
    <>
      <p className="hsk-hint">
        {writingOnly ? t.hintWritingChars(HSK_MAX) : t.hintChars(HSK_MAX)}
      </p>
      {!writingOnly &&
        PRINT_PRESETS.map((p) => (
          <PresetCard
            key={p.id}
            preset={p}
            onPrint={() =>
              printer.open(p.chars, p.level, t.presetPrintMeta(p.chars.length))
            }
          />
        ))}
      <input
        className="hsk-search"
        type="search"
        value={query}
        placeholder={t.search}
        onChange={(e) => setQuery(e.target.value)}
        // Pasted characters go straight into the selection (the text stays as a filter,
        // so the grid shows which of them were found in this level).
        onPaste={(e) => {
          const text = e.clipboardData.getData('text');
          if (HAN.test(text)) addAll(searchHsk(text, level).map((x) => x.c));
        }}
      />
      {skipped.length > 0 && (
        <p className="hsk-hint">{t.notInLevel(skipped.join(' '), level.id)}</p>
      )}
      {results.length === 0 ? (
        <p className="hsk-hint">{t.nothingFound}</p>
      ) : pasteMode ? (
        <section>
          <button
            className="hsk-addall"
            onClick={() => addAll(results.map((e) => e.c))}
          >
            {t.addAll(results.length)}
          </button>
          <CardGrid
            items={results}
            selected={selected}
            best={best}
            onToggle={toggle}
          />
        </section>
      ) : (
        byLetter(results).map(({ letter, items }) => (
          <section key={letter}>
            <h2 className="hsk-letter">{letter}</h2>
            <CardGrid
              items={items}
              selected={selected}
              best={best}
              onToggle={toggle}
            />
          </section>
        ))
      )}

      <SelectionTray
        selection={selection}
        onRemove={(c) => setSelection((sel) => sel.filter((x) => x !== c))}
        onRemoveLast={() => setSelection((sel) => sel.slice(0, -1))}
        onClear={() => setSelection([])}
        onWrite={write}
        onPrint={writingOnly ? undefined : () => printer.open(selection)}
      />

      {printer.job && printer.job.chars.length > 0 && (
        <PrintDialog
          selection={printer.job.chars}
          meta={printer.job.meta}
          options={printer.printOptions}
          printState={printer.printState}
          onChange={printer.setPrintOptions}
          onPrint={() => void printer.print()}
          onClose={printer.close}
        />
      )}
    </>
  );
}

function CardGrid({
  items,
  selected,
  best,
  onToggle,
}: {
  items: HskChar[];
  selected: Set<string>;
  best: BestGrades;
  onToggle: (c: string) => void;
}) {
  return (
    <div className="hsk-grid">
      {items.map((e) => {
        const score = best[e.c];
        return (
          <button
            key={e.c}
            className={'hsk-card' + (selected.has(e.c) ? ' on' : '')}
            aria-pressed={selected.has(e.c)}
            onClick={() => onToggle(e.c)}
          >
            <span className="hsk-c">{e.c}</span>
            <span className="hsk-py">{e.py}</span>
            <span className="hsk-en">{e.en}</span>
            {score ? (
              <span className="hsk-stars">{'★'.repeat(score)}</span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
