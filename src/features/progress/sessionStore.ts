// Unfinished work, so leaving a page mid-way and coming back resumes it: the questions and
// answers of a quiz round, and the step reached in a lesson's dialogues. Stored under one
// key, `hanzi:sessions`; old entries are dropped.
import type { Question } from '@/domain/exercises.ts';
import { createStore } from '@/shared/lib/storage.ts';

export type QuizAnswer = { right: boolean; reveal: string };

type SavedQuiz = {
  questions: Question[];
  answers: QuizAnswer[];
  at: number;
};
type SavedStory = { step: number; total: number; at: number };

export type Sessions = {
  quiz: Record<string, SavedQuiz>;
  story: Record<string, SavedStory>;
};

type SessionStorage = { sessions: Sessions };

const sessionStore = createStore<SessionStorage>('hanzi:');

// Unfinished work older than this is forgotten.
export const SESSION_TTL_MS = 14 * 86_400_000;
const MAX_QUIZZES = 30;

const isObj = (x: unknown): x is Record<string, unknown> =>
  x !== null && typeof x === 'object' && !Array.isArray(x);
const isStr = (x: unknown): x is string => typeof x === 'string';
const isStrs = (x: unknown): x is string[] =>
  Array.isArray(x) && x.every(isStr);
const isInts = (x: unknown): x is number[] =>
  Array.isArray(x) && x.every((n) => Number.isInteger(n) && n >= 0);

// Enough checking that the quiz screens can render a stored question.
export function isQuestion(x: unknown): x is Question {
  if (!isObj(x) || !isStr(x.prompt) || !isStr(x.reveal)) return false;
  if (x.kind === 'choice')
    return (
      isStrs(x.options) &&
      Number.isInteger(x.answer) &&
      (x.answer as number) >= 0 &&
      (x.answer as number) < x.options.length
    );
  if (x.kind === 'build')
    return (
      isStr(x.mode) &&
      isStrs(x.cells) &&
      isInts(x.blanks) &&
      x.blanks.every((b) => b < (x.cells as string[]).length) &&
      isStrs(x.tiles) &&
      (x.tileLang === 'zh' || x.tileLang === 'pinyin')
    );
  if (x.kind === 'write')
    return (
      isStr(x.hint) &&
      isStr(x.answer) &&
      x.answer.length > 0 &&
      isObj(x.audio) &&
      isStr(x.audio.text)
    );
  return false;
}

const isAnswer = (x: unknown): x is QuizAnswer =>
  isObj(x) && typeof x.right === 'boolean' && isStr(x.reveal);

function normalizeQuiz(raw: unknown, now: number): SavedQuiz | undefined {
  if (!isObj(raw) || typeof raw.at !== 'number') return undefined;
  if (now - raw.at > SESSION_TTL_MS) return undefined;
  const { questions, answers } = raw;
  if (!Array.isArray(questions) || !questions.length) return undefined;
  if (!questions.every(isQuestion)) return undefined;
  if (!Array.isArray(answers) || !answers.every(isAnswer)) return undefined;
  // A finished round is not resumed.
  if (answers.length >= questions.length) return undefined;
  return { questions, answers, at: raw.at };
}

function normalizeStory(raw: unknown, now: number): SavedStory | undefined {
  if (!isObj(raw) || typeof raw.at !== 'number') return undefined;
  if (now - raw.at > SESSION_TTL_MS) return undefined;
  const { step, total } = raw;
  if (!Number.isInteger(step) || !Number.isInteger(total)) return undefined;
  if ((step as number) < 1 || (step as number) > (total as number))
    return undefined;
  return { step: step as number, total: total as number, at: raw.at };
}

const pick = <T>(
  raw: unknown,
  norm: (v: unknown, now: number) => T | undefined,
  now: number,
): Record<string, T> => {
  if (!isObj(raw)) return {};
  const out: [string, T][] = [];
  for (const [k, v] of Object.entries(raw)) {
    const n = norm(v, now);
    if (n !== undefined && k.length <= 64) out.push([k, n]);
  }
  return Object.fromEntries(out);
};

const normalizeSessions =
  (now: number) =>
  (raw: unknown): Sessions => ({
    quiz: pick(isObj(raw) ? raw.quiz : undefined, normalizeQuiz, now),
    story: pick(isObj(raw) ? raw.story : undefined, normalizeStory, now),
  });

export const loadSessions = (now = Date.now()): Sessions =>
  sessionStore.get('sessions', normalizeSessions(now));

function update(change: (s: Sessions) => Sessions) {
  sessionStore.set('sessions', change(loadSessions()));
}

export const loadQuiz = (key: string): SavedQuiz | undefined =>
  loadSessions().quiz[key];

// Saves a round in progress; a finished round (or one with no answers) is removed.
export function saveQuiz(
  key: string,
  questions: Question[],
  answers: QuizAnswer[],
): void {
  update((s) => {
    const quiz = { ...s.quiz };
    delete quiz[key];
    if (answers.length > 0 && answers.length < questions.length)
      quiz[key] = { questions, answers, at: Date.now() };
    // Keep only the most recent rounds.
    const kept = Object.entries(quiz)
      .sort((a, b) => b[1].at - a[1].at)
      .slice(0, MAX_QUIZZES);
    return { ...s, quiz: Object.fromEntries(kept) };
  });
}

export const clearQuiz = (key: string) => saveQuiz(key, [], []);

// The step reached in a lesson's dialogues (step 1 is not worth keeping).
export function saveStory(key: string, step: number, total: number): void {
  update((s) => {
    const story = { ...s.story };
    delete story[key];
    if (step > 1 && step <= total) story[key] = { step, total, at: Date.now() };
    return { ...s, story };
  });
}

// The dialogues were read to the end.
export const clearStory = (key: string) => saveStory(key, 0, 0);
