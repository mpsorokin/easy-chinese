import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { hskSelectionKey, hskStore } from '@/features/hsk/hskStore.ts';
import { lessonStore } from '@/features/lesson/lessonStore.ts';
import { HSK_LEVELS, HSK1_LEVEL } from '@/data/hsk.ts';
import { vocabulary } from '@/data/vocabulary.ts';
import { currentStreak } from '@/domain/daily.ts';
import { useWordStatuses } from '@/features/vocabulary/vocabularyStore.ts';
import { useProgress } from '@/features/progress/useProgress.ts';
import { usePersistentState } from '@/shared/hooks/usePersistentState.ts';
import Meter from '@/shared/ui/Meter.tsx';
import { t } from '@/shared/i18n/en.ts';
import {
  classesPath,
  lessonPath,
  levelCharsPath,
  levelPath,
  readingPath,
  statsPath,
  vocabularyPath,
} from '@/shared/paths.ts';
import {
  continueIndex,
  lessonsDone,
  normalizeLessonKey,
} from '@/features/lesson/lessonNav.ts';
import WriteIcon from '@/shared/ui/WriteIcon.tsx';
import ThemeControl from '@/features/settings/ThemeControl.tsx';
import JourneyCard from '@/features/journey/JourneyCard.tsx';
import mistyPavilion from '@/features/home/art/misty-pavilion.webp';
import '@/features/home/home.css';

const HERO_CHARS = 4;

type HomeTool = 'write' | 'print';

