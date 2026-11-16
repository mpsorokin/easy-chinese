import type { CourseExercise } from '../../data/courseLessons.ts';
import type { ExerciseId } from '../../domain/exercises.ts';
import activities from './art/level/activities.webp';
import animals from './art/level/animals.webp';
import clothes from './art/level/clothes.webp';
import dates from './art/level/dates.webp';
import family from './art/level/family.webp';
import feelings from './art/level/feelings.webp';
import food from './art/level/food.webp';
import functionWords from './art/level/function-words.webp';
import home from './art/level/home.webp';
import leisure from './art/level/leisure.webp';
import numbers from './art/level/numbers.webp';
import people from './art/level/people.webp';
import politeness from './art/level/politeness.webp';
import quantity from './art/level/quantity.webp';
import school from './art/level/school.webp';
import shopping from './art/level/shopping.webp';
import speaking from './art/level/speaking.webp';
import time from './art/level/time.webp';
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
import baozi from './art/exercises/baozi.webp';
import calligraphy from './art/exercises/calligraphy.webp';
import computer from './art/exercises/computer.webp';
import cooking from './art/exercises/cooking.webp';
import dinner from './art/exercises/dinner.webp';
import dumplings from './art/exercises/dumplings.webp';
import farewell from './art/exercises/farewell.webp';
import groceries from './art/exercises/groceries.webp';
import milk from './art/exercises/milk.webp';
import nameCard from './art/exercises/name-card.webp';
import noodles from './art/exercises/noodles.webp';
import pets from './art/exercises/pets.webp';
import rest from './art/exercises/rest.webp';
import rice from './art/exercises/rice.webp';
import smartphone from './art/exercises/smartphone.webp';
import taxi from './art/exercises/taxi.webp';
import teacher from './art/exercises/teacher.webp';
import travel from './art/exercises/travel.webp';

type ExerciseArt = Partial<Record<CourseExercise, string>>;

// Exercise numbers repeat across lessons and illustrate each lesson's own topics.
export const courseExerciseArt: Partial<Record<number, ExerciseArt>> = {
  1: {
    exercise1: teacher,
    exercise2: farewell,
    exercise3: politeness,
    exercise4: feelings,
    exercise5: schoolGate,
    exercise6: children,
    exercise7: teacher,
    exercise8: politeness,
    exercise9: globe,
    exercise10: farewell,
    exercise11: politeness,
    exercise12: classmates,
    exercise13: farewell,
    words: school,
  },
  2: {
    exercise1: nameCard,
    exercise2: groceries,
    exercise3: people,
    exercise4: animals,
    exercise5: deskClock,
    exercise6: nameCard,
    exercise7: classmates,
    exercise8: politeness,
    exercise9: feelings,
    exercise10: people,
    exercise11: politeness,
    exercise12: nameCard,
    exercise13: people,
    exercise14: feelings,
    exercise15: feelings,
    exercise16: people,
    exercise17: classmates,
    words: nameCard,
  },
  3: {
    exercise1: where,
    exercise2: people,
    exercise3: functionWords,
    exercise4: schoolGate,
    exercise5: classmates,
    exercise6: speaking,
    exercise7: globe,
    exercise8: teacher,
    exercise9: where,
    exercise10: classmates,
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
    words: globe,
  },
  4: {
    exercise1: school,
    exercise2: classmates,
    exercise3: shopping,
    exercise4: quantity,
    exercise5: sisters,
    exercise6: numbers,
    exercise7: quantity,
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
    words: family,
  },
  5: {
    exercise1: dates,
    exercise2: people,
    exercise3: dates,
    exercise4: briefcase,
    exercise5: dates,
    exercise6: dates,
    exercise7: home,
    exercise8: rest,
    exercise9: dates,
    exercise10: birthday,
    exercise11: cooking,
    exercise12: calligraphy,
    exercise13: dinner,
    exercise14: cooking,
    exercise15: noodles,
    exercise16: dumplings,
    exercise17: noodles,
    exercise18: dinner,
    exercise19: cooking,
    exercise20: computer,
    exercise21: time,
    exercise22: clothes,
    exercise23: computer,
    exercise24: food,
    exercise25: school,
    exercise26: computer,
    exercise27: pets,
    words: dates,
  },
  6: {
    exercise1: smartphone,
    exercise2: smartphone,
    exercise3: telephone,
    exercise4: smartphone,
    exercise5: shopping,
    exercise6: rest,
    exercise7: schoolGate,
    exercise8: where,
    exercise9: leisure,
    exercise10: groceries,
    exercise11: shopping,
    exercise12: shopping,
    exercise13: noodles,
    exercise14: milk,
    exercise15: shopping,
    exercise16: baozi,
    exercise17: food,
    exercise18: dinner,
    exercise19: where,
    exercise20: baozi,
    exercise21: dinner,
    exercise22: food,
    exercise23: rice,
    exercise24: cooking,
    exercise25: travel,
    exercise26: taxi,
    exercise27: where,
    words: smartphone,
  },
  7: {
    exercise1: time,
    exercise2: leisure,
    exercise3: dinner,
    exercise4: deskClock,
    exercise5: taxi,
    exercise6: telephone,
    exercise7: home,
    exercise8: school,
    exercise9: groceries,
    exercise10: rest,
    exercise11: numbers,
    exercise12: time,
    exercise13: food,
    exercise14: activities,
    exercise15: people,
    exercise16: leisure,
    exercise17: feelings,
    exercise18: briefcase,
    exercise19: classmates,
    exercise20: schoolGate,
    exercise21: where,
    exercise22: quantity,
    exercise23: youngerSister,
    exercise24: cooking,
    exercise25: smartphone,
    exercise26: household,
    exercise27: family,
    exercise28: pets,
    exercise29: rest,
    exercise30: father,
    exercise31: briefcase,
    exercise32: groceries,
    exercise33: shopping,
    exercise34: brother,
    exercise35: travel,
  },
};

export const coursePracticeArt: Readonly<Record<ExerciseId, string>> = {
  write: calligraphy,
  wordWrite: letter,
  pick: nameCard,
  meaning: functionWords,
  pinyin: speaking,
  words: school,
};
