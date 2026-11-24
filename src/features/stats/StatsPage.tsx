import { useState } from 'react';
import { Link } from 'react-router';
import { HSK1_LEVEL } from '@/data/hsk.ts';
import { vocabulary } from '@/data/vocabulary.ts';
import { DAILY_GOAL, currentStreak, todayXp } from '@/domain/daily.ts';
import { dueItems } from '@/domain/srs.ts';
import PageToolbar from '@/features/settings/PageToolbar.tsx';
import {
  activityCalendar,
  activityLevel,
  activityTotals,
  charStats,
  recentChars,
  weakChars,
  wordStats,
  type CharSummary,
} from '@/features/stats/stats.ts';
import { useProgress } from '@/features/progress/useProgress.ts';
import {
  useWordStatuses,
  type WordStatus,
} from '@/features/vocabulary/vocabularyStore.ts';
import { t } from '@/shared/i18n/en.ts';
import { journeyReviewPath, vocabularyPath } from '@/shared/paths.ts';
import Meter from '@/shared/ui/Meter.tsx';
import '@/features/stats/stats.css';

const WEEKS = 12;
const LIST_SIZE = 10;
const hsk1Chars = HSK1_LEVEL.chars.map(({ c }) => c);

// One term of a <dl>: the parent list styles it as a tile or a counter.
function Stat({
  label,
  value,
  status,
  hint,
}: {
  label: string;
  value: string | number;
  status?: WordStatus;
  hint?: string;
}) {
  return (
    <div data-word-status={status} title={hint}>
      <dt>{label}</dt>
      <dd>{value}</dd>
    </div>
  );
}

function CharList({
  chars,
  empty,
}: {
  chars: readonly CharSummary[];
  empty: string;
}) {
  if (!chars.length) return <p className="stats-empty">{empty}</p>;
  return (
    <ul className="stats-chars" role="list">
      {chars.map(({ char, best, attempts }) => (
        <li
          key={char}
          aria-label={t.stats.charLabel(char, best, attempts)}
          title={t.stats.charLabel(char, best, attempts)}
        >
          <b lang="zh-Hans" aria-hidden>
            {char}
          </b>
          <span className="stats-stars" aria-hidden>
            {'★'.repeat(best)}
            <span>{'★'.repeat(3 - best)}</span>
          </span>
        </li>
      ))}
    </ul>
  );
}

export default function StatsPage() {
  const { progress } = useProgress();
  const statuses = useWordStatuses();
  // One "now" per visit, as on the journey map.
  const [now] = useState(() => Date.now());

  const streak = currentStreak(progress.daily, now);
  const calendar = activityCalendar(progress, now, WEEKS);
  const totals = activityTotals(progress, now, WEEKS * 7);
  const words = wordStats(progress, statuses, vocabulary);
  const hsk1 = wordStats(progress, statuses, HSK1_LEVEL.words);
  const chars = charStats(progress, hsk1Chars);
  const due = dueItems(progress.srs ?? {}, now).length;

  return (
    <main className="app page-frame stats-page">
      <header className="page-header">
        <PageToolbar back={{ to: '/', children: t.homeLabel }}>
          <Link className="toolbar-link" to={vocabularyPath}>
            {t.vocabulary}
          </Link>
        </PageToolbar>
        <h1>{t.stats.title}</h1>
        <p>{t.stats.description}</p>
      </header>

      <dl className="stats-tiles">
        <Stat label={t.stats.streak} value={t.stats.streakValue(streak)} />
        <Stat
          label={t.stats.today}
          value={t.stats.todayValue(todayXp(progress.daily, now), DAILY_GOAL)}
        />
        <Stat
          label={t.stats.activeDays}
          value={t.stats.activeDaysValue(totals.activeDays, WEEKS)}
        />
      </dl>

      <section className="stats-card" aria-labelledby="stats-activity">
        <h2 id="stats-activity">{t.stats.activity}</h2>
        <div
          className="stats-calendar"
          role="img"
          aria-label={t.stats.activityLabel(totals.activeDays, WEEKS)}
        >
          {calendar.map((week) => (
            <div key={week[0]?.day} className="stats-week">
              {week.map(({ day, activity }) => (
                <span
                  key={day}
                  data-level={activityLevel(activity, DAILY_GOAL)}
                  title={t.stats.dayTitle(
                    day,
                    activity?.xp ?? 0,
                    activity?.chars ?? 0,
                    activity?.answers ?? 0,
                  )}
                />
              ))}
            </div>
          ))}
        </div>
        <div className="stats-legend" aria-hidden>
          {t.stats.less}
          {[0, 1, 2, 3, 4].map((level) => (
            <span key={level} data-level={level} />
          ))}
          {t.stats.more}
        </div>
        {!progress.history && (
          <p className="stats-empty">{t.stats.historyNote}</p>
        )}
      </section>

      <section className="stats-card" aria-labelledby="stats-words">
        <h2 id="stats-words">
          <Link to={vocabularyPath}>{t.stats.words}</Link>
        </h2>
        <dl className="stats-counts">
          <Stat status="known" label={t.stats.wordsKnown} value={words.known} />
          <Stat
            status="learning"
            label={t.stats.wordsLearning}
            value={words.learning}
          />
          <Stat status="new" label={t.stats.wordsNew} value={words.fresh} />
          <Stat
            label={`✍ ${t.stats.wordsWritten}`}
            value={words.written}
            hint={t.stats.wordsWrittenHint}
          />
          <Stat
            label={`◉ ${t.stats.wordsRemembered}`}
            value={words.remembered}
            hint={t.stats.wordsRememberedHint}
          />
        </dl>
      </section>

      <section className="stats-card" aria-labelledby="stats-hsk1">
        <h2 id="stats-hsk1">{t.stats.hsk1}</h2>
        <ul className="stats-meters" role="list">
          {(
            [
              [t.stats.hsk1Words, hsk1.known, hsk1.total],
              [t.stats.hsk1WordsWritten, hsk1.written, hsk1.total],
              [t.stats.hsk1Chars, chars.levelWritten, chars.levelTotal],
            ] as const
          ).map(([label, value, max]) => (
            <li key={label(value, max)}>
              <span>{label(value, max)}</span>
              <Meter value={value} max={max} />
            </li>
          ))}
        </ul>
      </section>

      <section className="stats-card" aria-labelledby="stats-chars">
        <h2 id="stats-chars">{t.stats.characters}</h2>
        <dl className="stats-counts">
          <Stat label={t.stats.charsWritten} value={chars.written} />
          <Stat label={t.stats.charsMastered} value={chars.mastered} />
        </dl>
        <h3>{t.stats.recent}</h3>
        <CharList
          chars={recentChars(progress, LIST_SIZE)}
          empty={t.stats.recentEmpty}
        />
        <h3>{t.stats.weak}</h3>
        <CharList
          chars={weakChars(progress, LIST_SIZE)}
          empty={chars.written ? t.stats.weakEmpty : t.stats.recentEmpty}
        />
      </section>

      <section className="stats-card" aria-labelledby="stats-review">
        <h2 id="stats-review">{t.stats.review}</h2>
        {due > 0 ? (
          <div className="stats-review">
            <span>{t.stats.reviewCount(due)}</span>
            <Link className="stats-button" to={journeyReviewPath('1')}>
              {t.stats.reviewStart}
            </Link>
          </div>
        ) : (
          <p className="stats-empty">{t.stats.reviewEmpty}</p>
        )}
      </section>
    </main>
  );
}
