import { t } from '@/shared/i18n/en.ts';
import {
  setWordStatus,
  wordStatuses,
  type WordStatus,
} from '@/features/vocabulary/vocabularyStore.ts';
import '@/features/vocabulary/WordStatusControl.css';

export default function WordStatusControl({
  word,
  status = 'new',
  beforeChange,
}: {
  word: string;
  status?: WordStatus;
  beforeChange?: (status: WordStatus, control: HTMLSelectElement) => void;
}) {
  return (
    <select
      className="word-status-control"
      data-word-status={status}
      aria-label={t.wordStatusLabel(word)}
      value={status}
      onChange={(event) => {
        const status = wordStatuses.find((item) => item === event.target.value);
        if (!status) return;
        beforeChange?.(status, event.currentTarget);
        setWordStatus(word, status);
      }}
    >
      {wordStatuses.map((status) => (
        <option key={status} value={status}>
          {t.wordStatus[status]}
        </option>
      ))}
    </select>
  );
}
