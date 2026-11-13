import { useCallback, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import type { CharacterJson } from 'hanzi-writer';
import { hskSelectionKey, hskStore } from './hskStore.ts';
import {
  HSK_MAX,
  byLetter,
  normalizeHskChars,
  searchHsk,
  wordsWith,
} from '../../data/hsk.ts';
import type { LevelData } from '../../data/hsk.ts';
import { loadCharData } from '../../data/charData.ts';
import type { HskChar } from '../../domain/types.ts';
import type { BestGrades } from '../../domain/grading.ts';
import { useProgress } from '../progress/useProgress.ts';
import { usePersistentState } from '../../shared/hooks/usePersistentState.ts';
import { t } from '../../shared/i18n/en.ts';
import SelectionTray from './SelectionTray.tsx';
import PrintDialog from './PrintDialog.tsx';
import type { PrintState } from './PrintDialog.tsx';
import { normalizePrintOptions, worksheetFileName } from './printOptions.ts';
import { selectionWritePath } from '../lesson/lessonNav.ts';
import './hsk.css';

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

  const [printState, setPrintState] = useState<PrintState>({ status: 'idle' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [printOptions, setPrintOptions] = usePersistentState(
    hskStore,
    'printOptions',
    normalizePrintOptions,
  );
  const openDialog = () => {
    setPrintState({ status: 'idle' });
    setDialogOpen(true);
  };
  // Builds the worksheet PDF and saves it as a file; the dialog stays open with the result.
  const print = async () => {
    setPrintState({ status: 'loading' });
    try {
      const [data, pdf, save, text] = await Promise.all([
        Promise.all<CharacterJson>(selection.map(loadCharData)),
        import('./worksheetPdf.ts'),
        import('./savePdf.ts'),
        import('./textImage.ts'),
      ]);
      const rows = selection.flatMap((c, i) => {
        const entry = level.chars.find((e) => e.c === c);
        const d = data[i];
        return entry && d
          ? [{ entry, words: wordsWith(c, level), strokes: d.strokes }]
          : [];
      });
      const { bytes, pages } = await pdf.buildWorksheetPdf(
        rows,
        printOptions,
        text.textImage,
        level.id,
      );
      save.savePdf(bytes, worksheetFileName(selection, level.id));
      setPrintState({ status: 'done', pages });
    } catch (e) {
      console.error(e);
      setPrintState({ status: 'error' });
    }
  };

  return (
    <>
      <p className="hsk-hint">
        {writingOnly ? t.hintWritingChars(HSK_MAX) : t.hintChars(HSK_MAX)}
      </p>
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
        onPrint={writingOnly ? undefined : openDialog}
      />

      {dialogOpen && selection.length > 0 && (
        <PrintDialog
          selection={selection}
          options={printOptions}
          printState={printState}
          onChange={setPrintOptions}
          onPrint={() => void print()}
          onClose={() => setDialogOpen(false)}
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
