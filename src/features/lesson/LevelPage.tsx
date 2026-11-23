import { Navigate, useSearchParams } from 'react-router';
import { lessonStore } from '@/features/lesson/lessonStore.ts';
import HskChars from '@/features/hsk/HskChars.tsx';
import { useProgress } from '@/features/progress/useProgress.ts';
import PageToolbar from '@/features/settings/PageToolbar.tsx';
import { usePersistentState } from '@/shared/hooks/usePersistentState.ts';
import Seg from '@/shared/ui/Seg.tsx';
import { t } from '@/shared/i18n/en.ts';
import { COURSE_LESSONS } from '@/data/courseLessons.ts';
import JourneyMap from '@/features/journey/JourneyMap.tsx';
import { courseLessonPath, lessonPath } from '@/shared/paths.ts';
import {
  continueIndex,
  lessonsDone,
  normalizeLessonKey,
  statusOf,
} from '@/features/lesson/lessonNav.ts';
import { art } from '@/features/lesson/art/index.ts';
import LevelCard from '@/features/lesson/LevelCard.tsx';
import { useLevelParam } from '@/features/lesson/lessonRoute.ts';
import '@/shared/ui/page.css';
import '@/features/lesson/level.css';

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
  7: {
    title: '第七课',
    words: '现在 · 几点 · 分钟 · 电影院',
    art: art('alarm-clock'),
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
          <PageToolbar
            back={{
              to: '/',
              icon: 'chevron',
              className: 'hsk-back',
              children: t.homeLabel,
            }}
          />
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
                  <LevelCard
                    variant="lesson"
                    to={courseLessonPath(level.id, lesson.id)}
                    number={lesson.id}
                    title={
                      <>
                        {t.lessonN(lesson.id)}
                        {preview && (
                          <>
                            <span aria-hidden="true"> · </span>
                            <span lang="zh-Hans">{preview.title}</span>
                          </>
                        )}
                      </>
                    }
                    preview={preview?.words}
                    art={preview && { src: preview.art }}
                  />
                </li>
              );
            })}
          </ol>
        ) : (
          <ol className="lesson-list">
            {level.lessons.map((topic, index) => (
              <li key={topic.id}>
                <LevelCard
                  variant="topic"
                  to={lessonPath(level.id, topic.id)}
                  number={topic.id}
                  title={topic.title}
                  preview={topic.chars.join('')}
                  art={{
                    src: TOPIC_ART[topic.id - 1] ?? art('hills'),
                    style:
                      topic.id === 7
                        ? 'dates'
                        : topic.id >= 8
                          ? 'vignette'
                          : undefined,
                    loading: index < 7 ? 'eager' : 'lazy',
                  }}
                  progress={statusOf(progress, level, index)}
                  next={index === next}
                />
              </li>
            ))}
          </ol>
        )}
      </div>
    </main>
  );
}
