import { Navigate, useParams } from 'react-router';
import { levelData } from '../../data/hsk.ts';
import type { LevelData } from '../../data/hsk.ts';
import {
  courseLesson,
  coursePart,
  courseWords,
} from '../../data/courseLessons.ts';
import type { CourseLesson } from '../../data/courseLessons.ts';
import {
  isExercise,
  meaningQuiz,
  pinyinQuiz,
  wordQuiz,
  wordWriteQuiz,
  pickQuiz,
} from '../../domain/exercises.ts';
import type { ExerciseId, Question } from '../../domain/exercises.ts';
import { courseLessonKey } from '../progress/progress.ts';
import { useProgress } from '../progress/useProgress.ts';
import { t } from '../../shared/i18n/en.ts';
import { courseLessonPath, levelLessonsPath } from './lessonNav.ts';
import QuizPage from './QuizPage.tsx';

type QuizId = Exclude<ExerciseId, 'write'>;

// Questions over one part of the lesson; distractors come from the part first, then the level.
function buildQuiz(
  level: LevelData,
  lesson: CourseLesson,
  part: number,
  ex: QuizId,
): Question[] {
  const chars = coursePart(lesson, part) ?? [];
  switch (ex) {
    case 'meaning':
      return meaningQuiz(chars, level.chars);
    case 'pinyin':
      return pinyinQuiz(chars, level.chars);
    case 'pick':
      return pickQuiz(
        courseWords(lesson, part),
        chars.map((c) => c.c),
        level.words,
      );
    case 'wordWrite':
      return wordWriteQuiz(courseWords(lesson, part));
    case 'words':
      return wordQuiz(
        courseWords(lesson, part),
        level.words,
        chars.map((c) => c.c),
      );
  }
}

// A quiz exercise of a lesson in the Lessons tab (writing runs in the copybook instead).
export default function CourseQuizPage() {
  const params = useParams();
  const level = levelData(params.level);
  const lesson = courseLesson(params.lesson);
  const ex = params.exercise;
  const part = Number(params.part);
  const { recordExercise } = useProgress();

  if (!level) return <Navigate to="/" replace />;
  if (!lesson) return <Navigate to={levelLessonsPath(level.id)} replace />;
  if (!coursePart(lesson, part)?.length || !isExercise(ex) || ex === 'write')
    return <Navigate to={courseLessonPath(level.id, lesson.id)} replace />;

  return (
    <QuizPage
      // New params (back/forward between exercises) start a new quiz.
      key={`${level.id}:${lesson.id}:${part}:${ex}`}
      session={`${courseLessonKey(level.id, lesson.id, part)}:${ex}`}
      title={`${t.lessonN(lesson.id)} · ${t.partN(part)} · ${t.exercises[ex].title}`}
      back={courseLessonPath(level.id, lesson.id)}
      build={() => buildQuiz(level, lesson, part, ex)}
      onFinish={(grade) =>
        recordExercise(courseLessonKey(level.id, lesson.id, part), ex, grade)
      }
    />
  );
}
