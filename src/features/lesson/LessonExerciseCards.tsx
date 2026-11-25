import type { ReactNode } from 'react';
import type { ExerciseId } from '@/domain/exercises/index.ts';
import type { LessonProgress } from '@/features/progress/progress.ts';
import { PASS_GRADE } from '@/features/progress/progress.ts';
import { stars, t } from '@/shared/i18n/en.ts';
import CourseCardArt from '@/features/lesson/CourseCardArt.tsx';
import '@/features/lesson/lesson.css';
import WriteIcon from '@/shared/ui/WriteIcon.tsx';

const EXERCISE_ICONS: Record<
  ExerciseId,
  'brush' | 'target' | 'volume' | 'book'
> = {
  write: 'brush',
  wordWrite: 'brush',
  pick: 'target',
  meaning: 'target',
  pinyin: 'volume',
  words: 'book',
};

// The "Exercises" section: Writing, 字 → meaning, 字 → pinyin and 词 Words cards with
// their best results. Used by topic lessons and by lessons of the Lessons tab.
export default function LessonExerciseCards({
  exercises,
  results,
  written,
  totalChars,
  onOpen,
  art,
  title = t.exercisesLabel,
}: {
  exercises: readonly ExerciseId[];
  results: LessonProgress;
  written: number; // characters of the lesson written at least once
  totalChars: number;
  onOpen: (ex: ExerciseId) => void;
  art?: Readonly<Record<ExerciseId, string>>;
  title?: ReactNode;
}) {
  return (
    <section className="lesson-section">
      <h2>{title}</h2>
      <div className="lesson-exercises">
        {exercises.map((ex) => {
          const r = results[ex];
          return (
            <button
              key={ex}
              type="button"
              className={
                'lesson-ex' + (r && r.best >= PASS_GRADE ? ' done' : '')
              }
              onClick={() => onOpen(ex)}
            >
              {art && <CourseCardArt key={art[ex]} src={art[ex]} />}
              <span className="lesson-ex-tile" aria-hidden="true">
                <WriteIcon name={EXERCISE_ICONS[ex]} className="lesson-icon" />
              </span>
              <span className="lesson-ex-copy">
                <b>{t.exercises[ex].title}</b>
                <span className="lesson-ex-hint">
                  {ex === 'write'
                    ? t.writeProgress(written, totalChars)
                    : t.exercises[ex].hint}
                </span>
                <span className="lesson-ex-stars">{stars(r?.best ?? 0)}</span>
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
