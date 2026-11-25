import type { Audio } from '@/domain/exercises/index.ts';
import { t } from '@/shared/i18n/en.ts';
import { canSpeak, speakChinese } from '@/shared/lib/speech.ts';

// The question's prompt shared by every question kind: the text, its hint, a label and
// a speaker button.
export default function Prompt({
  text,
  hint,
  small,
  label,
  audio,
  answered,
  listen,
}: {
  text: string;
  hint?: string;
  small?: boolean;
  label?: string;
  audio?: Audio;
  answered: boolean;
  listen?: boolean; // only the sound until answered
}) {
  const supported = canSpeak();
  const playable =
    audio && supported && (!audio.afterAnswer || answered) ? audio : null;
  const hidden = listen && !answered && supported;

  return (
    <div
      className={
        (small ? 'quiz-prompt quiz-prompt-build' : 'quiz-prompt') +
        (hidden ? ' quiz-prompt-listen' : '')
      }
    >
      {playable && (
        <button
          type="button"
          className={hidden ? 'quiz-speak quiz-speak-big' : 'quiz-speak'}
          aria-label={t.quizListen}
          title={t.quizListen}
          onClick={() => speakChinese(playable.text)}
        >
          <SpeakerIcon />
        </button>
      )}
      {label && <span className="label">{label}</span>}
      {!hidden && (
        <>
          <span
            className={
              !small && text.length > 1
                ? 'quiz-prompt-text quiz-prompt-word'
                : 'quiz-prompt-text'
            }
            lang={small ? undefined : 'zh-Hans'}
          >
            {text}
          </span>
          {hint && <span className="quiz-prompt-hint">{hint}</span>}
        </>
      )}
    </div>
  );
}

export function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor" />
      <path
        d="M16 8.5a5 5 0 0 1 0 7M18.5 6a8.5 8.5 0 0 1 0 12"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
