import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router';
import type { DialogueLine } from '../../data/courseLessons.ts';
import type { ReadingLine } from '../../data/readingStories.ts';
import { t } from '../../shared/i18n/en.ts';
import { canSpeak, speakChinese } from '../../shared/lib/speech.ts';
import ThemeControl from '../settings/ThemeControl.tsx';
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

// HSK exercises use ruby over their annotated characters. Stories have whole-line pinyin.
export default function DialogueReader({
  title,
  titleLang,
  subtitle,
  lines,
  backTo,
  backLabel,
  shown,
  onToggle,
  progress,
  footer,
  toggleAtTop = false,
}: {
  title: string;
  titleLang?: string;
  subtitle?: ReactNode;
  lines: readonly (DialogueLine | ReadingLine)[];
  backTo: string;
  backLabel: string;
  shown: boolean;
  onToggle: () => void;
  progress?: ReactNode;
  footer?: ReactNode;
  toggleAtTop?: boolean;
}) {
  const playable = canSpeak();
  const toggle = (
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
  );

  return (
    <main
      className={
        toggleAtTop
          ? 'page-frame course-exercise course-story'
          : 'page-frame course-exercise'
      }
      style={dialogueArt}
    >
      <header className="course-exercise-header">
        <div className="theme-toolbar">
          <Link className="course-exercise-back" to={backTo}>
            <img src={chevronIcon} alt="" />
            {backLabel}
          </Link>
          <ThemeControl />
        </div>
        {progress}
        <h1 lang={titleLang}>{title}</h1>
        {subtitle && <p className="course-exercise-subtitle">{subtitle}</p>}
      </header>

      {toggleAtTop && toggle}
      <div id="course-dialogue" className="course-dialogue" data-shown={shown}>
        {lines.map((line, index) => {
          const segmented = 'segments' in line;
          const text = segmented
            ? line.segments.map((segment) => segment.t).join('')
            : line.zh;

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
                {!segmented && shown && (
                  <p className="course-dialogue-pinyin" lang="zh-Latn-pinyin">
                    {line.pinyin}
                  </p>
                )}
                <p className="course-dialogue-zh" lang="zh-Hans">
                  {segmented
                    ? line.segments.map((segment, position) =>
                        segment.py ? (
                          <ruby key={position}>
                            {segment.t}
                            <rt lang="zh-Latn">{segment.py}</rt>
                          </ruby>
                        ) : (
                          <span key={position}>{segment.t}</span>
                        ),
                      )
                    : text}
                </p>
                {(segmented || shown) && (
                  <p className="course-dialogue-en" lang="en">
                    {line.en}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!toggleAtTop && toggle}
      {footer}
    </main>
  );
}
