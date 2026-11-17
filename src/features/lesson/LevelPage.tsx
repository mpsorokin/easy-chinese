import { Link, Navigate, useSearchParams } from 'react-router';
import { lessonStore } from './lessonStore.ts';
import HskChars from '../hsk/HskChars.tsx';
import { useProgress } from '../progress/useProgress.ts';
import ThemeControl from '../settings/ThemeControl.tsx';
import { usePersistentState } from '../../shared/hooks/usePersistentState.ts';
import Seg from '../../shared/ui/Seg.tsx';
import { t } from '../../shared/i18n/en.ts';
import { COURSE_LESSONS } from '../../data/courseLessons.ts';
import JourneyMap from '../journey/JourneyMap.tsx';
import {
  continueIndex,
  courseLessonPath,
  lessonPath,
  lessonsDone,
  normalizeLessonKey,
  statusOf,
} from './lessonNav.ts';
import { art } from './art/index.ts';
import { useLevelParam } from './lessonRoute.ts';
import '../../shared/ui/page.css';
import './level.css';

type Tab = 'journey' | 'lessons' | 'topics' | 'chars';
const TABS = [
  ['journey', t.tabJourney],
  ['lessons', t.tabLessons],
  ['topics', t.tabTopics],
  ['chars', t.tabAllChars],
] as const;

const COURSE_LESSON_PREVIEWS: Partial<
  Record<number, { title: string; words: string; art: string }>
> = {
  1: {
    title: '第一课',
    words: '小学生 · 同学们 · 正在 · 客气',
    art: art('teacher'),
  },
  2: {
    title: '第二课',
    words: '请问 · 对不起 · 没关系 · 认识',
    art: art('name-card'),
  },
  3: {
    title: '第三课',
    words: '哪个 · 女朋友 · 漂亮 · 喜欢',
    art: art('globe'),
  },
  4: {
    title: '第四课',
    words: '口 · 女儿 · 岁 · 都',
    art: art('household'),
  },
  5: {
    title: '第五课',
    words: '星期日 · 面条儿 · 饺子 · 非常',
    art: art('noodles'),
  },
  6: {
    title: '第六课',
    words: '打电话 · 东西 · 怎么 · 出租车',
    art: art('taxi'),
  },
};

// Picture of each topic, in topic order (topic 1 first).
const TOPIC_ART = [
  'numbers',
  'people',
  'family',
  'introductions',
  'politeness',
  'quantity',
  'dates',
  'time',
  'food',
  'shopping',
  'where',
  'function-words',
  'school',
  'speaking',
  'home',
  'activities',
  'road',
  'leisure',
  'clothes',
  'feelings',
  'animals',
].map(art);

// URL value → tab; no or unknown value opens Topics (the themed list older links point to).
const toTab = (raw: string | null): Tab =>
  raw === 'journey' || raw === 'lessons' || raw === 'chars' ? raw : 'topics';

// One HSK level: lessons, its themed topics, or the full character list with Write / Print PDF.
// The tab lives in the URL (?tab=lessons, ?tab=chars) so links can open it directly.
export default function LevelPage() {
  const level = useLevelParam();
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
    <main className="app page-frame hsk-level">
      <div className="hsk-screen">
        <header className="level-header">
          <div className="theme-toolbar">
            <Link className="hsk-back" to="/">
              <span className="level-chevron" aria-hidden="true" />
              {t.homeLabel}
            </Link>
            <ThemeControl />
          </div>
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
              setParams(v === 'topics' ? {} : { tab: v }, {
                replace: true,
                preventScrollReset: true,
              })
            }
          />
        </div>

        {tab === 'journey' ? (
          <JourneyMap level={level} progress={progress} />
        ) : tab === 'chars' ? (
          <HskChars
            key={`${level.id}:${writingOnly}`}
            level={level}
            writingOnly={writingOnly}
          />
        ) : tab === 'lessons' ? (
          <ol className="lesson-list">
            {COURSE_LESSONS.map((lesson) => {
              const preview = COURSE_LESSON_PREVIEWS[lesson.id];
              return (
                <li key={lesson.id}>
                  <Link
                    className="lesson-row course-lesson-row"
                    to={courseLessonPath(level.id, lesson.id)}
                  >
                    <span className="lesson-num" aria-hidden="true">
                      {lesson.id}
                    </span>
                    <span className="lesson-main">
                      <span className="lesson-title">
                        {t.lessonN(lesson.id)}
                        {preview && (
                          <>
                            <span aria-hidden="true"> · </span>
                            <span lang="zh-Hans">{preview.title}</span>
                          </>
                        )}
                      </span>
                      {preview && (
                        <span className="course-lesson-preview" lang="zh-Hans">
                          {preview.words}
                        </span>
                      )}
                    </span>
                    {preview && (
                      <img
                        className="course-lesson-row-art"
                        src={preview.art}
                        alt=""
                        decoding="async"
                      />
                    )}
                    <span className="level-chevron" aria-hidden="true" />
                  </Link>
                </li>
              );
            })}
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
                      src={TOPIC_ART[l.id - 1] ?? art('hills')}
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
