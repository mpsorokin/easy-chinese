import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import Meter from '@/shared/ui/Meter.tsx';
import { Link } from 'react-router';
import type { LevelData } from '@/data/hsk.ts';
import { DAILY_GOAL, currentStreak, todayXp } from '@/domain/daily.ts';
import { stars, t } from '@/shared/i18n/en.ts';
import type { Progress } from '@/features/progress/progress.ts';
import { loadSessions } from '@/features/progress/sessionStore.ts';
import { isDone, placeJourney } from '@/features/journey/journey.ts';
import type { PlacedNode, PlacedRegion } from '@/features/journey/journey.ts';
import {
  GLYPH,
  continueLabel,
  stepTitle,
} from '@/features/journey/journeyLabels.ts';
import '@/features/journey/journey.css';

const STEP_GAP = 102;
const FIRST_STOP = 62;
const DETAILS_SPACE = 116;
const TRAIL_POSITIONS = [23, 59, 20, 55, 23, 60];

type Point = { x: number; y: number };

function segment(from: Point, to: Point) {
  const mid = (from.y + to.y) / 2;
  return `M${from.x} ${from.y} C${from.x} ${mid} ${to.x} ${mid} ${to.x} ${to.y}`;
}

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function JourneyMap({
  level,
  progress,
}: {
  level: LevelData;
  progress: Progress;
}) {
  // One "now" per visit, so the review step does not flicker while answering elsewhere.
  const [now] = useState(() => Date.now());
  // Unfinished rounds, read once per visit (they only change on other pages).
  const [sessions] = useState(() => loadSessions(now));
  const placed = useMemo(
    () => placeJourney(level.id, progress, now, sessions),
    [level.id, progress, now, sessions],
  );
  const { regions } = placed;
  const nextNode = placed.next;
  const next = nextNode?.node.id;
  const [open, setOpen] = useState<string>();
  const nextRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const button = nextRef.current;
    if (!button) return;
    const bounds = button.getBoundingClientRect();
    if (bounds.top < 0 || bounds.bottom > window.innerHeight) {
      button.scrollIntoView?.({
        block: 'center',
        behavior: reducedMotion() ? 'auto' : 'smooth',
      });
    }
  }, [next]);

  const streak = currentStreak(progress.daily, now);
  const xp = todayXp(progress.daily, now);

  return (
    <section className="journey" aria-label={t.tabJourney}>
      <header className="journey-head">
        <span
          className={'journey-streak' + (streak > 0 ? ' lit' : '')}
          title={t.journey.streakLabel}
        >
          <span aria-hidden="true">🔥</span>
          <b>{t.journey.streak(streak)}</b>
        </span>
        <XpRing xp={xp} />
        {nextNode ? (
          <Link
            className="btn primary journey-continue"
            to={nextNode.node.href}
          >
            {continueLabel(nextNode)}
          </Link>
        ) : (
          <span className="journey-all-done">{t.journey.allDone}</span>
        )}
      </header>

      <div className="journey-landscape">
        {regions.map((region) => (
          <Region
            key={region.lesson.id}
            region={region}
            next={next}
            open={open}
            onOpen={(id) => setOpen((o) => (o === id ? undefined : id))}
            nextRef={nextRef}
          />
        ))}
      </div>
    </section>
  );
}

function XpRing({ xp }: { xp: number }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const share = Math.min(1, xp / DAILY_GOAL);
  return (
    <span
      className={'journey-xp' + (share >= 1 ? ' met' : '')}
      title={share >= 1 ? t.journey.goalMet : undefined}
    >
      <svg viewBox="0 0 36 36" aria-hidden="true">
        <circle className="journey-xp-track" cx="18" cy="18" r={r} />
        <circle
          className="journey-xp-fill"
          cx="18"
          cy="18"
          r={r}
          strokeDasharray={`${c * share} ${c}`}
        />
      </svg>
      <span className="journey-xp-text">
        <b>{t.journey.xpShort(xp, DAILY_GOAL)}</b> XP
      </span>
      <span className="visually-hidden">
        {t.journey.xpLabel(xp, DAILY_GOAL)}
      </span>
    </span>
  );
}

