import type { CourseExercise } from '../../data/courseLessons.ts';
import mistyPavilion from '../home/art/misty-pavilion.webp';
import plumBlossom from '../home/art/plum-blossom.webp';
import bamboo from './art/reference-bamboo.webp';
import activities from './art/level/activities.webp';
import dates from './art/level/dates.webp';
import family from './art/level/family.webp';
import feelings from './art/level/feelings.webp';
import functionWords from './art/level/function-words.webp';
import introductions from './art/level/introductions.webp';
import numbers from './art/level/numbers.webp';
import people from './art/level/people.webp';
import politeness from './art/level/politeness.webp';
import quantity from './art/level/quantity.webp';
import school from './art/level/school.webp';
import shopping from './art/level/shopping.webp';
import speaking from './art/level/speaking.webp';
import where from './art/level/where.webp';
import briefcase from './art/lesson-3/briefcase.webp';
import classmates from './art/lesson-3/classmates.webp';
import deskClock from './art/lesson-3/desk-clock.webp';
import globe from './art/lesson-3/globe.webp';
import letter from './art/lesson-3/letter.webp';
import schoolGate from './art/lesson-3/school-gate.webp';
import sisters from './art/lesson-3/sisters.webp';
import telephone from './art/lesson-3/telephone.webp';
import thaiTemple from './art/lesson-3/thai-temple.webp';
import birthday from './art/lesson-4/birthday.webp';
import brother from './art/lesson-4/brother.webp';
import children from './art/lesson-4/children.webp';
import father from './art/lesson-4/father.webp';
import household from './art/lesson-4/household.webp';
import mother from './art/lesson-4/mother.webp';
import son from './art/lesson-4/son.webp';
import toddler from './art/lesson-4/toddler.webp';
import youngerSister from './art/lesson-4/younger-sister.webp';

type ExerciseArt = Partial<Record<CourseExercise, string>>;

const introductoryArt: ExerciseArt = {
  exercise1: people,
  exercise2: introductions,
  exercise3: politeness,
  exercise4: bamboo,
  exercise5: family,
  exercise6: quantity,
  exercise7: family,
  exercise8: bamboo,
  exercise9: mistyPavilion,
  exercise10: mistyPavilion,
  exercise11: politeness,
  exercise12: bamboo,
  exercise13: dates,
  exercise14: feelings,
  exercise15: feelings,
  exercise16: people,
  exercise17: introductions,
  words: plumBlossom,
};

// Exercise numbers repeat across lessons and illustrate each lesson's own topics.
export const courseExerciseArt: Partial<Record<number, ExerciseArt>> = {
  1: introductoryArt,
  2: introductoryArt,
  3: {
    exercise1: where,
    exercise2: people,
    exercise3: functionWords,
    exercise4: schoolGate,
    exercise5: school,
    exercise6: speaking,
    exercise7: people,
    exercise8: school,
    exercise9: where,
    exercise10: people,
    exercise11: speaking,
    exercise12: people,
    exercise13: where,
    exercise14: globe,
    exercise15: globe,
    exercise16: thaiTemple,
    exercise17: telephone,
    exercise18: telephone,
    exercise19: sisters,
    exercise20: briefcase,
    exercise21: deskClock,
    exercise22: deskClock,
    exercise23: briefcase,
    exercise24: activities,
    exercise25: feelings,
    exercise26: classmates,
    exercise27: letter,
  },
  4: {
    exercise1: school,
    exercise2: classmates,
    exercise3: shopping,
    exercise4: quantity,
    exercise5: sisters,
    exercise6: numbers,
    exercise7: numbers,
    exercise8: household,
    exercise9: brother,
    exercise10: speaking,
    exercise11: people,
    exercise12: family,
    exercise13: quantity,
    exercise14: household,
    exercise15: father,
    exercise16: mother,
    exercise17: youngerSister,
    exercise18: brother,
    exercise19: birthday,
    exercise20: son,
    exercise21: children,
    exercise22: youngerSister,
    exercise23: birthday,
    exercise24: classmates,
    exercise25: dates,
    exercise26: shopping,
    exercise27: toddler,
  },
};
