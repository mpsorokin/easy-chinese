// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { useState } from 'react';
import { MemoryRouter } from 'react-router';
import { afterEach, expect, it } from 'vitest';
import { t } from '@/shared/i18n/en.ts';
import DialogueReader from '@/features/lesson/DialogueReader.tsx';

function Reader(props: Pick<Parameters<typeof DialogueReader>[0], 'lines'>) {
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
  expect(container.querySelector('main')!.lastElementChild).toBe(toggle());
});
