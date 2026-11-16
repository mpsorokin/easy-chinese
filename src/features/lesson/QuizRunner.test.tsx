// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import type { Question } from '../../domain/exercises.ts';
import QuizRunner from './QuizRunner.tsx';

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
