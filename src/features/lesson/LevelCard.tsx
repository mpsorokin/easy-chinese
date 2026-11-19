import type { ReactNode } from 'react';
import { Link } from 'react-router';
import { t } from '../../shared/i18n/en.ts';
import './levelCard.css';

type LevelCardProps = {
  variant: 'lesson' | 'topic';
  to: string;
  number: number;
  title: ReactNode;
  preview?: string;
  art?: {
    src: string;
    style?: 'dates' | 'vignette';
    loading?: 'eager' | 'lazy';
  };
  progress?: { done: number; total: number; complete: boolean };
  next?: boolean;
};

export default function LevelCard({
  variant,
  to,
  number,
  title,
  preview,
  art,
  progress,
  next,
}: LevelCardProps) {
  return (
    <Link
      className={
        `level-card level-card--${variant}` +
        (next ? ' level-card--next' : '') +
        (progress?.complete ? ' level-card--done' : '')
      }
      to={to}
    >
      <span className="level-card-number" aria-hidden={variant === 'lesson'}>
        {progress?.complete ? '✓' : number}
      </span>
      <span className="level-card-copy">
        <span className="level-card-title">
          <span>{title}</span>
          {next && <span className="level-card-badge">{t.nextUp}</span>}
        </span>
        {preview && (
          <span className="level-card-preview" lang="zh-Hans">
            {preview}
          </span>
        )}
      </span>
      {art && (
        <img
          className={
            'level-card-art' +
            (art.style ? ` level-card-art--${art.style}` : '')
          }
          src={art.src}
          alt=""
          loading={art.loading}
          decoding="async"
        />
      )}
      <span className="level-card-meta">
        {progress && (
          <span className="level-card-count">
            {t.exercisesDone(progress.done, progress.total)}
          </span>
        )}
        <span className="level-chevron" aria-hidden="true" />
      </span>
      {progress && (
        <span className="level-card-progress" aria-hidden="true">
          {Array.from({ length: progress.total }, (_, segment) => (
            <span
              key={segment}
              className={segment < progress.done ? 'filled' : undefined}
            />
          ))}
        </span>
      )}
    </Link>
  );
}
