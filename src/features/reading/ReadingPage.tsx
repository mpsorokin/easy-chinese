import { useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import {
  readingStories,
  type ReadingStory,
} from '../../data/readingStories.ts';
import { t } from '../../shared/i18n/en.ts';
import WriteIcon from '../../shared/ui/WriteIcon.tsx';
import DialogueReader from '../lesson/DialogueReader.tsx';
import classmates from '../lesson/art/lesson-3/classmates.webp';
import family from '../lesson/art/level/family.webp';
import dinner from '../lesson/art/exercises/dinner.webp';
import phone from '../lesson/art/exercises/smartphone.webp';
import groceries from '../lesson/art/exercises/groceries.webp';
import shopping from '../lesson/art/level/shopping.webp';
import ThemeControl from '../settings/ThemeControl.tsx';
import { readingPath, readingStoryPath } from './readingNav.ts';
import './reading.css';

const covers = new Map([
  ['my-new-friend', classmates],
  ['sunday-with-my-family', family],
  ['dinner-tomorrow', dinner],
  ['an-expensive-phone', phone],
  ['today-at-the-supermarket', groceries],
  ['lets-go-to-the-supermarket', shopping],
]);

function ReadingLibrary() {
  return (
    <main className="app page-frame reading-library">
      <header className="reading-header">
        <div className="theme-toolbar">
          <Link className="reading-back" to="/">
            <WriteIcon name="back" />
            {t.homeLabel}
          </Link>
          <ThemeControl />
        </div>
        <h1>
          {t.reading} <span lang="zh-Hans">阅读</span>
        </h1>
        <p>{t.readingDescription}</p>
      </header>
      <ul className="reading-list" role="list">
        {readingStories.map((story) => (
          <li key={story.id}>
            <Link to={readingStoryPath(story.id)} className="reading-card">
              <span className="reading-card-copy">
                <span className="reading-card-title" lang="zh-Hans">
                  {story.titleZh}
                </span>
                <span className="reading-card-english">{story.titleEn}</span>
                <span className="reading-card-meta">
                  {story.lessons && (
                    <span>{t.readingLessons(...story.lessons)}</span>
                  )}
                  <span>{t.readingLines(story.lines.length)}</span>
                </span>
              </span>
              <img
                src={covers.get(story.id) ?? shopping}
                alt=""
                decoding="async"
              />
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}

function Story({ story }: { story: ReadingStory }) {
  const [shown, setShown] = useState(false);

  return (
    <DialogueReader
      title={story.titleZh}
      titleLang="zh-Hans"
      subtitle={
        shown && (
          <>
            <span lang="zh-Latn-pinyin">{story.titlePinyin}</span>
            <span lang="en">{story.titleEn}</span>
          </>
        )
      }
      lines={story.lines}
      backTo={readingPath}
      backLabel={t.reading}
      shown={shown}
      onToggle={() => setShown((previous) => !previous)}
      variant="story"
    />
  );
}

export default function ReadingPage() {
  const { story: id } = useParams();
  if (!id) return <ReadingLibrary />;
  const story = readingStories.find((item) => item.id === id);
  if (!story) return <Navigate to={readingPath} replace />;
  return <Story key={story.id} story={story} />;
}
