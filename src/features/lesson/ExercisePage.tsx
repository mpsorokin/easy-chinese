import { Navigate, useParams } from 'react-router';
import { lessonChars, lessonWords } from '@/data/hsk.ts';
import { buildQuiz, isExercise } from '@/domain/exercises/index.ts';
import { lessonKey } from '@/features/progress/progress.ts';
import { useProgress } from '@/features/progress/useProgress.ts';
import { t } from '@/shared/i18n/en.ts';
import { useTopicParams } from '@/features/lesson/lessonRoute.ts';
import { lessonPath, levelPath } from '@/shared/paths.ts';
import QuizPage from '@/features/lesson/QuizPage.tsx';

// A quiz exercise of a topic lesson (the writing exercise runs in the copybook instead).
export default function ExercisePage() {
  const { level, idx, lesson } = useTopicParams();
  const ex = useParams().exercise;
  const { recordExercise } = useProgress();

  if (!level) return <Navigate to="/" replace />;
  if (!lesson) return <Navigate to={levelPath(level.id)} replace />;
  if (!isExercise(ex) || ex === 'write')
    return <Navigate to={lessonPath(level.id, lesson.id)} replace />;

  return (
    <QuizPage
      // New params (back/forward between exercises) start a new quiz.
      key={`${level.id}:${lesson.id}:${ex}`}
      session={`${lessonKey(level.id, lesson.id)}:${ex}`}
      title={`${t.lessonN(lesson.id)} · ${t.exercises[ex].title}`}
      back={lessonPath(level.id, lesson.id)}
      // Distractors come from the lesson first, then the level; the word quiz's tiles
      // use every character of the topics so far.
      build={() =>
        buildQuiz(ex, {
          chars: lessonChars(level, idx),
          words: lessonWords(level, idx),
          pool: level,
          known: level.lessons.slice(0, idx + 1).flatMap((l) => l.chars),
        })
      }
      onFinish={(grade) =>
        recordExercise(lessonKey(level.id, lesson.id), ex, grade)
      }
    />
  );
}
