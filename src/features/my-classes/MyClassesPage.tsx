import { useEffect } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router';
import { t } from '@/shared/i18n/en.ts';
import WriteIcon from '@/shared/ui/WriteIcon.tsx';
import PageToolbar from '@/features/settings/PageToolbar.tsx';
import family from '@/features/lesson/art/level/family.webp';
import greetings from '@/features/lesson/art/level/introductions.webp';
import hills from '@/features/lesson/art/level/hills.webp';
import grammar from '@/features/lesson/art/level/function-words.webp';
import speaking from '@/features/lesson/art/level/speaking.webp';
import writing from '@/features/lesson/art/exercises/calligraphy.webp';
import {
  classesPath,
  classPath,
  classTranslationPath,
  readingPath,
  translationDirections,
} from '@/shared/paths.ts';
import ClassBlocks from '@/features/my-classes/ClassBlocks.tsx';
import ClassSectionNav from '@/features/my-classes/ClassSectionNav.tsx';
import ClassText from '@/features/my-classes/ClassText.tsx';
import {
  classLesson,
  classLessons,
  type ClassLesson,
  type SectionKind,
} from '@/features/my-classes/classLessons.ts';
import {
  canPracticeClass,
  classTranslationWords,
} from '@/features/my-classes/classTranslation.ts';
import '@/features/my-classes/myClasses.css';

const covers = new Map([
  [1, greetings],
  [2, family],
]);
const sectionArt: Partial<Record<SectionKind, string>> = {
  grammar,
  dialogues: speaking,
  writing,
};
const practiceModes = new Map(
  classLessons.map((lesson) => {
    const words = classTranslationWords(lesson);
    return [
      lesson.id,
      translationDirections.filter((direction) =>
        canPracticeClass(words, direction),
      ),
    ];
  }),
);

function ClassCover({ lesson }: { lesson: ClassLesson }) {
  return (
    <img
      className="class-cover"
      src={covers.get(lesson.id) ?? hills}
      alt=""
      decoding="async"
    />
  );
}

function ClassCatalogCard({ lesson }: { lesson: ClassLesson }) {
  const titleId = `class-title-${lesson.id}`;

  return (
    <article className="class-card" aria-labelledby={titleId}>
      <div className="class-card-scene">
        <ClassCover lesson={lesson} />
      </div>
      <div className="class-card-copy" lang="ru">
        <p className="class-label" id={`class-number-${lesson.id}`}>
          {lesson.label}
        </p>
        {lesson.chineseTitle && (
          <p className="class-topic" lang="zh-Hans">
            {lesson.chineseTitle}
          </p>
        )}
        <h2 id={titleId}>
          <ClassText text={lesson.title} />
        </h2>
      </div>
      <nav
        className="class-card-actions"
        aria-labelledby={`class-number-${lesson.id}`}
      >
        <Link
          className="class-action class-action-lesson"
          to={classPath(lesson.id)}
        >
          <WriteIcon name="layers" />
          {t.classLessonMaterial}
        </Link>
        {practiceModes.get(lesson.id)?.map((direction) => (
          <Link
            className="class-action"
            to={classTranslationPath(lesson.id, direction)}
            key={direction}
          >
            {direction === 'listen-en' && <WriteIcon name="volume" />}
            {t.classTranslation[direction]}
          </Link>
        ))}
      </nav>
    </article>
  );
}

function ClassCatalog() {
  return (
    <>
      <header className="classes-banner">
        <h1>{t.myClasses}</h1>
        <p>{t.myClassesDescription}</p>
      </header>
      {classLessons.length ? (
        <ul className="class-list" role="list">
          {classLessons.map((lesson) => (
            <li key={lesson.id}>
              <ClassCatalogCard lesson={lesson} />
            </li>
          ))}
        </ul>
      ) : (
        <p>{t.noClasses}</p>
      )}
    </>
  );
}

function ClassLessonView({ lesson }: { lesson: ClassLesson }) {
  const { hash } = useLocation();
  const index = classLessons.indexOf(lesson);
  const previous = classLessons[index - 1];
  const next = classLessons[index + 1];

  useEffect(() => {
    const target = lesson.sections.find(({ anchor }) => `#${anchor}` === hash);
    if (!target) return;
    // The browser can try the fragment before the lazy lesson page has rendered.
    const frame = requestAnimationFrame(() => {
      document.getElementById(target.anchor)?.scrollIntoView();
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, lesson.sections]);

  return (
    <>
      <header className="classes-banner class-intro" lang="ru">
        <div className="class-intro-title">
          <div>
            <p className="class-label">
              {lesson.label}
              <span lang="zh-Hans">{lesson.hanzi}</span>
              <span lang="zh-Latn-pinyin">{lesson.pinyin}</span>
            </p>
            <h1>
              {lesson.chineseTitle && (
                <span className="class-topic" lang="zh-Hans">
                  {lesson.chineseTitle}
                </span>
              )}
              <ClassText text={lesson.title} />
            </h1>
          </div>
          <ClassCover lesson={lesson} />
        </div>
        <ClassBlocks blocks={lesson.intro} />
      </header>

      <ClassSectionNav lesson={lesson} />

      {lesson.sections.map(({ anchor, title, kind, blocks }) => {
        const art = sectionArt[kind];
        return (
          <section
            key={anchor}
            id={anchor}
            tabIndex={-1}
            className="class-section"
            lang="ru"
            aria-labelledby={`${anchor}-title`}
          >
            <header className="class-section-head">
              <h2 id={`${anchor}-title`}>
                <ClassText text={title} />
              </h2>
              {art && <img src={art} alt="" loading="lazy" decoding="async" />}
            </header>
            <ClassBlocks blocks={blocks} />
          </section>
        );
      })}

      {(previous || next) && (
        <nav className="class-neighbors" aria-label={t.classNeighbors}>
          {previous && (
            <Link to={classPath(previous.id)} lang="ru">
              {previous.label} · {previous.chineseTitle ?? previous.title}
            </Link>
          )}
          {next && (
            <Link to={classPath(next.id)} lang="ru">
              {next.label} · {next.chineseTitle ?? next.title}
            </Link>
          )}
        </nav>
      )}
    </>
  );
}

export default function MyClassesPage() {
  const { lesson: id } = useParams();
  const lesson = classLesson(id);
  if (id && !lesson) return <Navigate to={classesPath} replace />;

  return (
    <main className="app page-frame my-classes">
      <PageToolbar
        back={{
          to: lesson ? classesPath : '/',
          children: lesson ? t.myClasses : t.homeLabel,
        }}
      >
        {!lesson && (
          <Link className="back-link classes-reading-link" to={readingPath}>
            {t.reading} <span lang="zh-Hans">阅读</span>
          </Link>
        )}
      </PageToolbar>
      {lesson ? (
        <ClassLessonView key={lesson.id} lesson={lesson} />
      ) : (
        <ClassCatalog />
      )}
    </main>
  );
}
