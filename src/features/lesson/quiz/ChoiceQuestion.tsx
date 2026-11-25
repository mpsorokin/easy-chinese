import { useEffect, useState } from 'react';
import type {
  Audio,
  ChoiceQuestion as Question,
} from '@/domain/exercises/index.ts';
import { t } from '@/shared/i18n/en.ts';
import { canSpeak, speakChinese, stopSpeaking } from '@/shared/lib/speech.ts';
import WriteIcon from '@/shared/ui/WriteIcon.tsx';
import Prompt, { SpeakerIcon } from '@/features/lesson/quiz/Prompt.tsx';
import { useAutoplay } from '@/features/lesson/quiz/useAutoplay.ts';

const CHOICE_LABEL = {
  show: undefined,
  listen: t.quizListenChoose,
  toWord: t.quizToWord,
} as const;

export default function ChoiceQuestion({
  q,
  onAnswer,
}: {
  q: Question;
  onAnswer: (right: boolean) => void;
}) {
  const [picked, setPicked] = useState<number>();
  const [heard, setHeard] = useState(false);
  const mode = q.mode ?? 'show';
  const audioOnly = mode === 'listenOnly';
  const pick = (k: number) => {
    if (picked !== undefined) return;
    setPicked(k);
    onAnswer(k === q.answer);
  };
  useAutoplay(mode === 'listen' ? q.audio?.text : undefined);
  return (
    <>
      {audioOnly ? (
        <>
          <ListeningPrompt
            audio={q.audio}
            heard={heard}
            onPlayed={() => setHeard(true)}
          />
          <p className="quiz-listening-instruction">{t.quizChooseEnglish}</p>
        </>
      ) : (
        <Prompt
          text={q.prompt}
          hint={q.hint}
          small={mode === 'toWord'}
          label={CHOICE_LABEL[mode]}
          audio={q.audio}
          answered={picked !== undefined}
          listen={mode === 'listen'}
        />
      )}
      <div
        className="quiz-options"
        role={audioOnly ? 'group' : undefined}
        aria-label={audioOnly ? t.quizChooseEnglish : undefined}
      >
        {q.options.map((option, k) => {
          const right = picked !== undefined && k === q.answer;
          const wrong = picked === k && k !== q.answer;
          return (
            <button
              key={option}
              className={
                'quiz-option' +
                (q.optionLang === 'zh' ? ' quiz-option-zh' : '') +
                (right ? ' right' : '') +
                (wrong ? ' wrong' : '')
              }
              lang={q.optionLang === 'zh' ? 'zh-Hans' : undefined}
              disabled={picked !== undefined || (audioOnly && !heard)}
              onClick={() => pick(k)}
            >
              {option}
              {audioOnly && right && <WriteIcon name="check" />}
            </button>
          );
        })}
      </div>
    </>
  );
}

function ListeningPrompt({
  audio,
  heard,
  onPlayed,
}: {
  audio?: Audio;
  heard: boolean;
  onPlayed: () => void;
}) {
  const [playback, setPlayback] = useState<'idle' | 'playing' | 'error'>(
    'idle',
  );
  const playable = audio && canSpeak();
  const playing = playback === 'playing';
  const label = playing
    ? t.quizPlayingAudio
    : heard
      ? t.quizReplayAudio
      : t.quizPlayAudio;

  useEffect(() => stopSpeaking, []);

  function play() {
    if (!playable || playing) return;
    setPlayback('playing');
    speakChinese(audio.text, {
      onEnd: () => {
        setPlayback('idle');
        onPlayed();
      },
      onStop: () => setPlayback('idle'),
      onError: () => setPlayback('error'),
    });
  }

  return (
    <div className="quiz-listening-prompt">
      {playable && (
        <button
          type="button"
          className="quiz-listening-play"
          aria-disabled={playing}
          onClick={play}
        >
          <span className="quiz-listening-speaker">
            <SpeakerIcon />
          </span>
          {label}
        </button>
      )}
      {(!playable || playback === 'error') && (
        <span className="quiz-listening-error" role="status">
          {playable ? t.readingAudioError : t.readingNoSpeech}
        </span>
      )}
    </div>
  );
}
