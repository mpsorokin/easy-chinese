import { useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { Link } from 'react-router';
import type { ReadingStory } from '@/data/readingStories.ts';
import { vocabularyEntry } from '@/data/vocabulary.ts';
import type { HskWord } from '@/domain/types.ts';
import {
  readingSpeeds,
  useStoryAudio,
} from '@/features/reading/useStoryAudio.ts';
import PageToolbar from '@/features/settings/PageToolbar.tsx';
import {
  useWordStatuses,
  wordStatuses,
} from '@/features/vocabulary/vocabularyStore.ts';
import WordStatusControl from '@/features/vocabulary/WordStatusControl.tsx';
import { t } from '@/shared/i18n/en.ts';
import {
  COURSE_LEVEL,
  courseLessonPath,
  readingPath,
  vocabularyPath,
} from '@/shared/paths.ts';
import WriteIcon from '@/shared/ui/WriteIcon.tsx';

export default function StoryReader({
  story,
  fromLesson,
}: {
  story: ReadingStory;
  fromLesson?: number;
}) {
  const [showPinyin, setPinyin] = useState(false);
  const [showEnglish, setEnglish] = useState(false);
  const [word, setWord] = useState<HskWord>();
  const dialog = useRef<HTMLDialogElement>(null);
  const rows = useRef<HTMLLIElement[]>([]);
  const statuses = useWordStatuses();
  const count = story.lines.length;
  const audio = useStoryAudio(
    story.lines.map((line) => line.spoken ?? line.zh),
    (index) => rows.current[index]?.scrollIntoView({ block: 'nearest' }),
  );
  const lessons = story.lessons;

  function openWord(entry: HskWord) {
    if (audio.playing) audio.pause();
    // Render the new word before the dialog opens, so it never shows the previous one.
    flushSync(() => setWord(entry));
    dialog.current?.showModal();
  }

  return (
    <main className="app page-frame story-reader">
      <header className="reading-header story-heading">
        <PageToolbar
          back={
            fromLesson === undefined
              ? { to: readingPath, children: t.reading }
              : {
                  to: courseLessonPath(COURSE_LEVEL, fromLesson),
                  children: t.lessonN(fromLesson),
                }
          }
        >
          <Link className="toolbar-link" to={vocabularyPath}>
            {t.vocabulary}
          </Link>
        </PageToolbar>
        <h1 lang="zh-Hans">{story.titleZh}</h1>
        {showPinyin && (
          <p className="story-pinyin" lang="zh-Latn-pinyin">
            {story.titlePinyin}
          </p>
        )}
        <p className="story-subtitle">{story.titleEn}</p>
        {lessons && (
          <nav
            className="story-lesson-links"
            aria-label={t.readingLessons(...lessons)}
          >
            <span>{t.levelTitle(COURSE_LEVEL)}</span>
            {Array.from({ length: lessons[1] - lessons[0] + 1 }, (_, step) => {
              const lesson = lessons[0] + step;
              return (
                <Link key={lesson} to={courseLessonPath(COURSE_LEVEL, lesson)}>
                  {t.lessonN(lesson)}
                </Link>
              );
            })}
          </nav>
        )}
      </header>

      <div className="story-controls">
        <ul className="story-legend" role="list">
          {wordStatuses.map((status) => (
            <li
              key={status}
              id={`story-status-${status}`}
              data-word-status={status}
            >
              {t.wordStatus[status]}
            </li>
          ))}
        </ul>
        <div className="story-toggles">
          <button
            type="button"
            aria-pressed={showPinyin}
            onClick={() => setPinyin(!showPinyin)}
          >
            {t.readingPinyin}
          </button>
          <button
            type="button"
            aria-pressed={showEnglish}
            onClick={() => setEnglish(!showEnglish)}
          >
            {t.readingEnglish}
          </button>
        </div>
      </div>

      <ol className="story-sentences" role="list">
        {story.lines.map((line, index) => (
          <li
            key={index}
            className="story-sentence"
            aria-current={index === audio.index ? 'true' : undefined}
            ref={(row) => {
              if (row) rows.current[index] = row;
            }}
          >
            <button
              type="button"
              className="story-line-play"
              aria-label={t.readingListenSentence(index + 1)}
              disabled={!audio.supported}
              onClick={() => audio.playSentence(index)}
            >
              <WriteIcon name="volume" />
            </button>
            <div className="story-line-copy">
              {showPinyin && (
                <p className="story-pinyin" lang="zh-Latn-pinyin">
                  {line.pinyin}
                </p>
              )}
              <p className="story-line-zh" lang="zh-Hans">
                {line.tokens.map((token, position) => {
                  const entry = vocabularyEntry(token);
                  return entry ? (
                    <button
                      type="button"
                      key={position}
                      className="story-word"
                      data-word-status={statuses[token] ?? 'new'}
                      aria-describedby={`story-status-${statuses[token] ?? 'new'}`}
                      aria-haspopup="dialog"
                      onClick={() => openWord(entry)}
                    >
                      {token}
                    </button>
                  ) : (
                    <span key={position}>{token}</span>
                  );
                })}
              </p>
              {showEnglish && (
                <p className="story-line-en" lang="en">
                  {line.en}
                </p>
              )}
            </div>
          </li>
        ))}
      </ol>

      <section className="story-player" aria-label={t.readingPlayer}>
        <span className="story-player-position">
          {t.readingSentence(audio.index + 1, count)}
        </span>
        <input
          className="story-player-scrubber"
          type="range"
          min={1}
          max={count}
          value={audio.index + 1}
          aria-label={t.readingSelectSentence}
          aria-valuetext={t.readingSentence(audio.index + 1, count)}
          onChange={(event) => audio.goTo(event.target.valueAsNumber - 1)}
        />
        <div className="story-player-controls">
          <button
            type="button"
            aria-label={t.readingRepeat}
            title={t.readingRepeat}
            aria-pressed={audio.repeat}
            onClick={audio.toggleRepeat}
          >
            <WriteIcon name="restart" />
          </button>
          <button
            type="button"
            aria-label={t.readingPrevious}
            disabled={audio.index === 0}
            onClick={() => audio.goTo(audio.index - 1)}
          >
            <WriteIcon name="skip-back" />
          </button>
          <button
            type="button"
            className="story-play"
            aria-label={audio.playing ? t.readingPause : t.readingPlay}
            disabled={!audio.supported}
            onClick={audio.toggle}
          >
            <WriteIcon name={audio.playing ? 'pause' : 'play'} />
          </button>
          <button
            type="button"
            aria-label={t.readingNext}
            disabled={audio.index === count - 1}
            onClick={() => audio.goTo(audio.index + 1)}
          >
            <WriteIcon name="skip-next" />
          </button>
          <select
            aria-label={t.readingSpeed}
            value={audio.speed}
            onChange={(event) => audio.changeSpeed(Number(event.target.value))}
          >
            {readingSpeeds.map((speed) => (
              <option key={speed} value={speed}>
                {speed}×
              </option>
            ))}
          </select>
        </div>
        {!audio.supported ? (
          <p role="status">{t.readingNoSpeech}</p>
        ) : (
          audio.error && <p role="status">{t.readingAudioError}</p>
        )}
      </section>

      <dialog
        ref={dialog}
        className="story-word-dialog"
        aria-label={t.wordDetails}
      >
        <form method="dialog">
          <button className="story-word-close" aria-label={t.close}>
            ×
          </button>
        </form>
        {word && (
          <>
            <h2 lang="zh-Hans">{word.w}</h2>
            <p className="story-pinyin" lang="zh-Latn-pinyin">
              {word.py}
            </p>
            <p>{word.en}</p>
            <WordStatusControl word={word.w} status={statuses[word.w]} />
          </>
        )}
      </dialog>
    </main>
  );
}
