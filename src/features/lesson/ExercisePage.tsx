import { Navigate, useParams } from 'react-router';
import { lessonChars, lessonWords, levelData } from '../../data/hsk.ts';
import type { LevelData } from '../../data/hsk.ts';
import {
  isExercise,
  meaningQuiz,
  pinyinQuiz,
  wordQuiz,
} from '../../domain/exercises.ts';
import type { ExerciseId, Question } from '../../domain/exercises.ts';
import { lessonKey } from '../progress/progress.ts';
import { useProgress } from '../progress/useProgress.ts';
import { t } from '../../shared/i18n/en.ts';
import { lessonPath, levelPath } from './lessonNav.ts';
import QuizPage from './QuizPage.tsx';

type QuizId = Exclude<ExerciseId, 'write'>;

// Questions for a quiz exercise; distractors come from the lesson first, then the level.
function buildQuiz(level: LevelData, idx: number, ex: QuizId): Question[] {
  const chars = lessonChars(level, idx);
  switch (ex) {
    case 'meaning':
      return meaningQuiz(chars, level.chars);
    case 'pinyin':
      return pinyinQuiz(chars, level.chars);
    case 'words': {
      const known = level.lessons.slice(0, idx + 1).flatMap((l) => l.chars);
      return wordQuiz(lessonWords(level, idx), level.words, known);
    }
  }
}

// A quiz exercise of a topic lesson (the writing exercise runs in the copybook instead).
export default function ExercisePage() {
  const params = useParams();
  const level = levelData(params.level);
  const idx = level
    ? level.lessons.findIndex((l) => String(l.id) === params.lesson)
    : -1;
  const lesson = level?.lessons[idx];
  const ex = params.exercise;
  const { recordExercise } = useProgress();

  if (!level) return <Navigate to="/" replace />;
  if (!lesson) return <Navigate to={levelPath(level.id)} replace />;
  if (!isExercise(ex) || ex === 'write')
    return <Navigate to={lessonPath(level.id, lesson.id)} replace />;

  return (
    <QuizPage
      // New params (back/forward between exercises) start a new quiz.
      key={`${level.id}:${lesson.id}:${ex}`}
      title={`${t.lessonN(lesson.id)} · ${t.exercises[ex].title}`}
      back={lessonPath(level.id, lesson.id)}
      build={() => buildQuiz(level, idx, ex)}
      onFinish={(grade) =>
        recordExercise(lessonKey(level.id, lesson.id), ex, grade)
      }
    />
  );
}