// Home: continue the journey or the current topic, open the tools, see HSK level progress.
export default function HomePage() {
  const levelPicker = useRef<HTMLDialogElement>(null);
  const [tool, setTool] = useState<HomeTool>('write');
  const chooseLevel = (nextTool: HomeTool) => {
    setTool(nextTool);
    levelPicker.current?.showModal();
  };
  const { progress } = useProgress();
  const statuses = useWordStatuses();
  const [now] = useState(() => Date.now());
  const [lastLesson] = usePersistentState(
    lessonStore,
    'lastLesson',
    normalizeLessonKey,
  );

  const level = HSK1_LEVEL;
  const idx = continueIndex(level, progress, lastLesson);
  const lesson = level.lessons[idx];

  const active = HSK_LEVELS.filter((l) => l.data);
  const upcoming = HSK_LEVELS.filter((l) => !l.data);

  return (
    <main className="app page-frame home">
      <header className="home-head">
        <span className="home-logo" lang="zh-Hans" aria-hidden>
          汉字
        </span>
        <h1>{t.appTitle}</h1>
        <ThemeControl />
      </header>

      <JourneyCard level={level} progress={progress} />

      {lesson && (
        <Link
          className="home-current home-panel"
          to={lessonPath(level.id, lesson.id)}
          aria-labelledby="home-current-title home-current-action"
        >
          <img
            className="home-hills"
            src={mistyPavilion}
            alt=""
            decoding="async"
          />
          <div className="home-current-copy">
            <p className="home-kicker">{t.currentLesson}</p>
            <h2 id="home-current-title">{lesson.title}</h2>
            <p className="home-current-meta">
              HSK {level.id} · {t.lessonN(lesson.id)}
            </p>
          </div>
          <div className="home-current-chars" lang="zh-Hans">
            {lesson.chars.slice(0, HERO_CHARS).map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <span className="home-panel-action" id="home-current-action">
            {t.openLesson}
            <span className="home-chevron" aria-hidden />
          </span>
        </Link>
      )}

      {active.map((l) => {
        if (!l.data) return null;
        const done = lessonsDone(l.data, progress);
        const total = l.data.lessons.length;
        return (
          <Link
            key={l.id}
            className="home-level home-panel"
            to={levelPath(l.id)}
          >
            <span className="home-level-info">
              <b>{t.levelTitle(l.id)}</b>
              <span className="home-level-meta">
                {t.levelMeta(l.chars, l.words)}
              </span>
              <span className="home-level-progress">
                <span>{t.lessonsProgress(done, total)}</span>
                <Meter value={done} max={total} />
              </span>
            </span>
            <span className="home-panel-action">
              {t.viewCourse}
              <span className="home-chevron" aria-hidden />
            </span>
          </Link>
        );
      })}

      <Link className="home-level home-panel" to={classesPath}>
        <span className="home-level-info">
          <b>{t.myClasses}</b>
          <span className="home-level-meta">{t.myClassesDescription}</span>
        </span>
        <span className="home-panel-action">
          {t.viewClasses}
          <span className="home-chevron" aria-hidden />
        </span>
      </Link>

      <Link className="home-level home-panel" to={readingPath}>
        <span className="home-level-info">
          <b>
            {t.reading} <span lang="zh-Hans">阅读</span>
          </b>
          <span className="home-level-meta">{t.readingDescription}</span>
        </span>
        <span className="home-panel-action">
          {t.viewStories}
          <span className="home-chevron" aria-hidden />
        </span>
      </Link>

      <Link className="home-level home-panel" to={vocabularyPath}>
        <span className="home-level-info">
          <b>{t.vocabulary}</b>
          <span className="home-level-meta">{t.vocabularyDescription}</span>
        </span>
        <span className="home-panel-action">
          {t.vocabularyAll}
          <span className="home-chevron" aria-hidden />
        </span>
      </Link>

      <Link className="home-level home-panel" to={statsPath}>
        <span className="home-level-info">
          <b>{t.stats.title}</b>
          <span className="home-level-meta">
            {t.stats.homeMeta(
              currentStreak(progress.daily, now),
              vocabulary.filter(({ w }) => statuses[w] === 'known').length,
              Object.keys(progress.chars).length,
            )}
          </span>
        </span>
        <span className="home-panel-action">
          {t.stats.view}
          <span className="home-chevron" aria-hidden />
        </span>
      </Link>

      {upcoming.length > 0 && (
        <section
          className="home-upcoming"
          aria-labelledby="home-upcoming-title"
        >
          <h2 id="home-upcoming-title">{t.otherLevels}</h2>
          <ul className="home-chips">
            {upcoming.map((l) => (
              <li key={l.id} className="home-chip">
                {t.levelTitle(l.id)}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="home-tools">
        <button
          className="home-tool"
          type="button"
          aria-haspopup="dialog"
          onClick={() => chooseLevel('write')}
        >
          <span className="home-tool-icon">
            <WriteIcon name="pencil" strokeWidth={1.8} />
          </span>
          <b>{t.freeWrite}</b>
        </button>
        <button
          className="home-tool"
          type="button"
          aria-haspopup="dialog"
          onClick={() => chooseLevel('print')}
        >
          <span className="home-tool-icon">
            <WriteIcon name="printer" strokeWidth={1.8} />
          </span>
          <b>{t.printPdf}</b>
        </button>
      </section>

      <dialog
        ref={levelPicker}
        className="home-level-picker"
        aria-labelledby="home-level-picker-title"
      >
        <div className="home-level-picker-head">
          <h2 id="home-level-picker-title">
            {t.chooseHskLevel(tool === 'write' ? t.freeWrite : t.printPdf)}
          </h2>
          <form method="dialog">
            <button className="home-level-picker-close" aria-label={t.close}>
              ×
            </button>
          </form>
        </div>
        <div className="home-level-picker-options">
          {HSK_LEVELS.map((l) =>
            l.data?.chars.length ? (
              <Link
                key={l.id}
                className="btn"
                to={levelCharsPath(
                  l.id,
                  tool === 'write' ? 'write' : undefined,
                )}
                onClick={() => {
                  if (tool === 'write') {
                    hskStore.set(hskSelectionKey(l.id, true), []);
                  }
                  levelPicker.current?.close();
                }}
              >
                {t.levelTitle(l.id)}
              </Link>
            ) : (
              <button key={l.id} className="btn" type="button" disabled>
                {t.levelTitle(l.id)} <span>{t.soon}</span>
              </button>
            ),
          )}
        </div>
      </dialog>
    </main>
  );
}
