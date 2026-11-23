import { useEffect } from 'react';
import { Link, Navigate, useLocation, useParams } from 'react-router';
import { OPTIONS } from '../../domain/exercises.ts';
import { t } from '../../shared/i18n/en.ts';
import WriteIcon from '../../shared/ui/WriteIcon.tsx';
import ThemeControl from '../settings/ThemeControl.tsx';
import family from '../lesson/art/level/family.webp';
import greetings from '../lesson/art/level/introductions.webp';
import hills from '../lesson/art/level/hills.webp';
import grammar from '../lesson/art/level/function-words.webp';
import speaking from '../lesson/art/level/speaking.webp';
import writing from '../lesson/art/exercises/calligraphy.webp';
import { readingPath } from '../reading/readingNav.ts';
import ClassLessonContent, { classText } from './ClassLessonContent.tsx';
import ClassSectionNav from './ClassSectionNav.tsx';
import { classLessons, type ClassLesson } from './classLessons.ts';
import {
  classPath,
  classesPath,
  classTranslationPath,
  translationDirections,
} from './classRoutes.ts';
import { classTranslationWords } from './classTranslation.ts';
import './myClasses.css';

const covers = new Map([
  [1, greetings],
  [2, family],
]);
const sectionArt = new Map([
  ['Грамматика', grammar],
  ['Диалоги', speaking],
  ['Иероглифы и письмо', writing],
]);

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
  const canPractice =
    new Set(classTranslationWords(lesson).map(({ en }) => en)).size >= OPTIONS;
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
        <h2 id={titleId}>{classText(lesson.title)}</h2>
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
        {canPractice &&
          translationDirections.map((direction) => (
            <Link
              className="class-action"
              to={classTranslationPath(lesson.id, direction)}
              key={direction}
            >
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
              {classText(lesson.title)}
            </h1>
          </div>
          <ClassCover lesson={lesson} />
        </div>
        <ClassLessonContent body={lesson.intro.body} title={lesson.title} />
      </header>

      <ClassSectionNav lesson={lesson} />

      {lesson.sections.map(({ anchor, title, body }) => {
        const art = sectionArt.get(title);
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
              <h2 id={`${anchor}-title`}>{classText(title)}</h2>
              {art && <img src={art} alt="" loading="lazy" decoding="async" />}
            </header>
            <ClassLessonContent
              body={body}
              title={title}
              grammar={title === 'Грамматика'}
            />
          </section>
        );
      })}

      {(previous || next) && (
        <nav className="class-neighbors" aria-label="Соседние уроки" lang="ru">
          {previous && (
            <Link to={classPath(previous.id)}>
              {previous.label} · {previous.chineseTitle ?? previous.title}
            </Link>
          )}
          {next && (
            <Link to={classPath(next.id)}>
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
  const lesson = classLessons.find((item) => String(item.id) === id);
  if (id && !lesson) return <Navigate to={classesPath} replace />;

  return (
    <main className="app page-frame my-classes">
      <div className="theme-toolbar">
        <Link className="classes-back" to={lesson ? classesPath : '/'}>
          <WriteIcon name="back" />
          {lesson ? t.myClasses : t.homeLabel}
        </Link>
        {!lesson && (
          <Link className="classes-back classes-reading-link" to={readingPath}>
            {t.reading} <span lang="zh-Hans">阅读</span>
          </Link>
        )}
        <ThemeControl />
      </div>
      {lesson ? (
        <ClassLessonView key={lesson.id} lesson={lesson} />
      ) : (
        <ClassCatalog />
      )}
    </main>
  );
}
