import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { hskSelectionKey, hskStore } from '../hsk/hskStore.ts';
import { lessonStore } from '../lesson/lessonStore.ts';
import { HSK_LEVELS, HSK1_LEVEL } from '../../data/hsk.ts';
import { useProgress } from '../progress/useProgress.ts';
import { usePersistentState } from '../../shared/hooks/usePersistentState.ts';
import Meter from '../../shared/ui/Meter.tsx';
import { t } from '../../shared/i18n/en.ts';
import {
  continueIndex,
  levelCharsPath,
  lessonPath,
  lessonsDone,
  levelPath,
  normalizeLessonKey,
  statusOf,
} from '../lesson/lessonNav.ts';
import { PencilIcon, PrinterIcon } from '../../shared/ui/icons.tsx';
import ThemeControl from '../settings/ThemeControl.tsx';
import JourneyCard from '../journey/JourneyCard.tsx';
import bambooWash from './art/bamboo-wash.webp';
import mistyPavilion from './art/misty-pavilion.webp';
import './home.css';

const HERO_CHARS = 4;
const pct = (done: number, total: number) =>
  total ? Math.round((100 * done) / total) : 0;

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
  const [lastLesson] = usePersistentState(
    lessonStore,
    'lastLesson',
    normalizeLessonKey,
  );

  const level = HSK1_LEVEL;
  const idx = continueIndex(level, progress, lastLesson);
  const lesson = level.lessons[idx];
  const status = idx >= 0 ? statusOf(progress, level, idx) : undefined;
  const done = lessonsDone(level, progress);
  const total = level.lessons.length;
  const percent = pct(done, total);

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

      {lesson && status && (
        <section className="home-hero" aria-labelledby="home-current-title">
          <img
            className="home-hills"
            src={mistyPavilion}
            alt=""
            decoding="async"
          />
          <div className="home-hero-copy">
            <p className="home-kicker">{t.currentLesson}</p>
            <h2 id="home-current-title">{lesson.title}</h2>
            <p className="home-hero-meta">
              HSK {level.id} · {t.lessonN(lesson.id)}
            </p>
          </div>
          <div className="home-hero-chars" lang="zh-Hans">
            {lesson.chars.slice(0, HERO_CHARS).map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <div className="home-hero-actions">
            <div className="home-progress">
              <span className="home-progress-row">
                <span>{t.lessonsProgress(done, total)}</span>
                <span>{t.percent(percent)}</span>
              </span>
              <Meter value={done} max={total} />
            </div>
            <Link className="home-cta" to={lessonPath(level.id, lesson.id)}>
              {status.started ? t.continueLabel : t.startLabel}
              <span aria-hidden>→</span>
            </Link>
          </div>
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
            <PencilIcon />
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
            <PrinterIcon />
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

      {active.map((l) => {
        if (!l.data) return null;
        const d = lessonsDone(l.data, progress);
        const n = l.data.lessons.length;
        return (
          <Link key={l.id} className="home-level" to={levelPath(l.id)}>
            <span className="home-level-info">
              <b>HSK {l.id}</b>
              <span className="home-level-meta">
                {t.levelMeta(l.chars, l.words)}
              </span>
              <span className="home-level-meta">{t.lessonsProgress(d, n)}</span>
              <Meter value={d} max={n} />
            </span>
            <span className="home-level-badge">
              <img
                className="home-bamboo"
                src={bambooWash}
                alt=""
                loading="lazy"
                decoding="async"
              />
              <b>{t.percent(pct(d, n))}</b>
              <span>{t.completed}</span>
            </span>
            <span className="home-level-arrow" aria-hidden>
              ›
            </span>
          </Link>
        );
      })}

      {upcoming.length > 0 && (
        <section className="home-upcoming">
          <h2>{t.otherLevels}</h2>
          <div className="home-chips">
            {upcoming.map((l) => (
              <div key={l.id} className="home-chip" aria-disabled>
                <b>HSK {l.id}</b>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
