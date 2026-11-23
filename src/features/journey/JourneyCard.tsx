import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import type { LevelData } from '../../data/hsk.ts';
import { DAILY_GOAL, currentStreak, todayXp } from '../../domain/daily.ts';
import { t } from '../../shared/i18n/en.ts';
import Meter from '../../shared/ui/Meter.tsx';
import { journeyPath } from '../../shared/paths.ts';
import type { Progress } from '../progress/progress.ts';
import { loadSessions } from '../progress/sessionStore.ts';
import { isDone, placeJourney } from './journey.ts';
import { continueLabel, stepTitle } from './journeyLabels.ts';
import './journeyCard.css';

// Home page card: the next journey step (resumed where it was left), the streak, today's
// XP and how much of the journey is done.
export default function JourneyCard({
  level,
  progress,
}: {
  level: LevelData;
  progress: Progress;
}) {
  const [now] = useState(() => Date.now());
  const [sessions] = useState(() => loadSessions(now));
  const { next, done, total } = useMemo(
    () => placeJourney(level.id, progress, now, sessions),
    [level.id, progress, now, sessions],
  );
  const streak = currentStreak(progress.daily, now);
  const xp = todayXp(progress.daily, now);
  const partial =
    next && !isDone(next.status) ? next.status.partial : undefined;
  const kind = next?.node.kind;
  const title = !next
    ? t.journey.allDone
    : kind === 'review'
      ? stepTitle(next)
      : t.lessonN(next.node.lesson);

  return (
    <section className="journey-card" aria-labelledby="journey-card-title">
      <div className="journey-card-content">
        <p className="home-kicker">
          {t.levelTitle(level.id)} · {t.tabJourney}
        </p>
        <h2 id="journey-card-title">{title}</h2>
        {next && kind !== 'review' && (
          <p className="journey-card-step">
            {kind === 'story' ? t.journey.storyHeading : stepTitle(next)}
          </p>
        )}
        {partial && (
          <div className="journey-card-progress journey-card-partial">
            <span>{t.journey.partial(partial.done, partial.total)}</span>
            <Meter value={partial.done} max={partial.total} />
          </div>
        )}
        <div className="journey-card-actions">
          {next && (
            <Link className="journey-card-cta" to={next.node.href}>
              {kind === 'story' && !partial
                ? t.journey.startStory
                : continueLabel(next)}
              <span aria-hidden>→</span>
            </Link>
          )}
          <Link
            className={next ? 'journey-card-link' : 'journey-card-cta'}
            to={journeyPath(level.id)}
          >
            {t.journey.viewJourney}
          </Link>
        </div>
      </div>

      <div className="journey-card-footer">
        <div className="journey-card-progress">
          <span>{t.journey.stepsDone(done, total)}</span>
          <Meter value={done} max={total} />
        </div>
        <div className="journey-card-stats">
          <span className={streak > 0 ? 'is-active' : undefined}>
            {t.journey.streakDays(streak)}
          </span>
          <span title={t.journey.xpLabel(xp, DAILY_GOAL)}>
            {t.journey.xpShort(xp, DAILY_GOAL)} XP
          </span>
        </div>
      </div>
    </section>
  );
}
