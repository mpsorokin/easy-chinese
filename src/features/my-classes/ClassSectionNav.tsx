import { useEffect, useRef, useState } from 'react';
import { t } from '@/shared/i18n/en.ts';
import type { ClassLesson } from '@/features/my-classes/classLessons.ts';
import ClassText from '@/features/my-classes/ClassText.tsx';

export default function ClassSectionNav({ lesson }: { lesson: ClassLesson }) {
  const nav = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDetailsElement>(null);
  const [active, setActive] = useState('');

  useEffect(() => {
    const sections = lesson.sections.flatMap(({ anchor }) => {
      const element = document.getElementById(anchor);
      return element ? [element] : [];
    });

    const update = () => {
      const edge = (nav.current?.getBoundingClientRect().bottom ?? 0) + 32;
      let current = sections
        .filter((section) => section.getBoundingClientRect().top <= edge)
        .at(-1);
      if (
        window.scrollY + window.innerHeight >=
        document.documentElement.scrollHeight - 2
      ) {
        const target = sections.find(
          (section) => `#${section.id}` === window.location.hash,
        );
        current =
          target && target.getBoundingClientRect().top > edge
            ? target
            : sections.at(-1);
      }
      setActive(current?.id ?? '');
    };

    // Layout is read at most once a frame, however often scroll events fire.
    let frame = 0;
    const schedule = () => {
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          update();
        });
    };

    update();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    window.addEventListener('hashchange', schedule);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('hashchange', schedule);
    };
  }, [lesson.sections]);

  if (!lesson.sections.length) return null;

  const current = lesson.sections.find(({ anchor }) => active === anchor);
  return (
    <nav ref={nav} className="class-section-nav" aria-label={t.classSections}>
      <span className="class-section-position" lang="ru">
        <strong>{lesson.label}</strong>
        {current && (
          <span>
            <ClassText text={current.title} />
          </span>
        )}
      </span>
      <details
        ref={menu}
        className="class-section-menu"
        onBlur={(event) => {
          if (!event.currentTarget.contains(event.relatedTarget))
            event.currentTarget.open = false;
        }}
        onKeyDown={(event) => {
          if (event.key === 'Escape' && event.currentTarget.open) {
            event.currentTarget.open = false;
            event.currentTarget.querySelector('summary')?.focus();
          }
        }}
      >
        <summary>{t.classSectionsMenu}</summary>
        <ul role="list" lang="ru">
          {lesson.sections.map(({ anchor, title }) => (
            <li key={anchor}>
              <a
                href={`#${anchor}`}
                aria-current={anchor === active ? 'location' : undefined}
                onClick={() => {
                  if (menu.current) menu.current.open = false;
                }}
              >
                <ClassText text={title} />
              </a>
            </li>
          ))}
        </ul>
      </details>
    </nav>
  );
}
