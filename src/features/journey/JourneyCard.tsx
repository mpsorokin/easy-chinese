import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import type { LevelData } from '../../data/hsk.ts';
import { DAILY_GOAL, currentStreak, todayXp } from '../../domain/daily.ts';
import { t } from '../../shared/i18n/en.ts';
import Meter from '../../shared/ui/Meter.tsx';
import { journeyPath } from '../lesson/lessonNav.ts';
import type { Progress } from '../progress/progress.ts';
import { loadSessions } from '../progress/sessionStore.ts';
import { isDone, placeJourney } from './journey.ts';
import { GLYPH, continueLabel, stepTitle } from './journeyLabels.ts';
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
  const started = done > 0 || Boolean(next?.status.partial) || xp > 0;
  const partial =
    next && !isDone(next.status) ? next.status.partial : undefined;

  return (
    <section className="journey-card" aria-labelledby="journey-card-title">
      <div className="journey-card-top">
        <p className="home-kicker">
          {t.tabJourney} · HSK {level.id}
        </p>
        <span className="journey-card-stats">
          <span
            className={'journey-card-streak' + (streak > 0 ? ' lit' : '')}
            title={t.journey.streakLabel}
          >
            <span aria-hidden="true">🔥</span> {t.journey.streak(streak)}
          </span>
          <span title={t.journey.xpLabel(xp, DAILY_GOAL)}>
            {t.journey.xpShort(xp, DAILY_GOAL)} XP
          </span>
        </span>
      </div>

      {next ? (
        <div className="journey-card-next">
          <span
            className={`journey-card-glyph kind-${next.node.kind}`}
            lang="zh-Hans"
            aria-hidden="true"
          >
            {GLYPH[next.node.kind]}
          </span>
          <span className="journey-card-copy">
            <span className="journey-card-label">{t.journey.nextStep}</span>
            <b id="journey-card-title">
              {next.node.kind === 'review'
                ? stepTitle(next)
                : `${t.lessonN(next.node.lesson)} · ${stepTitle(next)}`}
            </b>
            {partial && (
              <span className="journey-card-partial">
                <Meter value={partial.done} max={partial.total} />
                {t.journey.partial(partial.done, partial.total)}
              </span>
            )}
          </span>
        </div>
      ) : (
        <b id="journey-card-title">{t.journey.allDone}</b>
      )}

      <div className="home-progress">
        <span className="home-progress-row">
          <span>{t.journey.stepsDone(done, total)}</span>
        </span>
        <Meter value={done} max={total} />
      </div>

      <div className="journey-card-actions">
        {next && (
          <Link className="home-cta" to={next.node.href}>
            {next.status.partial || next.node.kind === 'review'
              ? continueLabel(next)
              : started
                ? t.journey.continueJourney
                : t.journey.startJourney}
            <span aria-hidden>→</span>
          </Link>
        )}
        <Link className="journey-card-map" to={journeyPath(level.id)}>
          {t.journey.openMap}
        </Link>
      </div>
    </section>
  );
}
