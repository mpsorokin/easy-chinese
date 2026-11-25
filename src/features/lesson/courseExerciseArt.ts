import type { CourseExercise } from '@/data/courseLessons.ts';
import { exerciseNumber } from '@/data/courseLessons.ts';
import type { ExerciseId } from '@/domain/exercises/index.ts';
import { art } from '@/features/lesson/art/index.ts';

// Card pictures of each lesson's exercises (file names in ./art), exercise 1 first; they
// repeat across lessons and illustrate each lesson's own topics. `words` is the Words card.
const LESSON_ART: Readonly<
  Record<number, { exercises: string; words?: string }>
> = {
  1: {
    exercises: `
      teacher farewell politeness feelings school-gate children teacher
      politeness globe farewell politeness classmates farewell
    `,
    words: 'school',
  },
  2: {
    exercises: `
      name-card groceries people animals desk-clock name-card classmates
      politeness feelings people politeness name-card people feelings
      feelings people classmates
    `,
    words: 'name-card',
  },
  3: {
    exercises: `
      where people function-words school-gate classmates speaking globe
      teacher where classmates speaking people where globe globe thai-temple
      telephone telephone sisters briefcase desk-clock desk-clock briefcase
      activities feelings classmates letter
    `,
    words: 'globe',
  },
  4: {
    exercises: `
      school classmates shopping quantity sisters numbers quantity household
      brother speaking people family quantity household father mother
      younger-sister brother birthday son children younger-sister birthday
      classmates dates shopping toddler
    `,
    words: 'family',
  },
  5: {
    exercises: `
      dates people dates briefcase dates dates home rest dates birthday
      cooking calligraphy dinner cooking noodles dumplings noodles dinner
      cooking computer time clothes computer food school computer pets
    `,
    words: 'dates',
  },
  6: {
    exercises: `
      smartphone smartphone telephone smartphone shopping rest school-gate
      where leisure groceries shopping shopping noodles milk shopping baozi
      food dinner where baozi dinner food rice cooking travel taxi where
    `,
    words: 'smartphone',
  },
  7: {
    exercises: `
      time leisure dinner desk-clock taxi telephone home school groceries
      rest numbers time food activities people leisure feelings briefcase
      classmates school-gate where quantity younger-sister cooking
      smartphone household family pets rest father briefcase groceries
      shopping brother travel
    `,
  },
};

const urls = new Map(
  Object.entries(LESSON_ART).map(([id, { exercises, words }]) => [
    Number(id),
    {
      exercises: exercises.trim().split(/\s+/).map(art),
      words: words === undefined ? undefined : art(words),
    },
  ]),
);

// The picture of one exercise card of a lesson, if it has one.
export function courseExerciseArt(
  lesson: number,
  ex: CourseExercise,
): string | undefined {
  const l = urls.get(lesson);
  return ex === 'words' ? l?.words : l?.exercises[exerciseNumber(ex) - 1];
}

export const coursePracticeArt: Readonly<Record<ExerciseId, string>> = {
  write: art('calligraphy'),
  wordWrite: art('letter'),
  pick: art('name-card'),
  meaning: art('function-words'),
  pinyin: art('speaking'),
  words: art('school'),
};
