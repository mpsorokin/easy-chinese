// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { MemoryRouter } from 'react-router';
import { afterEach, expect, it } from 'vitest';
import { t } from '../../shared/i18n/en.ts';
import DialogueReader from './DialogueReader.tsx';

function Reader(
  props: Pick<Parameters<typeof DialogueReader>[0], 'lines' | 'variant'>,
) {
  const [shown, setShown] = useState(false);
  return (
    <MemoryRouter>
      <DialogueReader
        title="Title"
        backTo="/"
        backLabel="Back"
        shown={shown}
        onToggle={() => setShown((s) => !s)}
        {...props}
      />
    </MemoryRouter>
  );
}

afterEach(cleanup);

const toggle = () =>
  screen.getByRole('button', { name: new RegExp(t.showPinyinEnglish) });

it('shows ruby and English of an exercise, the button after the lines', () => {
  const { container } = render(
    <Reader
      lines={[
        { segments: [{ t: '你好', py: 'nǐ hǎo' }, { t: '！' }], en: 'Hello!' },
      ]}
    />,
  );
  expect(container.querySelector('ruby rt')?.textContent).toBe('nǐ hǎo');
  expect(screen.getByText('Hello!')).toBeTruthy();
  const main = container.querySelector('main')!;
  expect(main.className).not.toContain('course-story');
  expect(main.lastElementChild).toBe(toggle());
});

it('reveals the pinyin and English of a story line on demand', () => {
  const { container } = render(
    <Reader
      variant="story"
      lines={[{ zh: '我很好。', pinyin: 'Wǒ hěn hǎo.', en: 'I am fine.' }]}
    />,
  );
  expect(container.querySelector('main')!.className).toContain('course-story');
  expect(screen.getByText('我很好。')).toBeTruthy();
  expect(screen.queryByText('Wǒ hěn hǎo.')).toBeNull();
  expect(screen.queryByText('I am fine.')).toBeNull();

  fireEvent.click(toggle());
  expect(screen.getByText('Wǒ hěn hǎo.')).toBeTruthy();
  expect(screen.getByText('I am fine.')).toBeTruthy();
  expect(
    screen
      .getByRole('button', { name: new RegExp(t.hidePinyinEnglish) })
      .getAttribute('aria-expanded'),
  ).toBe('true');
});
