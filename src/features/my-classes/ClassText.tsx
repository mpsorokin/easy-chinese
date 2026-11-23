import { Fragment } from 'react';
import { Link } from 'react-router';
import { COURSE_LEVEL, courseLessonPath } from '../../shared/paths.ts';

const CHINESE = /([\p{Script=Han}，。！？、；：]+)/u;
const INLINE = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g;
// The notes link course lessons by their source file.
const COURSE_LINK =
  /^\[([^\]]+)\]\(\.\.\/src\/data\/lessons\/lesson(\d+)\.ts\)$/;

function chinese(text: string) {
  return text.split(CHINESE).map((part, index) =>
    index % 2 ? (
      <span key={index} lang="zh-Hans">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

// A line of class notes: **bold**, *italic* and links to course lessons, with Chinese
// runs marked as such for fonts and screen readers.
export default function ClassText({ text }: { text: string }) {
  return text.split(INLINE).map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
      return <strong key={index}>{chinese(part.slice(2, -2))}</strong>;
    if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
      return <em key={index}>{chinese(part.slice(1, -1))}</em>;

    const link = COURSE_LINK.exec(part);
    if (link)
      return (
        <Link
          key={index}
          to={courseLessonPath(COURSE_LEVEL, Number(link[2]))}
          lang="en"
        >
          {link[1]}
        </Link>
      );

    return <Fragment key={index}>{chinese(part)}</Fragment>;
  });
}