function Region({
  region,
  next,
  open,
  onOpen,
  nextRef,
}: {
  region: PlacedRegion;
  next: string | undefined;
  open: string | undefined;
  onOpen: (id: string) => void;
  nextRef: RefObject<HTMLButtonElement | null>;
}) {
  const { lesson, nodes } = region;
  const openAt = open ? nodes.findIndex(({ node }) => node.id === open) : -1;
  const height =
    FIRST_STOP +
    (nodes.length - 1) * STEP_GAP +
    64 +
    (openAt < 0 ? 0 : DETAILS_SPACE);
  const points = nodes.map((_, i) => ({
    x: TRAIL_POSITIONS[i % TRAIL_POSITIONS.length]!,
    y:
      FIRST_STOP +
      i * STEP_GAP +
      (openAt >= 0 && i > openAt ? DETAILS_SPACE : 0),
  }));
  const sealed = nodes.some(
    (n) => n.node.kind === 'checkpoint' && isDone(n.status),
  );
  const headingId = `journey-lesson-${lesson.id}`;

  return (
    <section className="journey-region" aria-labelledby={headingId}>
      <header className="journey-banner">
        <h2 id={headingId}>{t.lessonN(lesson.id)}</h2>
        <span lang="zh-Hans">{t.journey.lessonZh(lesson.id)}</span>
        {sealed && (
          <span
            className="journey-banner-seal"
            lang="zh-Hans"
            aria-hidden="true"
          >
            印
          </span>
        )}
      </header>

      <div className="journey-path" style={{ height }}>
        <svg
          className="journey-trail"
          viewBox={`0 0 100 ${height}`}
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          {points.slice(1).map((p, i) => {
            const from = points[i]!;
            const done = isDone(nodes[i]!.status);
            const leadsToNext = nodes[i + 1]!.node.id === next;
            return (
              <path
                key={i}
                d={segment(from, p)}
                className={
                  'journey-seg' +
                  (done ? ' done' : '') +
                  (done && leadsToNext ? ' fresh' : '')
                }
              />
            );
          })}
        </svg>

        <ol className="journey-nodes">
          {nodes.map((n, i) => (
            <Node
              key={n.node.id}
              placed={n}
              x={points[i]!.x}
              y={points[i]!.y}
              isNext={n.node.id === next}
              open={open === n.node.id}
              onOpen={() => onOpen(n.node.id)}
              nextRef={n.node.id === next ? nextRef : undefined}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}

function Node({
  placed,
  x,
  y,
  isNext,
  open,
  onOpen,
  nextRef,
}: {
  placed: PlacedNode;
  x: number;
  y: number;
  isNext: boolean;
  open: boolean;
  onOpen: () => void;
  nextRef?: RefObject<HTMLButtonElement | null>;
}) {
  const { node, status } = placed;
  const title = stepTitle(placed);
  const hint =
    node.kind === 'review' && node.count
      ? t.journey.reviewDue(node.count)
      : t.journey.hints[node.kind];
  const popId = `journey-pop-${node.id.replace(/[^a-z0-9]/gi, '-')}`;
  const partial = isDone(status) ? undefined : status.partial;
  // An unfinished round fills the circle from the bottom by how far it got.
  const fill = partial
    ? Math.round((100 * partial.done) / Math.max(1, partial.total))
    : 50;
  return (
    <li
      className={
        `journey-node kind-${node.kind} state-${status.state}` +
        (isNext ? ' next' : '') +
        (open ? ' open' : '')
      }
      style={
        { top: y, '--stop': `${x}%`, '--fill': `${fill}%` } as CSSProperties
      }
    >
      <button
        ref={nextRef}
        type="button"
        className="journey-step"
        aria-current={isNext ? 'step' : undefined}
        aria-expanded={open}
        aria-controls={open ? popId : undefined}
        onClick={onOpen}
      >
        <span className="journey-dot" aria-hidden="true">
          <span className="journey-glyph" lang="zh-Hans">
            {GLYPH[node.kind]}
          </span>
          {isNext && (
            <span className="journey-here">
              {node.kind === 'review' ? t.journey.review : t.journey.youAreHere}
            </span>
          )}
        </span>
        <span className="journey-step-copy">
          <span className="journey-step-title">{title}</span>
          {partial ? (
            <span className="journey-partial">
              {t.journey.partial(partial.done, partial.total)}
            </span>
          ) : (
            status.stars > 0 && (
              <span className="journey-stars">{stars(status.stars)}</span>
            )
          )}
        </span>
      </button>
      {open && (
        <div className="journey-pop" id={popId}>
          <div className="journey-pop-text">
            <b>{title}</b>
            <span>{hint}</span>
            {partial && (
              <span className="journey-pop-partial">
                <Meter value={partial.done} max={partial.total} />
                {t.journey.partial(partial.done, partial.total)}
              </span>
            )}
            {node.chars.length > 0 && node.kind !== 'checkpoint' && (
              <span className="journey-pop-chars" lang="zh-Hans">
                {node.chars.join('')}
              </span>
            )}
          </div>
          <Link className="btn primary" to={node.href}>
            {partial
              ? t.journey.resume
              : isDone(status)
                ? t.journey.again
                : t.journey.start}
          </Link>
        </div>
      )}
    </li>
  );
}
