import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties, RefObject } from 'react';
import Meter from '../../shared/ui/Meter.tsx';
import { Link } from 'react-router';
import type { LevelData } from '../../data/hsk.ts';
import { DAILY_GOAL, currentStreak, todayXp } from '../../domain/daily.ts';
import { stars, t } from '../../shared/i18n/en.ts';
import { courseExerciseArt } from '../lesson/courseExerciseArt.ts';
import hillsArt from '../lesson/art/level/hills.webp';
import type { Progress } from '../progress/progress.ts';
import { loadSessions } from '../progress/sessionStore.ts';
import { isDone, placeJourney } from './journey.ts';
import type { PlacedNode, PlacedRegion } from './journey.ts';
import { GLYPH, continueLabel } from './journeyLabels.ts';
import './journey.css';

// Height of one step on the path, in px.
const ROW = 124;
// Horizontal swing of the path, in % of the width either side of the middle.
const SWING = 26;

// x in % of the map width for the k-th step of the whole journey: a slow winding river.
const xAt = (k: number) => 50 + SWING * Math.sin(k * 0.9);

// Smooth curve from one step to the next (viewBox: x 0..100, y in px).
const segment = (x0: number, y0: number, x1: number, y1: number) =>
  `M${x0} ${y0} C${x0} ${y0 + ROW / 2} ${x1} ${y1 - ROW / 2} ${x1} ${y1}`;

const reducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

// The journey tab of a level: streak and daily XP on top, then each course lesson as a
// region of steps along a winding ink path. Nothing is locked; the step to continue with
// is marked and scrolled into view.
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
    nextRef.current?.scrollIntoView?.({
      block: 'center',
      behavior: reducedMotion() ? 'auto' : 'smooth',
    });
  }, []);

  const streak = currentStreak(progress.daily, now);
  const xp = todayXp(progress.daily, now);

  // Index of each region's first step over the whole journey, so the river keeps winding
  // across regions.
  const starts = regions.map((_, ri) =>
    regions.slice(0, ri).reduce((n, r) => n + r.nodes.length, 0),
  );
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

      {regions.map((region, ri) => {
        const start = starts[ri] ?? 0;
        return (
          <Region
            key={region.lesson.id}
            region={region}
            start={start}
            next={next}
            open={open}
            onOpen={(id) => setOpen((o) => (o === id ? undefined : id))}
            nextRef={nextRef}
          />
        );
      })}
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
  start,
  next,
  open,
  onOpen,
  nextRef,
}: {
  region: PlacedRegion;
  start: number;
  next: string | undefined;
  open: string | undefined;
  onOpen: (id: string) => void;
  nextRef: RefObject<HTMLButtonElement | null>;
}) {
  const { lesson, nodes } = region;
  const height = nodes.length * ROW;
  const points = nodes.map((_, i) => ({
    x: xAt(start + i),
    y: ROW * (i + 0.5),
  }));
  const sealed = nodes.some(
    (n) => n.node.kind === 'checkpoint' && isDone(n.status),
  );
  const art = courseExerciseArt[lesson.id]?.words ?? hillsArt;

  return (
    <div className={'journey-region' + (sealed ? ' sealed' : '')}>
      <div className="journey-banner">
        <img src={art} alt="" loading="lazy" />
        <span className="journey-banner-text">
          <b>{t.lessonN(lesson.id)}</b>
          <span lang="zh-Hans">第{lesson.id}课</span>
        </span>
        {sealed && (
          <span
            className="journey-banner-seal"
            lang="zh-Hans"
            aria-hidden="true"
          >
            印
          </span>
        )}
      </div>

      <div className="journey-path" style={{ height }}>
        <svg
          className="journey-river"
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
                d={segment(from.x, from.y, p.x, p.y)}
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
    </div>
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
  const kind = t.journey.kinds[node.kind];
  const title = t.journey.nodeTitle(kind, node.part);
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
      style={{ top: y, '--fill': `${fill}%` } as CSSProperties}
    >
      <button
        ref={nextRef}
        type="button"
        className="journey-dot"
        style={{ left: `${x}%` }}
        aria-expanded={open}
        aria-controls={popId}
        aria-label={`${title}${status.stars ? ` · ${stars(status.stars)}` : ''}`}
        onClick={onOpen}
      >
        <span className="journey-glyph" lang="zh-Hans" aria-hidden="true">
          {GLYPH[node.kind]}
        </span>
        {partial ? (
          <span className="journey-partial" aria-hidden="true">
            {t.journey.partial(partial.done, partial.total)}
          </span>
        ) : (
          status.stars > 0 && (
            <span className="journey-stars" aria-hidden="true">
              {stars(status.stars)}
            </span>
          )
        )}
        {isNext && (
          <span className="journey-here" aria-hidden="true">
            {node.kind === 'review' ? t.journey.review : t.journey.youAreHere}
          </span>
        )}
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
