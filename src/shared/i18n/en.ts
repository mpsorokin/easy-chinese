// All user-facing strings (English). Keep UI text here rather than in components.
import type { CharEntry } from '../../domain/types.ts';
import { plural } from '../lib/plural.ts';
import type { Grade } from '../../domain/grading.ts';

const count = (n: number, one: string, many?: string) =>
  `${n} ${plural(n, one, many)}`;

export const t = {
  // Header
  prev: 'Previous',
  next: 'Next',
  listenCharacter: (char: string) => `Listen to ${char}`,

  // HSK practice set (chosen on the HSK page)
  characterOf: (i: number, n: number) => `Character ${i} of ${n}`,
  practiceExit: 'Exit set',
  homeLabel: 'Home',

  // Home
  appTitle: 'Copybook',
  currentLesson: 'Current lesson',
  continueLabel: 'Continue',
  startLabel: 'Start',
  levelMeta: (chars: number, words: number) =>
    `${count(chars, 'character')} · ${count(words, 'word')}`,
  topicsDone: (done: number, total: number) => `${done} of ${total} topics`,
  lessonsProgress: (done: number, total: number) =>
    `Lessons: ${done} of ${total}`,
  percent: (n: number) => `${n} %`,
  completed: 'completed',
  soon: 'soon',
  freeWrite: 'Free writing',
  printPdf: 'Print PDF',
  chooseHskLevel: (tool: string) => `${tool} · Choose HSK level`,
  otherLevels: 'Other levels — soon',

  // Level page
  levelTitle: (id: string) => `HSK ${id}`,
  tabLessons: 'Lessons',
  tabTopics: 'Topics',
  tabAllChars: 'All characters',
  lessonN: (n: number) => `Lesson ${n}`,
  exercisesDone: (done: number, total: number) => `${done}/${total}`,
  nextUp: 'Up next',

  // Lesson page
  lessonChars: (n: number) => count(n, 'character'),
  lessonWords: (n: number) => count(n, 'word'),
  noWords: 'No new words in this lesson — characters only.',
  exercisesLabel: 'Exercises',
  partN: (n: number) => `Part ${n}`,
  studyLabel: 'Study',
  startLesson: 'Start lesson',
  nextExercise: 'Next',
  finishLesson: 'Finish lesson',
  stepOfTotal: (i: number, n: number) => `${i} / ${n}`,
  lessonProgressLabel: 'Lesson progress',
  // Exercise cards of a lesson in the "Lessons" tab (features/lesson/lessonNav.ts).
  courseExercises: {
    exercise1: 'Exercise 1',
    exercise2: 'Exercise 2',
    exercise3: 'Exercise 3',
    exercise4: 'Exercise 4',
    exercise5: 'Exercise 5',
    exercise6: 'Exercise 6',
    exercise7: 'Exercise 7',
    exercise8: 'Exercise 8',
    exercise9: 'Exercise 9',
    exercise10: 'Exercise 10',
    exercise11: 'Exercise 11',
    exercise12: 'Exercise 12',
    exercise13: 'Exercise 13',
    exercise14: 'Exercise 14',
    exercise15: 'Exercise 15',
    exercise16: 'Exercise 16',
    exercise17: 'Exercise 17',
    words: 'Words',
  },
  // Chinese subtitle of a dialogue exercise.
  courseExerciseChinese: {
    exercise1: '练习一',
    exercise2: '练习二',
    exercise3: '练习三',
    exercise4: '练习四',
    exercise5: '练习五',
    exercise6: '练习六',
    exercise7: '练习七',
    exercise8: '练习八',
    exercise9: '练习九',
    exercise10: '练习十',
    exercise11: '练习十一',
    exercise12: '练习十二',
    exercise13: '练习十三',
    exercise14: '练习十四',
    exercise15: '练习十五',
    exercise16: '练习十六',
    exercise17: '练习十七',
    words: '生词',
  },
  courseExerciseDescriptions: {
    exercise1: 'Practice the new material',
    exercise2: 'Practice more greetings',
    exercise3: 'Say thank you',
    exercise4: 'Good and not good',
    exercise5: 'Students and school',
    exercise6: 'Plural with 们',
    exercise7: 'Teachers',
    exercise8: 'Polite 您',
    exercise9: 'Where are you from?',
    exercise10: 'Thanks and goodbye',
    exercise11: 'Thank you',
    exercise12: 'Classmates',
    exercise13: 'See you tomorrow',
    exercise14: 'Very good, very happy',
    exercise15: 'Happy and not happy',
    exercise16: 'Do you know him?',
    exercise17: 'Also with 也',
    words: 'Learn new vocabulary',
  },
  courseExercisesAvailable: (available: number, total: number) =>
    `${available} of ${total} exercises available`,
  listenDialogueLine: (line: number) => `Listen to line ${line}`,
  showPinyinEnglish: 'Show pinyin & English',
  hidePinyinEnglish: 'Hide pinyin & English',
  exercises: {
    write: { title: 'Writing', hint: 'write each character' },
    meaning: { title: '字 → meaning', hint: 'recognize the meaning' },
    pinyin: { title: '字 → pinyin', hint: 'reading and tone' },
    words: { title: '词 Words', hint: 'words of the lesson' },
  },
  writeProgress: (done: number, total: number) => `${done}/${total} characters`,

  // Quiz
  quizOf: (i: number, n: number) => `${i} / ${n}`,
  quizRight: 'Correct!',
  quizWrong: 'Not quite',
  quizNext: 'Next ›',
  quizBuild: 'Build the word',
  quizUndo: '⌫',
  quizUndoLabel: 'Undo',
  quizListen: 'Listen',
  quizDone: (grade: Grade) =>
    grade === 3 ? 'Excellent!' : grade === 2 ? 'Good job!' : 'Worth repeating',
  quizScore: (right: number, total: number) =>
    `Correct answers: ${right} of ${total}`,
  quizAgain: '↺ Again',
  quizToLesson: 'To lesson',
  quizMistakes: 'Mistakes',
  quizExit: '✕',

  // Character picker
  pickerTitle: 'Choose a character',
  close: 'Close',

  // Strips
  strokeOrder: 'Stroke order',
  strokeCount: (n: number) => count(n, 'stroke'),
  strokeTitle: (i: number) => `Stroke ${i}`,
  strokeOrderHide: 'Hide',
  strokeOrderShow: 'Show',
  copybook: 'Copybook',
  // Copybook steps by id (features/copybook/steps.ts): badge in the cell.
  steps: {
    faint: { badge: 'Trace the faint outline' },
    barely: { badge: 'Barely visible outline' },
    free: { badge: 'On your own, no outline' },
  },
  stepOf: (i: number, n: number) => `Step ${i} of ${n}`,
  done: 'Done',

  // Controls
  show: 'Show',
  hint: 'Hint',
  restart: 'Restart',

  // Summary overlay
  again: '↺ Again',
  nextChar: 'Next ›',
  summaryTitle: (grade: Grade) =>
    grade === 3
      ? 'Excellent, your hand remembers it!'
      : grade === 2
        ? 'Nicely done!'
        : 'Copybook complete',
  summaryDetails: (item: CharEntry, total: number) =>
    `${item.c} · ${item.py} — ${item.en}. Total mistakes: ${total}.`,

  // Stroke data loading
  loadError: 'Could not load the character',
  retry: 'Retry',

  // Settings
  settings: 'Settings',
  settingGrid: 'Grid',
  settingStrict: 'Checking strictness',
  settingHint: 'Hint after mistakes',
  settingSpeed: 'Show and Hint speed',
  // Option labels by value (features/settings/settings.ts).
  options: {
    grid: { tian: '田 four', mi: '米 eight' },
    strict: { 1.5: 'lenient', 1: 'normal', 0.7: 'strict' },
    hint: { 1: '1', 2: '2', 3: '3', 0: 'off' },
    speed: { 0.5: '0.5×', 1: '1×' },
  },

  // Status line
  status: {
    initial: 'Write with your finger right in the cell',
    step: (i: number, badge: string) => `Step ${i}: ${badge.toLowerCase()}`,
    correct: (i: number, n: number) =>
      `Stroke ${i} of ${n} ✓  — next is stroke ${i + 1}`,
    lastCorrect: 'Last stroke ✓',
    backwards: 'Wrong direction — draw the stroke from the other end',
    mistake: (i: number) => `Not quite — repeat stroke ${i}`,
    seeHint: ' · see the hint',
    clean: 'Clean, no mistakes! ★★★',
    finished: (n: number) => `Done. Mistakes: ${n}`,
    summary: 'The “Copybook” strip above shows all your attempts',
    watching: 'Watch the stroke order…',
    hintFor: (i: number) => `Hint: stroke ${i}`,
  },

  // HSK character selection and worksheet printing
  hintChars: (max: number) =>
    `Tap characters to choose 1–${max}, then write or print them.`,
  hintWritingChars: (max: number) =>
    `Choose 1–${max} characters, then tap Write.`,
  search: 'Paste characters 我爱你 · or search hao, good',
  addAll: (n: number) => `+ Add all ${n}`,
  nothingFound: 'Nothing found',
  selected: (n: number, max: number) => `${n} / ${max}`,
  removeLast: 'Remove last',
  remove: (c: string) => `Remove ${c}`,
  clear: 'clear',
  write: '✍ Write',
  print: '🖨 Print PDF',
  preparing: 'Preparing…',
  printTitle: 'Print worksheet (PDF)',
  printMeta: (n: number) =>
    `${count(n, 'character')}, in the order you picked them`,
  printRows: 'Practice rows',
  printGrid: 'Grid',
  printGo: 'Download PDF',
  pdfTitle: (level: string) => `HSK ${level} Writing Worksheet`,
  printStrokeOrder: 'Stroke order',
  printTag: (strokes: number, level: string) =>
    `HSK ${level} · ${count(strokes, 'stroke')}`,
  printWords: (words: string[], level: string) =>
    `HSK ${level} words: ${words.slice(0, 6).join(' · ')}${words.length > 6 ? ' …' : ''}`,
  printDone: (pages: number) => `Done: ${count(pages, 'page')}`,
  printError: 'Could not create the PDF. Check the connection and try again.',
  emptyTray: 'Nothing chosen yet',
  presetTitle: (level: string) => `HSK ${level.replace('-', '–')} basics`,
  presetKicker: 'Ready-made worksheet',
  presetMeta: (n: number) =>
    `${count(n, 'character')} · stroke order · practice grid`,
  presetPrint: 'Print',
  presetPrintMeta: (n: number) => `${count(n, 'character')}, in list order`,
};

export const stars = (n: number, max = 3) =>
  '★'.repeat(n) + '☆'.repeat(max - n);
