import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { hskSelectionKey, hskStore } from '../hsk/hskStore.ts';
import { lessonStore } from '../lesson/lessonStore.ts';
import { HSK_LEVELS, HSK1_LEVEL } from '../../data/hsk.ts';
import { useProgress } from '../progress/useProgress.ts';
import { usePersistentState } from '../../shared/hooks/usePersistentState.ts';
import { LAYOUT } from '../../shared/theme.ts';
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
import { PencilIcon, PrinterIcon } from './HomeArt.tsx';
import bambooWash from './art/bamboo-wash.webp';
import mistyPavilion from './art/misty-pavilion.webp';
import plumBlossom from './art/plum-blossom.webp';
import './home.css';

const HERO_CHARS = 4;
const pct = (done: number, total: number) =>
  total ? Math.round((100 * done) / total) : 0;

type HomeTool = 'write' | 'print';

// Home: continue the current lesson, open the tools, see HSK level progress.
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
    <div className="app home" style={{ maxWidth: LAYOUT.maxWidth }}>
      <img className="home-plum" src={plumBlossom} alt="" decoding="async" />
      <header className="home-head">
        <span className="home-logo" aria-hidden>
          汉字
        </span>
        <h1>{t.appTitle}</h1>
      </header>

      {lesson && status && (
        <section className="home-hero">
          <img
            className="home-hills"
            src={mistyPavilion}
            alt=""
            decoding="async"
          />
          <h2 className="home-rule-label">{t.currentLesson}</h2>
          <p className="home-hero-title">
            HSK {level.id} · {t.lessonN(lesson.id)}
          </p>
          <p className="home-hero-sub">“{lesson.title}”</p>
          <div className="home-hero-chars" lang="zh">
            {lesson.chars.slice(0, HERO_CHARS).map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
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
        </section>
      )}

      <section className="home-tools">
        <button
          className="home-tool"
          type="button"
          aria-haspopup="dialog"
          onClick={() => chooseLevel('write')}
        >
          <PencilIcon />
          <b>{t.freeWrite}</b>
        </button>
        <button
          className="home-tool"
          type="button"
          aria-haspopup="dialog"
          onClick={() => chooseLevel('print')}
        >
          <PrinterIcon />
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
          </Link>
        );
      })}

      {upcoming.length > 0 && (
        <section className="home-upcoming">
          <h2 className="home-rule-label home-rule-label-lg">
            {t.otherLevels}
          </h2>
          <div className="home-chips">
            {upcoming.map((l) => (
              <div key={l.id} className="home-chip" aria-disabled>
                <b>HSK {l.id}</b>
                <span className="home-soon">{t.soon}</span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
