import { Link, Navigate, useParams, useSearchParams } from 'react-router';
import { lessonStore } from './lessonStore.ts';
import { levelData } from '../../data/hsk.ts';
import HskChars from '../hsk/HskChars.tsx';
import { useProgress } from '../progress/useProgress.ts';
import { usePersistentState } from '../../shared/hooks/usePersistentState.ts';
import Seg from '../../shared/ui/Seg.tsx';
import { t } from '../../shared/i18n/en.ts';
import { COURSE_LESSONS } from '../../data/courseLessons.ts';
import activitiesArt from './art/level/activities.webp';
import animalsArt from './art/level/animals.webp';
import clothesArt from './art/level/clothes.webp';
import datesArt from './art/level/dates.webp';
import familyArt from './art/level/family.webp';
import feelingsArt from './art/level/feelings.webp';
import foodArt from './art/level/food.webp';
import functionWordsArt from './art/level/function-words.webp';
import hillsArt from './art/level/hills.webp';
import homeArt from './art/level/home.webp';
import introductionsArt from './art/level/introductions.webp';
import leisureArt from './art/level/leisure.webp';
import numbersArt from './art/level/numbers.webp';
import peopleArt from './art/level/people.webp';
import politenessArt from './art/level/politeness.webp';
import quantityArt from './art/level/quantity.webp';
import roadArt from './art/level/road.webp';
import schoolArt from './art/level/school.webp';
import shoppingArt from './art/level/shopping.webp';
import speakingArt from './art/level/speaking.webp';
import timeArt from './art/level/time.webp';
import whereArt from './art/level/where.webp';
import {
  continueIndex,
  courseLessonPath,
  lessonPath,
  lessonsDone,
  normalizeLessonKey,
  statusOf,
} from './lessonNav.ts';
import '../../shared/ui/page.css';
import './level.css';

type Tab = 'lessons' | 'topics' | 'chars';
const TABS = [
  ['lessons', t.tabLessons],
  ['topics', t.tabTopics],
  ['chars', t.tabAllChars],
] as const;

const TOPIC_ART: Partial<Record<number, string>> = {
  1: numbersArt,
  2: peopleArt,
  3: familyArt,
  4: introductionsArt,
  5: politenessArt,
  6: quantityArt,
  7: datesArt,
  8: timeArt,
  9: foodArt,
  10: shoppingArt,
  11: whereArt,
  12: functionWordsArt,
  13: schoolArt,
  14: speakingArt,
  15: homeArt,
  16: activitiesArt,
  17: roadArt,
  18: leisureArt,
  19: clothesArt,
  20: feelingsArt,
  21: animalsArt,
};

// URL value → tab; no or unknown value opens Topics (the themed list older links point to).
const toTab = (raw: string | null): Tab =>
  raw === 'lessons' || raw === 'chars' ? raw : 'topics';

// One HSK level: lessons, its themed topics, or the full character list with Write / Print PDF.
// The tab lives in the URL (?tab=lessons, ?tab=chars) so links can open it directly.
export default function LevelPage() {
  const level = levelData(useParams().level);
  const [params, setParams] = useSearchParams();
  const tab = toTab(params.get('tab'));
  const writingOnly = tab === 'chars' && params.get('mode') === 'write';
  const { progress } = useProgress();
  const [lastLesson] = usePersistentState(
    lessonStore,
    'lastLesson',
    normalizeLessonKey,
  );

  if (!level) return <Navigate to="/" replace />;

  const next = continueIndex(level, progress, lastLesson);
  const done = lessonsDone(level, progress);

  return (
    <main className="app hsk-page hsk-level">
      <div className="hsk-screen">
        <header className="level-header">
          <Link className="hsk-back" to="/">
            <span className="level-chevron" aria-hidden="true" />
            {t.homeLabel}
          </Link>
          <div className="hsk-title">
            <h1>{t.levelTitle(level.id)}</h1>
            <span>
              {t.levelMeta(level.chars.length, level.words.length)} ·{' '}
              {t.topicsDone(done, level.lessons.length)}
            </span>
          </div>
        </header>

        <div className="hsk-tabs">
          <Seg
            value={tab}
            options={TABS}
            onChange={(v) =>
              setParams(v === 'topics' ? {} : { tab: v }, { replace: true })
            }
          />
        </div>

        {tab === 'chars' ? (
          <HskChars
            key={`${level.id}:${writingOnly}`}
            level={level}
            writingOnly={writingOnly}
          />
        ) : tab === 'lessons' ? (
          <ol className="lesson-list">
            {COURSE_LESSONS.map((l) => (
              <li key={l.id}>
                <Link
                  className="lesson-row"
                  to={courseLessonPath(level.id, l.id)}
                >
                  <span className="lesson-num">{l.id}</span>
                  <span className="lesson-main">
                    <span className="lesson-title">{t.lessonN(l.id)}</span>
                  </span>
                  <span className="lesson-meta">
                    <span className="level-chevron" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        ) : (
          <ol className="lesson-list">
            {level.lessons.map((l, i) => {
              const s = statusOf(progress, level, i);
              return (
                <li key={l.id}>
                  <Link
                    className={
                      'lesson-row topic-row' +
                      (s.complete ? ' done' : '') +
                      (i === next ? ' next' : '')
                    }
                    to={lessonPath(level.id, l.id)}
                  >
                    <img
                      className={
                        'topic-art' +
                        (l.id === 7 ? ' dates' : l.id >= 8 ? ' vignette' : '')
                      }
                      src={TOPIC_ART[l.id] ?? hillsArt}
                      alt=""
                      loading={i < 7 ? 'eager' : 'lazy'}
                    />
                    <span className="lesson-num">
                      {s.complete ? '✓' : l.id}
                    </span>
                    <span className="lesson-main">
                      <span className="lesson-title">
                        {l.title}
                        {i === next && (
                          <span className="lesson-badge">{t.nextUp}</span>
                        )}
                      </span>
                      <span className="lesson-chars" lang="zh-Hans">
                        {l.chars.join('')}
                      </span>
                    </span>
                    <span className="lesson-meta">
                      <span className="lesson-count">
                        {t.exercisesDone(s.done, s.total)}
                      </span>
                      <span className="level-chevron" aria-hidden="true" />
                    </span>
                    <span className="lesson-progress" aria-hidden="true">
                      {Array.from({ length: s.total }, (_, segment) => (
                        <span
                          key={segment}
                          className={segment < s.done ? 'filled' : undefined}
                        />
                      ))}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </main>
  );
}
