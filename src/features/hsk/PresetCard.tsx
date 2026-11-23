import type { PrintPreset } from '@/data/presets.ts';
import WriteIcon from '@/shared/ui/WriteIcon.tsx';
import { t } from '@/shared/i18n/en.ts';

// Ready-made character set: a worksheet-style preview cell, title, size, a preview of its
// characters and a Print button that opens the print dialog for the whole set
// (independent of the selection tray).
export default function PresetCard({
  preset,
  onPrint,
}: {
  preset: PrintPreset;
  onPrint: () => void;
}) {
  const title = t.presetTitle(preset.level);
  return (
    <section className="hsk-preset" aria-label={title}>
      <span className="hsk-preset-cell" lang="zh-Hans" aria-hidden="true">
        <svg viewBox="0 0 60 60" className="hsk-preset-grid">
          <path d="M30 0v60M0 30h60M0 0l60 60M60 0L0 60" />
        </svg>
        {preset.chars[0]}
      </span>
      <div className="hsk-preset-main">
        <span className="hsk-preset-kicker">{t.presetKicker}</span>
        <b className="hsk-preset-title">{title}</b>
        <span className="hsk-preset-chars" lang="zh-Hans" aria-hidden="true">
          {preset.chars.join('')}
        </span>
        <span className="hsk-preset-meta">
          {t.presetMeta(preset.chars.length)}
        </span>
      </div>
      <button
        className="hsk-preset-print"
        type="button"
        aria-haspopup="dialog"
        onClick={onPrint}
      >
        <WriteIcon name="printer" strokeWidth={1.8} />
        <span>{t.presetPrint}</span>
      </button>
    </section>
  );
}
