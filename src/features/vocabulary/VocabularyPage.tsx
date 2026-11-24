import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { vocabulary } from '@/data/vocabulary.ts';
import { searchVocabulary } from '@/features/vocabulary/searchVocabulary.ts';
import WordStatusControl from '@/features/vocabulary/WordStatusControl.tsx';
import {
  useWordStatuses,
  wordStatuses,
  type WordStatus,
} from '@/features/vocabulary/vocabularyStore.ts';
import PageToolbar from '@/features/settings/PageToolbar.tsx';
import { useProgress } from '@/features/progress/useProgress.ts';
import { TOP_BOX } from '@/domain/srs.ts';
import { wordPractice, type WordPractice } from '@/features/stats/stats.ts';
import { t } from '@/shared/i18n/en.ts';
import { readingPath } from '@/shared/paths.ts';
import WriteIcon from '@/shared/ui/WriteIcon.tsx';
import '@/features/vocabulary/vocabulary.css';

const filters = ['all', ...wordStatuses] as const;
type Filter = (typeof filters)[number];
const practiceFilters = ['any', 'written', 'unwritten'] as const;
type PracticeFilter = (typeof practiceFilters)[number];

// Writing stars and quiz memory of a word, from the copybook and quizzes.
function PracticeBadges({ written, box }: WordPractice) {
  return (
    <span className="vocabulary-practice">
      <span
        className="vocabulary-written"
        data-written={written ? 'true' : undefined}
        title={written ? t.wordWritten(written) : t.wordNotWritten}
      >
        <span aria-hidden>
          ✍{' '}
          {written ? (
            <>
              {'★'.repeat(written)}
              <span className="vocabulary-star-off">
                {'★'.repeat(3 - written)}
              </span>
            </>
          ) : (
            '–'
          )}
        </span>
        <span className="visually-hidden">
          {written ? t.wordWritten(written) : t.wordNotWritten}
        </span>
      </span>
      {box !== undefined && (
        <span
          className="vocabulary-memory"
          title={t.wordMemory(box, TOP_BOX)}
          role="img"
          aria-label={t.wordMemory(box, TOP_BOX)}
        >
          {Array.from({ length: TOP_BOX }, (_, i) => (
            <span key={i} data-on={i < box ? 'true' : undefined} />
          ))}
        </span>
      )}
    </span>
  );
}

export default function VocabularyPage() {
  const statuses = useWordStatuses();
  const { progress } = useProgress();
  const [query, setQuery] = useState('');
  const [practice, setPractice] = useState<PracticeFilter>('any');
  const [filter, setFilter] = useState<Filter>(() =>
    vocabulary.some(({ w }) => statuses[w] === 'learning') ? 'learning' : 'all',
  );
  const searchField = useRef<HTMLInputElement>(null);
  const filterGroup = useRef<HTMLDivElement>(null);
  const counts = { all: vocabulary.length, new: 0, learning: 0, known: 0 };
  for (const { w } of vocabulary) counts[statuses[w] ?? 'new']++;

  const searching = query.trim() !== '';
  const matches = searchVocabulary(query);
  const written = (w: string) =>
    wordPractice(progress, w).written !== undefined;
  const pool =
    practice === 'any'
      ? matches
      : matches.filter(({ w }) => written(w) === (practice === 'written'));
  const results =
    filter === 'all'
      ? pool
      : pool.filter(({ w }) => (statuses[w] ?? 'new') === filter);
  const hasMatchesInOtherFilters = searching && pool.length > 0;
  const hiddenByPractice = pool.length === 0 && matches.length > 0;

  function showAll() {
    setFilter('all');
    filterGroup.current?.querySelector<HTMLButtonElement>('button')?.focus();
  }

  function moveFocusBeforeRemovingWord(
    next: WordStatus,
    control: HTMLSelectElement,
  ) {
    if (filter === 'all' || filter === next) return;
    const row = control.closest('li');
    const neighbor = row?.nextElementSibling ?? row?.previousElementSibling;
    const target =
      neighbor?.querySelector('select') ??
      filterGroup.current?.querySelector<HTMLButtonElement>(
        'button[aria-pressed="true"]',
      );
    target?.focus({ preventScroll: true });
  }

  return (
    <main className="app page-frame vocabulary-page">
      <header className="page-header">
        <PageToolbar back={{ to: '/', children: t.homeLabel }}>
          <Link className="toolbar-link" to={readingPath}>
            {t.reading}
          </Link>
        </PageToolbar>
        <h1>{t.vocabulary}</h1>
        <p>{t.vocabularyDescription}</p>
      </header>
      <div className="vocabulary-controls">
        <div className="vocabulary-search" role="search">
          <WriteIcon name="search" />
          <input
            ref={searchField}
            type="search"
            value={query}
            aria-label={t.vocabularySearch}
            placeholder={t.vocabularySearch}
            autoComplete="off"
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
        <div
          className="vocabulary-filters"
          role="group"
          aria-label={t.vocabularyFilter}
          ref={filterGroup}
        >
          {filters.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={filter === item}
              data-word-status={item}
              onClick={() => setFilter(item)}
            >
              <span>
                {item === 'all' ? t.vocabularyAllFilter : t.wordStatus[item]}
              </span>
              <span className="vocabulary-filter-count">{counts[item]}</span>
            </button>
          ))}
        </div>
        <div
          className="vocabulary-filters vocabulary-practice-filters"
          role="group"
          aria-label={t.vocabularyPracticeFilter}
        >
          {practiceFilters.map((item) => (
            <button
              type="button"
              key={item}
              aria-pressed={practice === item}
              onClick={() => setPractice(item)}
            >
              {t.vocabularyPractice[item]}
            </button>
          ))}
        </div>
        <p className="vocabulary-result-count" role="status">
          {t.vocabularyResultCount(results.length, searching)}
        </p>
      </div>
      {results.length === 0 && hiddenByPractice ? (
        <section className="vocabulary-empty">
          <h2>{t.vocabularyEmpty}</h2>
          <p>{t.vocabularyPracticeEmptyHint}</p>
          <button type="button" onClick={() => setPractice('any')}>
            {t.vocabularyPracticeReset}
          </button>
        </section>
      ) : results.length === 0 ? (
        <section className="vocabulary-empty">
          <h2>
            {searching ? t.vocabularyEmpty : t.vocabularyEmptyStatus[filter]}
          </h2>
          <p>
            {searching
              ? hasMatchesInOtherFilters
                ? t.vocabularySearchOtherFilters
                : t.vocabularySearchHint
              : t.vocabularyEmptyHint[filter]}
          </p>
          {searching && !hasMatchesInOtherFilters ? (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                searchField.current?.focus();
              }}
            >
              {t.vocabularyClearSearch}
            </button>
          ) : filter !== 'all' ? (
            <button type="button" onClick={showAll}>
              {searching ? t.vocabularyShowResults : t.vocabularyBrowseAll}
            </button>
          ) : null}
        </section>
      ) : (
        <ul className="vocabulary-list" role="list">
          {results.map(({ w, py, en }) => (
            <li key={w}>
              <span className="vocabulary-entry">
                <span className="vocabulary-word">
                  <b lang="zh-Hans">{w}</b>
                  <span lang="zh-Latn-pinyin">{py}</span>
                </span>
                <span className="vocabulary-meaning">{en}</span>
                <PracticeBadges {...wordPractice(progress, w)} />
              </span>
              <WordStatusControl
                word={w}
                status={statuses[w]}
                beforeChange={moveFocusBeforeRemovingWord}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
