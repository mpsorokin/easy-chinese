import { t } from '../../shared/i18n/en.ts';
import WriteIcon from './WriteIcon.tsx';
import './copybook.css';

export default function Controls({
  onShow,
  onHint,
  onRestart,
}: {
  onShow: () => void;
  onHint: () => void;
  onRestart: () => void;
}) {
  return (
    <div className="controls">
      <button className="btn write-show" onClick={onShow}>
        <WriteIcon name="play" />
        {t.show}
      </button>
      <button className="btn" onClick={onHint}>
        <WriteIcon name="hint" />
        {t.hint}
      </button>
      <button className="btn" onClick={onRestart}>
        <WriteIcon name="restart" />
        {t.restart}
      </button>
    </div>
  );
}
