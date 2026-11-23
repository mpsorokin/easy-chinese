import { useState } from 'react';
import { Link, Navigate, useNavigate, useParams } from 'react-router';
import { t } from '@/shared/i18n/en.ts';
import QuizRunner from '@/features/lesson/QuizRunner.tsx';
import ThemeControl from '@/features/settings/ThemeControl.tsx';
import {
  classLesson,
  type ClassLesson,
} from '@/features/my-classes/classLessons.ts';
import {
  classesPath,
  classPath,
  isTranslationDirection,
  type TranslationDirection,
} from '@/shared/paths.ts';
import {
  canPracticeClass,
  classTranslationQuestions,
  classTranslationWords,
} from '@/features/my-classes/classTranslation.ts';
import '@/features/my-classes/classTranslation.css';

function ClassTranslationRound({
  lesson,
  direction,
}: {
  lesson: ClassLesson;
  direction: TranslationDirection;
}) {
  const navigate = useNavigate();
  const [words] = useState(() => classTranslationWords(lesson));
  const [round, setRound] = useState(() => ({
    id: 0,
    questions: classTranslationQuestions(words, direction),
  }));
  if (!canPracticeClass(words) || !round.questions.length)
    return <Navigate to={classPath(lesson.id)} replace />;

  return (
    <main className="app page-frame quiz-page class-translation-page">
      <header className="quiz-head">
        <Link className="quiz-close" to={classesPath} aria-label={t.myClasses}>
          {t.quizExit}
        </Link>
        <div>
          <p className="class-translation-lesson" lang="ru">
            {lesson.label}
          </p>
          <h1>{t.classTranslation[direction]}</h1>
        </div>
        <ThemeControl />
      </header>
      <p className="class-translation-instruction">
        {t.classChooseTranslation}
      </p>
      <QuizRunner
        key={round.id}
        questions={round.questions}
        manualNext
        exitLabel={t.myClasses}
        onAgain={() =>
          setRound({
            id: round.id + 1,
            questions: classTranslationQuestions(words, direction),
          })
        }
        onExit={() => void navigate(classesPath)}
      />
    </main>
  );
}

export default function ClassTranslationPage() {
  const { lesson: id, direction } = useParams();
  const lesson = classLesson(id);
  if (!lesson) return <Navigate to={classesPath} replace />;
  if (!isTranslationDirection(direction))
    return <Navigate to={classPath(lesson.id)} replace />;
  return (
    <ClassTranslationRound
      key={`${lesson.id}:${direction}`}
      lesson={lesson}
      direction={direction}
    />
  );
}
