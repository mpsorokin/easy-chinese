import { useState } from 'react';

export default function CourseCardArt({ src }: { src: string | undefined }) {
  const [failed, setFailed] = useState(false);

  return (
    <span className="course-lesson-art" aria-hidden="true">
      {src && !failed && (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
        />
      )}
    </span>
  );
}
