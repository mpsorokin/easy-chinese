import { Link, Navigate, useParams, useSearchParams } from 'react-router';
import { readingStories } from '@/data/readingStories.ts';
import { vocabularyEntry } from '@/data/vocabulary.ts';
import { t } from '@/shared/i18n/en.ts';
import StoryReader from '@/features/reading/StoryReader.tsx';
import { useWordStatuses } from '@/features/vocabulary/vocabularyStore.ts';
import classmates from '@/features/lesson/art/lesson-3/classmates.webp';
import family from '@/features/lesson/art/level/family.webp';
import dinner from '@/features/lesson/art/exercises/dinner.webp';
import phone from '@/features/lesson/art/exercises/smartphone.webp';
import groceries from '@/features/lesson/art/exercises/groceries.webp';
import shopping from '@/features/lesson/art/level/shopping.webp';
import PageToolbar from '@/features/settings/PageToolbar.tsx';
import {
  readingPath,
  readingStoryPath,
  vocabularyPath,
} from '@/shared/paths.ts';
import '@/features/reading/reading.css';

const covers = new Map([
  ['my-new-friend', classmates],
  ['sunday-with-my-family', family],
  ['dinner-tomorrow', dinner],
  ['an-expensive-phone', phone],
  ['today-at-the-supermarket', groceries],
  ['lets-go-to-the-supermarket', shopping],
]);

// The distinct dictionary words of each story; stories are static, so this runs once.
const storyWords = new Map(
  readingStories.map((story) => [
    story.id,
    [...new Set(story.lines.flatMap((line) => line.tokens))].filter((token) =>
      vocabularyEntry(token),
    ),
  ]),
);

function ReadingLibrary() {
  const statuses = useWordStatuses();
  return (
    <main className="app page-frame reading-library">
      <header className="reading-header">
        <PageToolbar back={{ to: '/', children: t.homeLabel }}>
          <Link className="toolbar-link" to={vocabularyPath}>
            {t.vocabulary}
          </Link>
        </PageToolbar>
        <h1>
          {t.reading} <span lang="zh-Hans">阅读</span>
        </h1>
        <p>{t.readingDescription}</p>
      </header>
      <ul className="reading-list" role="list">
        {readingStories.map((story) => {
          const words = storyWords.get(story.id) ?? [];
          const known = words.filter(
            (word) => statuses[word] === 'known',
          ).length;
          const fresh = words.filter((word) => !statuses[word]).length;
          return (
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
                  <span className="reading-card-coverage">
                    {t.readingCoverage(
                      words.length
                        ? Math.round((100 * known) / words.length)
                        : 0,
                      fresh,
                    )}
                  </span>
                </span>
                <img
                  src={covers.get(story.id) ?? shopping}
                  alt=""
                  decoding="async"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </main>
  );
}

export default function ReadingPage() {
  const { story: id } = useParams();
  const [params] = useSearchParams();
  if (!id) return <ReadingLibrary />;
  const story = readingStories.find((item) => item.id === id);
  if (!story) return <Navigate to={readingPath} replace />;
  const lesson = Number(params.get('lesson'));
  const fromLesson =
    story.lessons &&
    Number.isInteger(lesson) &&
    lesson >= story.lessons[0] &&
    lesson <= story.lessons[1]
      ? lesson
      : undefined;
  return <StoryReader key={story.id} story={story} fromLesson={fromLesson} />;
}
