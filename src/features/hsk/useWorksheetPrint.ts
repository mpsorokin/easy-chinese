import { useState } from 'react';
import type { CharacterJson } from 'hanzi-writer';
import { hskStore } from '@/features/hsk/hskStore.ts';
import { wordsWith } from '@/data/hsk.ts';
import type { LevelData } from '@/data/hsk.ts';
import { presetEntry } from '@/data/presets.ts';
import { t } from '@/shared/i18n/en.ts';
import { loadCharData } from '@/data/charData.ts';
import { usePersistentState } from '@/shared/hooks/usePersistentState.ts';
import {
  normalizePrintOptions,
  worksheetFileName,
} from '@/features/hsk/printOptions.ts';
import type { PrintState } from '@/features/hsk/PrintDialog.tsx';

// What the print dialog is open for: the characters and the level label used in the PDF.
type PrintJob = { chars: string[]; level: string; meta: string };

// Print dialog state shared by the selection tray and the ready-made sets: which characters
// are being printed, the persisted worksheet options and the build/save status.
export function useWorksheetPrint(level: LevelData) {
  const [job, setJob] = useState<PrintJob | null>(null);
  const [printState, setPrintState] = useState<PrintState>({ status: 'idle' });
  const [printOptions, setPrintOptions] = usePersistentState(
    hskStore,
    'printOptions',
    normalizePrintOptions,
  );

  // label: level shown in the PDF; meta: the line under the dialog title.
  const open = (
    chars: string[],
    label = level.id,
    meta = t.printMeta(chars.length),
  ) => {
    setPrintState({ status: 'idle' });
    setJob({ chars, level: label, meta });
  };
  const close = () => setJob(null);

  // Builds the worksheet PDF and saves it as a file; the dialog stays open with the result.
  const print = async () => {
    if (!job) return;
    setPrintState({ status: 'loading' });
    try {
      const [data, pdf, save, text] = await Promise.all([
        Promise.all<CharacterJson>(job.chars.map(loadCharData)),
        import('@/features/hsk/worksheetPdf.ts'),
        import('@/features/hsk/savePdf.ts'),
        import('@/features/hsk/textImage.ts'),
      ]);
      const rows = job.chars.flatMap((c, i) => {
        const entry = presetEntry(c);
        const d = data[i];
        return entry && d
          ? [{ entry, words: wordsWith(c, level), strokes: d.strokes }]
          : [];
      });
      const { bytes, pages } = await pdf.buildWorksheetPdf(
        rows,
        printOptions,
        text.textImage,
        job.level,
      );
      save.savePdf(bytes, worksheetFileName(job.chars, job.level));
      setPrintState({ status: 'done', pages });
    } catch (e) {
      console.error(e);
      setPrintState({ status: 'error' });
    }
  };

  return {
    job,
    printState,
    printOptions,
    setPrintOptions,
    open,
    close,
    print,
  };
}
