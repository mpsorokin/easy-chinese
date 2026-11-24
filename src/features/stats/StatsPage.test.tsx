// @vitest-environment jsdom
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, beforeEach, expect, it } from 'vitest';
import { _resetProgressCache } from '@/features/progress/progressStore.ts';
import StatsPage from '@/features/stats/StatsPage.tsx';
import { t } from '@/shared/i18n/en.ts';

const page = () =>
  render(
    <MemoryRouter>
      <StatsPage />
    </MemoryRouter>,
  );

beforeEach(() => {
  localStorage.clear();
  _resetProgressCache();
});
afterEach(cleanup);

it('shows empty statistics for a new learner', () => {
  page();
  expect(screen.getByRole('heading', { name: t.stats.title })).toBeTruthy();
  expect(screen.getByText(t.stats.historyNote)).toBeTruthy();
  expect(screen.getByText(t.stats.reviewEmpty)).toBeTruthy();
  expect(screen.getAllByText(t.stats.recentEmpty)).toHaveLength(2);
});

it('shows written characters, word statuses and the review link', () => {
  const now = Date.now();
  localStorage.setItem(
    'hanzi:progress',
    JSON.stringify({
      version: 2,
      chars: { 人: { best: 3, attempts: 2, mistakes: 0, lastAt: now } },
      lessons: {},
      srs: { 人: { box: 0, due: now - 1000 } },
      history: { '2026-11-25': { xp: 3, chars: 1, answers: 0 } },
    }),
  );
  localStorage.setItem('hanzi:vocabulary', JSON.stringify({ 人: 'known' }));
  page();
  expect(screen.getByLabelText(t.stats.charLabel('人', 3, 2))).toBeTruthy();
  expect(screen.getByText(t.stats.reviewCount(1))).toBeTruthy();
  expect(
    screen
      .getByRole('link', { name: t.stats.reviewStart })
      .getAttribute('href'),
  ).toBe('/hsk/1/journey/review');
  expect(screen.queryByText(t.stats.historyNote)).toBeNull();
});
