// localStorage keys owned by the lesson pages (same `hanzi:` prefix as the rest of the app).
import { createStore } from '../../shared/lib/storage.ts';

type LessonStorage = {
  lastLesson: string; // last opened topic, as lessonKey "1:3"
};

export const lessonStore = createStore<LessonStorage>('hanzi:');
