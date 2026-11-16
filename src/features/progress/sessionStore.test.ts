// @vitest-environment jsdom
import { beforeEach, describe, expect, it, vi, afterEach } from 'vitest';
import type { ChoiceQuestion } from '../../domain/exercises.ts';
import {
  SESSION_TTL_MS,
  clearQuiz,
  clearStory,
  isQuestion,
  loadQuiz,
  loadSessions,
  saveQuiz,
  saveStory,
} from './sessionStore.ts';

const q = (prompt: string): ChoiceQuestion => ({
  kind: 'choice',
  prompt,
  options: ['a', 'b', 'c', 'd'],
  answer: 1,
  reveal: prompt,
});
const right = { right: true, reveal: 'x' };

describe('sessionStore', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(1_000_000);
  });
  afterEach(() => vi.useRealTimers());

  it('saves a round in progress and loads it back', () => {
    saveQuiz('1:c1p1:practice', [q('人'), q('大')], [right]);
    expect(loadQuiz('1:c1p1:practice')).toEqual({
      questions: [q('人'), q('大')],
      answers: [right],
      at: 1_000_000,
    });
  });

  it('drops rounds with no answers, finished rounds and cleared ones', () => {
    saveQuiz('a', [q('人')], []);
    expect(loadQuiz('a')).toBeUndefined();
    saveQuiz('b', [q('人')], [right]);
    expect(loadQuiz('b')).toBeUndefined();
    saveQuiz('c', [q('人'), q('大')], [right]);
    clearQuiz('c');
    expect(loadQuiz('c')).toBeUndefined();
  });

  it('forgets old work', () => {
    saveQuiz('a', [q('人'), q('大')], [right]);
    saveStory('1:c1:story', 3, 13);
    vi.setSystemTime(1_000_000 + SESSION_TTL_MS + 1);
    expect(loadSessions()).toEqual({ quiz: {}, story: {} });
  });

  it('keeps the dialogue step reached, from step 2 to the last one', () => {
    saveStory('1:c1:story', 1, 13);
    expect(loadSessions().story).toEqual({});
    saveStory('1:c1:story', 13, 13);
    expect(loadSessions().story['1:c1:story']).toMatchObject({
      step: 13,
      total: 13,
    });
    clearStory('1:c1:story');
    expect(loadSessions().story).toEqual({});
  });

  it('ignores broken stored data', () => {
    localStorage.setItem(
      'hanzi:sessions',
      JSON.stringify({
        quiz: {
          bad: { questions: [{ kind: 'choice' }], answers: [], at: 1_000_000 },
        },
        story: { s: { step: 9, total: 3, at: 1_000_000 } },
      }),
    );
    expect(loadSessions()).toEqual({ quiz: {}, story: {} });
    localStorage.setItem('hanzi:sessions', '{oops');
    expect(loadSessions()).toEqual({ quiz: {}, story: {} });
  });
});

describe('isQuestion', () => {
  it('checks each kind of question', () => {
    expect(isQuestion(q('人'))).toBe(true);
    expect(isQuestion({ ...q('人'), answer: 9 })).toBe(false);
    expect(
      isQuestion({
        kind: 'build',
        mode: 'gap',
        prompt: 'p',
        reveal: 'r',
        cells: ['学', '习'],
        blanks: [0, 1],
        tiles: ['学', '习', '中'],
        tileLang: 'zh',
      }),
    ).toBe(true);
    expect(
      isQuestion({
        kind: 'build',
        mode: 'gap',
        prompt: 'p',
        reveal: 'r',
        cells: ['学'],
        blanks: [3],
        tiles: [],
        tileLang: 'zh',
      }),
    ).toBe(false);
    expect(
      isQuestion({
        kind: 'write',
        prompt: 'p',
        hint: 'h',
        answer: '学习',
        reveal: 'r',
        audio: { text: '学习' },
      }),
    ).toBe(true);
    expect(isQuestion({ kind: 'other', prompt: 'p', reveal: 'r' })).toBe(false);
  });
});
