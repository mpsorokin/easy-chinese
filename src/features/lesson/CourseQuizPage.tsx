import { Navigate, useParams } from 'react-router';
import { coursePart, courseWords } from '../../data/courseLessons.ts';
import { buildQuiz, isExercise } from '../../domain/exercises.ts';
import { courseLessonKey } from '../progress/progress.ts';
import { useProgress } from '../progress/useProgress.ts';
import { t } from '../../shared/i18n/en.ts';
import { useCourseParams } from './lessonRoute.ts';
import { courseLessonPath, levelLessonsPath } from '../../shared/paths.ts';
import QuizPage from './QuizPage.tsx';

// A quiz exercise of a lesson in the Lessons tab (writing runs in the copybook instead).
export default function CourseQuizPage() {
  const { level, lesson, part } = useCourseParams();
  const ex = useParams().exercise;
  const { recordExercise } = useProgress();

  if (!level) return <Navigate to="/" replace />;
  if (!lesson) return <Navigate to={levelLessonsPath(level.id)} replace />;
  const chars = coursePart(lesson, part);
  if (!chars?.length || !isExercise(ex) || ex === 'write')
    return <Navigate to={courseLessonPath(level.id, lesson.id)} replace />;

  return (
    <QuizPage
      // New params (back/forward between exercises) start a new quiz.
      key={`${level.id}:${lesson.id}:${part}:${ex}`}
      session={`${courseLessonKey(level.id, lesson.id, part)}:${ex}`}
      title={`${t.lessonN(lesson.id)} · ${t.partN(part)} · ${t.exercises[ex].title}`}
      back={courseLessonPath(level.id, lesson.id)}
      // Questions over one part; distractors come from the part first, then the level.
      build={() =>
        buildQuiz(ex, {
          chars,
          words: courseWords(lesson, part),
          pool: level,
          known: chars.map((c) => c.c),
        })
      }
      onFinish={(grade) =>
        recordExercise(courseLessonKey(level.id, lesson.id, part), ex, grade)
      }
    />
  );
}
