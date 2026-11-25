// @vitest-environment jsdom
import {
  act,
  cleanup,
  fireEvent,
  render,
  screen,
  within,
} from '@testing-library/react';
import { afterEach, expect, it, vi } from 'vitest';
import type { ChoiceQuestion, Question } from '@/domain/exercises/index.ts';
import QuizRunner from '@/features/lesson/quiz/QuizRunner.tsx';
import * as speech from '@/shared/lib/speech.ts';

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

const run = (q: Question) => {
  const onFinish = vi.fn();
  render(
    <QuizRunner
      questions={[q]}
      onFinish={onFinish}
      onAgain={() => {}}
      onExit={() => {}}
    />,
  );
  return onFinish;
};

const tap = (text: string) =>
  fireEvent.click(screen.getByRole('button', { name: text }));

it('picks every character of the word from the tiles', () => {
  const onFinish = run({
    kind: 'build',
    mode: 'gap',
    prompt: 'to study',
    hint: 'xuéxí',
    cells: ['学', '习'],
    blanks: [0, 1],
    tiles: ['中', '习', '语', '学', '文'],
    tileLang: 'zh',
    reveal: '学习',
  });
  expect(screen.getByText('Pick the characters')).toBeTruthy();
  expect(document.querySelector('.quiz-built .given')).toBeNull();
  tap('学');
  tap('习');
  expect(onFinish).toHaveBeenCalledWith(3);
});

it('builds the reading from syllable tiles', () => {
  const onFinish = run({
    kind: 'build',
    mode: 'reading',
    prompt: '学习',
    hint: 'to study',
    cells: ['xué', 'xí'],
    blanks: [0, 1],
    tiles: ['xí', 'xuě', 'xué', 'xì'],
    tileLang: 'pinyin',
    reveal: '学习',
  });
  tap('xué');
  tap('xì');
  expect(onFinish).toHaveBeenCalledWith(1);
  expect(document.querySelector('.quiz-built.wrong')).toBeTruthy();
});

it('chooses the Chinese word for a meaning', () => {
  const onFinish = run({
    kind: 'choice',
    mode: 'toWord',
    optionLang: 'zh',
    prompt: 'classmate',
    options: ['同学', '学习', '中文', '老师'],
    answer: 0,
    reveal: '同学',
  });
  expect(screen.getByText('Choose the word')).toBeTruthy();
  tap('同学');
  expect(onFinish).toHaveBeenCalledWith(3);
});

const listeningQuestion: ChoiceQuestion = {
  kind: 'choice',
  mode: 'listenOnly',
  prompt: '你好',
  hint: 'nǐ hǎo',
  options: ['hello', 'busy', 'coffee', 'friend'],
  answer: 0,
  reveal: '你好 · nǐ hǎo - hello',
  audio: { text: '你好' },
};

it('waits for playback before accepting an English answer and revealing the text', () => {
  vi.spyOn(speech, 'canSpeak').mockReturnValue(true);
  const speak = vi.spyOn(speech, 'speakChinese').mockImplementation(() => {});
  const onFinish = run(listeningQuestion);
  const hello = screen.getByRole<HTMLButtonElement>('button', {
    name: 'hello',
  });

  expect(speak).not.toHaveBeenCalled();
  expect(screen.queryByText('你好')).toBeNull();
  expect(screen.queryByText(/nǐ hǎo/)).toBeNull();
  expect(hello.disabled).toBe(true);

  tap('Play audio');
  expect(speak.mock.lastCall?.[0]).toBe('你好');
  expect(
    screen
      .getByRole('button', { name: 'Playing…' })
      .getAttribute('aria-disabled'),
  ).toBe('true');
  act(() => speak.mock.lastCall?.[1]?.onError?.());
  expect(screen.getByText(/Speech could not play/)).toBeTruthy();
  expect(hello.disabled).toBe(true);
  tap('Play audio');
  act(() => speak.mock.lastCall?.[1]?.onEnd?.());
  expect(hello.disabled).toBe(false);
  expect(screen.queryByText('你好')).toBeNull();
  tap('Replay');
  act(() => speak.mock.lastCall?.[1]?.onStop?.());
  expect(screen.getByRole('button', { name: 'Replay' })).toBeTruthy();
  tap('hello');

  expect(onFinish).toHaveBeenCalledWith(3);
  const feedback = within(screen.getByRole('status'));
  expect(feedback.getByText('你好').getAttribute('lang')).toBe('zh-Hans');
  expect(feedback.getByText('nǐ hǎo')).toBeTruthy();
  expect(feedback.getByText('hello')).toBeTruthy();
  expect(hello.classList.contains('right')).toBe(true);
});

it('keeps the listening prompt hidden when speech synthesis is unavailable', () => {
  vi.spyOn(speech, 'canSpeak').mockReturnValue(false);
  run(listeningQuestion);

  expect(screen.getByText('This browser cannot read text aloud.')).toBeTruthy();
  expect(screen.queryByText('你好')).toBeNull();
  expect(
    screen.getByRole<HTMLButtonElement>('button', { name: 'hello' }).disabled,
  ).toBe(true);
});

it('resumes a saved round at the first unanswered question', () => {
  const choice = (prompt: string): Question => ({
    kind: 'choice',
    prompt,
    options: ['one', 'two', 'three', 'four'],
    answer: 0,
    reveal: prompt,
  });
  const onFinish = vi.fn();
  const onProgress = vi.fn();
  render(
    <QuizRunner
      questions={[choice('人'), choice('大')]}
      initialAnswers={[{ right: false, reveal: '人' }]}
      onProgress={onProgress}
      onFinish={onFinish}
      onAgain={() => {}}
      onExit={() => {}}
    />,
  );
  expect(screen.getByText('2 / 2')).toBeTruthy();
  tap('one');
  expect(onProgress).toHaveBeenCalledWith([
    { right: false, reveal: '人' },
    { right: true, reveal: '大' },
  ]);
  // One of two right → one star.
  expect(onFinish).toHaveBeenCalledWith(1);
});
