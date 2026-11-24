import type { CSSProperties, ReactNode } from 'react';
import type { DialogueLine } from '@/data/courseLessons.ts';
import { t } from '@/shared/i18n/en.ts';
import { canSpeak, speakChinese } from '@/shared/lib/speech.ts';
import PageToolbar from '@/features/settings/PageToolbar.tsx';
import WriteIcon from '@/shared/ui/WriteIcon.tsx';
import blossomsArt from '@/features/lesson/art/dialogue-blossoms.webp';
import hillsArt from '@/features/lesson/art/dialogue-hills.webp';
import '@/features/lesson/courseExercise.css';

const dialogueArt = {
  '--dialogue-blossoms': `url("${blossomsArt}")`,
  '--dialogue-hills': `url("${hillsArt}")`,
} as CSSProperties;

// HSK exercises: ruby over the annotated characters, and the English of each line.
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
  afterLine,
}: {
  title: string;
  titleLang?: string;
  subtitle?: ReactNode;
  lines: readonly DialogueLine[];
  backTo: string;
  backLabel: string;
  shown: boolean;
  onToggle: () => void;
  progress?: ReactNode;
  footer?: ReactNode;
  afterLine?: (text: string) => ReactNode;
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
      <WriteIcon name={shown ? 'eye-off' : 'eye'} />
      {shown ? t.hidePinyinEnglish : t.showPinyinEnglish}
    </button>
  );

  return (
    <main className="page-frame course-exercise" style={dialogueArt}>
      <header className="course-exercise-header">
        <PageToolbar
          back={{
            to: backTo,
            icon: 'chevron',
            className: 'course-exercise-back',
            children: backLabel,
          }}
        />
        {progress}
        <h1 lang={titleLang}>{title}</h1>
        {subtitle && <p className="course-exercise-subtitle">{subtitle}</p>}
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
                  <WriteIcon name="volume" />
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
                {afterLine?.(text)}
              </div>
            </div>
          );
        })}
      </div>

      {toggle}
      {footer}
    </main>
  );
}
