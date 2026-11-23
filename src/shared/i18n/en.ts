// All user-facing strings (English). Keep UI text here rather than in components.
import type { CharEntry } from '../../domain/types.ts';
import { plural } from '../lib/plural.ts';
import type { Grade } from '../../domain/grading.ts';
import {
  exerciseNumber,
  type CourseExercise,
} from '../../data/courseExercise.ts';

// A number written in Chinese characters, up to 99: 1 → 一, 12 → 十二, 27 → 二十七.
const CN_DIGITS = '零一二三四五六七八九';
const chineseNumber = (n: number): string => {
  if (n < 10) return CN_DIGITS.charAt(n);
  if (n >= 100) return String(n);
  const tens = Math.floor(n / 10);
  const ones = n % 10;
  return (
    (tens > 1 ? CN_DIGITS.charAt(tens) : '') +
    '十' +
    (ones ? CN_DIGITS.charAt(ones) : '')
  );
};

const count = (n: number, one: string, many?: string) =>
  `${n} ${plural(n, one, many)}`;

export const t = {
  darkTheme: 'Dark theme',
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
  openLesson: 'Open lesson',
  viewCourse: 'View course',
  myClasses: 'My Classes',
  myClassesDescription: 'Materials from lessons with your teacher',
  viewClasses: 'View classes',
  noClasses: 'No class materials yet.',
  levelMeta: (chars: number, words: number) =>
    `${count(chars, 'character')} · ${count(words, 'word')}`,
  topicsDone: (done: number, total: number) => `${done} of ${total} topics`,
  lessonsProgress: (done: number, total: number) =>
    `${done} / ${total} lessons`,
  percent: (n: number) => `${n} %`,
  completed: 'completed',
  soon: 'soon',
  freeWrite: 'Free writing',
  printPdf: 'Print PDF',
  chooseHskLevel: (tool: string) => `${tool} · Choose HSK level`,
  otherLevels: 'Coming soon',

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
  continueLesson: (step: number, total: number) =>
    `Continue lesson · ${step} / ${total}`,
  nextExercise: 'Next',
  finishLesson: 'Finish lesson',
  stepOfTotal: (i: number, n: number) => `${i} / ${n}`,
  lessonProgressLabel: 'Lesson progress',
  // Exercise cards of a lesson in the "Lessons" tab (features/lesson/lessonNav.ts).
  courseExercises: (ex: CourseExercise) =>
    ex === 'words' ? 'Words' : `Exercise ${exerciseNumber(ex)}`,
  // Chinese subtitle of a dialogue exercise.
  courseExerciseChinese: (ex: CourseExercise) =>
    ex === 'words' ? '生词' : `练习${chineseNumber(exerciseNumber(ex))}`,
  courseExerciseDescriptions: <Partial<Record<CourseExercise, string>>>{
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
    exercise18: 'Phone calls with 喂',
    exercise19: 'Family: older sister',
    exercise20: 'Talking about work',
    exercise21: 'Still with 还',
    exercise22: 'Busy or not?',
    exercise23: 'Yes-no questions with 吗',
    exercise24: 'Right or not?',
    exercise25: 'Too much with 太…了',
    exercise26: 'Together with 一起',
    exercise27: 'Missing someone with 想',
    words: 'Learn new vocabulary',
  },
  courseExercisesAvailable: (available: number, total: number) =>
    `${available} of ${total} exercises available`,
  listenDialogueLine: (line: number) => `Listen to line ${line}`,
  showPinyinEnglish: 'Show pinyin & English',
  hidePinyinEnglish: 'Hide pinyin & English',
  exercises: {
    write: { title: 'Writing', hint: 'write each character' },
    wordWrite: {
      title: '写 Write words',
      hint: 'whole words by hand, 3 times',
    },
    pick: {
      title: '填 Pick the characters',
      hint: 'build words from 5–7 characters',
    },
    meaning: { title: '字 → meaning', hint: 'recognize the meaning' },
    pinyin: { title: '字 → pinyin', hint: 'reading and tone' },
    words: { title: '词 Words', hint: 'words of the lesson' },
  },
  writeProgress: (done: number, total: number) => `${done}/${total} characters`,
  partOfWord: 'Part of the word',
  charOfWord: (i: number, n: number) => `character ${i} of ${n}`,

  // Quiz
  quizOf: (i: number, n: number) => `${i} / ${n}`,
  quizRight: 'Correct!',
  quizWrong: 'Not quite',
  quizNext: 'Next ›',
  quizBuild: 'Build the word',
  quizListenBuild: 'Listen and build',
  quizReading: 'Build the reading',
  quizGap: 'Pick the characters',
  quizListenChoose: 'Listen and choose',
  quizToWord: 'Choose the word',
  quizWriteWord: 'Write the word',
  quizPass: (i: number, n: number) => `Pass ${i} / ${n}`,
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
  quizSentence: 'Build the sentence',

  // Journey map (features/journey)
  tabJourney: 'Journey',
  journey: {
    lessonZh: (n: number) => `第${chineseNumber(n)}课`,
    streak: (n: number) => (n === 1 ? '1 day' : `${n} days`),
    streakLabel: 'Days in a row',
    xpLabel: (xp: number, goal: number) => `Today: ${xp} of ${goal} XP`,
    xpShort: (xp: number, goal: number) => `${Math.min(xp, goal)}/${goal}`,
    goalMet: 'Daily goal reached',
    continue: 'Continue',
    review: 'Review',
    allDone: 'Every step done — keep reviewing!',
    toMap: 'Back to map',
    youAreHere: 'You are here',
    start: 'Start',
    again: 'Again',
    resume: 'Resume',
    partial: (done: number, total: number) => `${done}/${total}`,
    viewJourney: 'View journey',
    storyHeading: 'Read the story',
    startStory: 'Start story',
    streakDays: (n: number) => `${n}-day streak`,
    stepsDone: (done: number, total: number) => `${done} / ${total} steps`,
    kinds: {
      story: 'Story',
      learn: 'Learn',
      practice: 'Practice',
      checkpoint: 'Checkpoint',
      review: 'Review',
    },
    hints: {
      story: 'Read the lesson’s dialogues',
      learn: 'Write the part’s characters',
      practice: 'Meaning, pinyin and words, mixed',
      checkpoint: 'The whole lesson, with dialogue lines',
      review: 'Characters and words due for review',
    },
    nodeTitle: (kind: string, part?: number) =>
      part ? `${kind} · Part ${part}` : kind,
    reviewDue: (n: number) => `${count(n, 'item')} to review`,
    practiceTitle: (lesson: number, part: number) =>
      `Lesson ${lesson} · Part ${part} · Practice`,
    checkpointTitle: (lesson: number) => `Lesson ${lesson} · Checkpoint`,
    reviewTitle: 'Review',
    xpGained: (xp: number) => `+${xp} XP`,
    sealed: 'Lesson sealed 印',
    notSealed: 'Two stars seal the lesson — try again soon',
  },

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
  finishSet: 'Finish ›',
  // Shown when every character of a set has been written.
  setDoneTitle: 'All characters written!',
  setDoneDetails: (n: number) =>
    `You wrote all ${n} character${n === 1 ? '' : 's'} of this set.`,
  setWriteAgain: '↺ Write again',
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
  notInLevel: (chars: string, level: string) =>
    `Not in HSK ${level}, skipped: ${chars}`,
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
