import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router';
import type { DialogueLine, LinesExercise } from '../../data/courseLessons.ts';
import { t } from '../../shared/i18n/en.ts';
import { canSpeak, speakChinese } from '../../shared/lib/speech.ts';
import blossomsArt from './art/dialogue-blossoms.webp';
import hillsArt from './art/dialogue-hills.webp';
import chevronIcon from './icons/chevron.svg';
import eyeIcon from './icons/eye.svg';
import eyeOffIcon from './icons/eye-off.svg';
import volumeIcon from './icons/volume.svg';
import './courseExercise.css';

const dialogueArt = {
  '--dialogue-blossoms': `url("${blossomsArt}")`,
  '--dialogue-hills': `url("${hillsArt}")`,
} as CSSProperties;

// One exercise of a lesson of the Lessons tab: its lines with pinyin over the characters,
// the English under them, and a button that shows or hides both. Used on its own page and
// as a step of the whole-lesson run (which adds a progress bar and a "next" button).
export default function CourseExerciseView({
  exercise,
  lines,
  backTo,
  backLabel,
  shown,
  onToggle,
  progress,
  footer,
}: {
  exercise: LinesExercise;
  lines: readonly DialogueLine[];
  backTo: string;
  backLabel: string;
  shown: boolean;
  onToggle: () => void;
  progress?: ReactNode;
  footer?: ReactNode;
}) {
  const playable = canSpeak();

  return (
    <main className="course-exercise" style={dialogueArt}>
      <header className="course-exercise-header">
        <Link className="course-exercise-back" to={backTo}>
          <img src={chevronIcon} alt="" />
          {backLabel}
        </Link>
        {progress}
        <h1>{t.courseExercises(exercise)}</h1>
        <p className="course-exercise-subtitle" lang="zh-Hans">
          {t.courseExerciseChinese(exercise)}
        </p>
      </header>

      <div id="course-dialogue" className="course-dialogue" data-shown={shown}>
        {lines.map((line, index) => {
          const text = line.segments.map((segment) => segment.t).join('');

          return (
            <div className="course-dialogue-row" key={index}>
              {playable && (
                <button
                  type="button"
                  className="course-dialogue-audio"
                  aria-label={t.listenDialogueLine(index + 1)}
                  onClick={() => speakChinese(text)}
                >
                  <img src={volumeIcon} alt="" />
                </button>
              )}
              <div className="course-dialogue-copy">
                <p className="course-dialogue-zh" lang="zh-Hans">
                  {line.segments.map((segment, position) =>
                    segment.py ? (
                      <ruby key={position}>
                        {segment.t}
                        <rt lang="zh-Latn">{segment.py}</rt>
                      </ruby>
                    ) : (
                      <span key={position}>{segment.t}</span>
                    ),
                  )}
                </p>
                <p className="course-dialogue-en" lang="en">
                  {line.en}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        className="course-exercise-toggle"
        aria-controls="course-dialogue"
        aria-expanded={shown}
        onClick={onToggle}
      >
        <img src={shown ? eyeOffIcon : eyeIcon} alt="" />
        {shown ? t.hidePinyinEnglish : t.showPinyinEnglish}
      </button>

      {footer}
    </main>
  );
}
