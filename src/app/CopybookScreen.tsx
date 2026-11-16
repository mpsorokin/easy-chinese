import { useCallback, useEffect, useRef } from 'react';
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router';
import Header from './Header.tsx';
import StrokeOrder from '../features/stroke-order/StrokeOrder.tsx';
import CopybookSteps from '../features/copybook/CopybookSteps.tsx';
import WritingCell from '../features/writer/WritingCell.tsx';
import type { WriterHandle } from '../features/writer/types.ts';
import SummaryOverlay from '../features/copybook/SummaryOverlay.tsx';
import WordContext from '../features/copybook/WordContext.tsx';
import Controls from '../features/copybook/Controls.tsx';
import SettingsPanel from '../features/settings/SettingsPanel.tsx';
import ThemeControl from '../features/settings/ThemeControl.tsx';
import { ALL, normalizeLastChar, wrapAt } from '../data/chars.ts';
import {
  hskCharEntry,
  lessonChars,
  lessonWords,
  levelData,
  normalizeHskChars,
  selectableEntry,
} from '../data/hsk.ts';
import { courseLesson, coursePart } from '../data/courseLessons.ts';
import type { CharEntry, HskChar, HskWord } from '../domain/types.ts';
import type { FinalGrade } from '../domain/grading.ts';
import { copybookStore } from '../features/copybook/copybookStore.ts';
import type { LastKey } from '../features/copybook/copybookStore.ts';
import { useProgress } from '../features/progress/useProgress.ts';
import { normalizeSettings } from '../features/settings/settings.ts';
import { usePersistentState } from '../shared/hooks/usePersistentState.ts';
import { useCharData } from '../data/useCharData.ts';
import { useCopybook } from '../features/copybook/useCopybook.ts';
import { t } from '../shared/i18n/en.ts';
import WriteIcon from '../shared/ui/WriteIcon.tsx';
import {
  courseLessonPath,
  lessonPath,
  levelCharsPath,
  levelLessonsPath,
  levelPath,
} from '../features/lesson/lessonNav.ts';
import './write.css';

// The stroke-order strip is shown unless the user hid it.
const normalizeShown = (raw: unknown): boolean => raw !== false;

// What the copybook cycles through. Every set comes from the URL, so a page survives a
// reload or a shared link, and keeps its own open character (lastKey).
type CopybookSet = {
  id: string; // remounts the copybook when the set changes
  list: readonly CharEntry[];
  lastKey: LastKey;
  back: { to: string; label: string };
  level?: string; // HSK level shown next to the counter
  exitable: boolean; // a "leave the set" button that opens the deck copybook
  words?: readonly HskWord[]; // lesson words, to show which word a character belongs to
};

const entries = (chars: readonly HskChar[]) => chars.map(hskCharEntry);

// '/write' the decks; '/write/<level>' a whole HSK level; '/write/<level>?set=…' characters
// chosen on that level's list ('&from=write' when they came from the Write tool).
export default function CopybookScreen() {
  const { level: levelId } = useParams();
  const [search] = useSearchParams();
  const level = levelData(levelId);
  if (!levelId)
    return (
      <Copybook
        set={{
          id: 'decks',
          list: ALL,
          lastKey: 'last',
          back: { to: '/', label: t.homeLabel },
          exitable: false,
        }}
      />
    );
  if (!level?.chars.length) return <Navigate to="/" replace />;

  const chosen = search.get('set');
  if (chosen !== null) {
    const mode = search.get('from') === 'write' ? 'write' : undefined;
    const backTo = levelCharsPath(level.id, mode);
    const chars = normalizeHskChars([...chosen], level);
    if (!chars.length) return <Navigate to={backTo} replace />;
    return (
      <Copybook
        set={{
          id: `s${level.id}:${chars.join('')}`,
          list: entries(chars.flatMap((c) => selectableEntry(c, level) ?? [])),
          lastKey: `last:s${level.id}`,
          back: { to: backTo, label: mode ? t.freeWrite : t.tabAllChars },
          level: level.id,
          exitable: true,
        }}
      />
    );
  }
  return (
    <Copybook
      set={{
        id: `l${level.id}`,
        list: entries(level.chars),
        lastKey: `last:${level.id}`,
        back: { to: levelPath(level.id), label: t.levelTitle(level.id) },
        level: level.id,
        exitable: false,
      }}
    />
  );
}

// '/hsk/<level>/topics/<n>/write': the characters of a themed topic.
export function TopicCopybookScreen() {
  const params = useParams();
  const level = levelData(params.level);
  const idx = level
    ? level.lessons.findIndex((l) => String(l.id) === params.lesson)
    : -1;
  const lesson = level?.lessons[idx];
  if (!level) return <Navigate to="/" replace />;
  if (!lesson) return <Navigate to={levelPath(level.id)} replace />;
  const back = lessonPath(level.id, lesson.id);
  const chars = lessonChars(level, idx);
  if (!chars.length) return <Navigate to={back} replace />;
  return (
    <Copybook
      set={{
        id: `t${level.id}:${lesson.id}`,
        list: entries(chars),
        lastKey: `last:t${level.id}:${lesson.id}`,
        back: { to: back, label: t.lessonN(lesson.id) },
        level: level.id,
        exitable: true,
        words: lessonWords(level, idx),
      }}
    />
  );
}

// '/hsk/<level>/lessons/<n>/write/<part>': one part of a lesson of the Lessons tab.
export function CourseCopybookScreen() {
  const params = useParams();
  const level = levelData(params.level);
  const lesson = courseLesson(params.lesson);
  const partNumber = Number(params.part);
  const part = lesson && coursePart(lesson, partNumber);
  if (!level) return <Navigate to="/" replace />;
  if (!lesson) return <Navigate to={levelLessonsPath(level.id)} replace />;
  const back = courseLessonPath(level.id, lesson.id);
  if (!part?.length) return <Navigate to={back} replace />;
  return (
    <Copybook
      set={{
        id: `c${level.id}:${lesson.id}:${partNumber}`,
        list: entries(part),
        lastKey: `last:c${level.id}:${lesson.id}:${partNumber}`,
        back: { to: back, label: t.lessonN(lesson.id) },
        level: level.id,
        exitable: true,
        // All the lesson's words, also those finished in a later part.
        words: (lesson.words ?? []).map((w) => ({
          w: w.zh,
          py: w.py,
          en: w.en,
        })),
      }}
    />
  );
}

// The page that opened a set may pass the character to start at ({ start } in the
// navigation state); otherwise the set's last open character is used.
function startChar(state: unknown, list: readonly CharEntry[]) {
  if (state === null || typeof state !== 'object' || !('start' in state))
    return undefined;
  const { start } = state;
  return typeof start === 'string' && list.some((e) => e.c === start)
    ? start
    : undefined;
}

function Copybook({ set }: { set: CopybookSet }) {
  return <CopybookPage key={set.id} set={set} />;
}

function CopybookPage({ set }: { set: CopybookSet }) {
  const { list, back } = set;
  const location = useLocation();
  const navigate = useNavigate();
  const start = startChar(location.state, list);
  const [lastChar, setLastChar] = usePersistentState(
    copybookStore,
    set.lastKey,
    normalizeLastChar,
    { sync: false, initial: start }, // each tab keeps its own open character
  );
  // The start character is used once: drop it, so a reload keeps the current one.
  useEffect(() => {
    if (start)
      void navigate(location.pathname + location.search, {
        replace: true,
        state: null,
      });
  }, [start, navigate, location.pathname, location.search]);
  const [settings, setSettings] = usePersistentState(
    copybookStore,
    'settings',
    normalizeSettings,
  );
  const [strokeOrderShown, setStrokeOrderShown] = usePersistentState(
    copybookStore,
    'strokeOrderShown',
    normalizeShown,
  );
  const { best, record } = useProgress();

  const writerRef = useRef<WriterHandle>(null);
  const idx = Math.max(
    0,
    list.findIndex((x) => x.c === lastChar),
  );
  const item = wrapAt(list, idx);
  const charData = useCharData(item.c);
  const { data } = charData; // null while loading or after an error

  // Event handler (called when the last step is done), not during render.
  const onFinish = useCallback(
    (char: string, { grade, total }: FinalGrade) =>
      record({
        char,
        mode: 'copybook',
        grade,
        mistakes: total,
        at: Date.now(),
      }),
    [record],
  );

  const copybook = useCopybook({
    item,
    data,
    settings,
    writerRef,
    onFinish,
  });

  const retryLoad = () => {
    charData.retry();
    copybook.reset(); // new quizKey makes WritingCell load the character again
  };

  const show = (c: string) => {
    setLastChar(c);
    copybook.reset();
  };
  const go = (i: number) => show(wrapAt(list, i).c);

  return (
    <main className="page-frame write-page">
      <div className="write-context">
        <div className="theme-toolbar">
          <Link className="write-back" to={back.to}>
            <WriteIcon name="back" /> {back.label}
          </Link>
          <ThemeControl />
        </div>
        <div className="write-progress">
          {set.level && (
            <span className="write-level">{t.levelTitle(set.level)}</span>
          )}
          <span>{t.characterOf(idx + 1, list.length)}</span>
          {set.exitable && (
            // A set lives in the URL, so leaving it means opening the deck copybook.
            <Link className="write-exit" to="/write">
              {t.practiceExit}
            </Link>
          )}
        </div>
      </div>

      <Header
        item={item}
        stars={best[item.c]}
        onPrev={() => go(idx - 1)}
        onNext={() => go(idx + 1)}
      />

      <WordContext char={item.c} words={set.words} />

      <StrokeOrder
        data={data}
        current={copybook.curStroke}
        onPick={(i) => writerRef.current?.highlight(i)}
        shown={strokeOrderShown}
        onToggle={() => setStrokeOrderShown((v) => !v)}
      />

      <CopybookSteps
        data={data}
        step={copybook.step}
        results={copybook.results}
        gridKind={settings.grid}
      />

      <WritingCell
        ref={writerRef}
        char={item.c}
        gridKind={settings.grid}
        outline={copybook.outline}
        active={copybook.active}
        quizKey={copybook.quizKey}
        strict={settings.strict}
        hint={settings.hint}
        speed={settings.speed}
        {...copybook.handlers}
      >
        <SummaryOverlay
          item={item}
          summary={copybook.summary}
          onAgain={copybook.reset}
          onNext={() => go(idx + 1)}
        />
      </WritingCell>

      {/* Only a failed load is reported here; stroke-by-stroke hints are not shown. */}
      {charData.status === 'error' && (
        <div className="status err" role="alert">
          <WriteIcon name="info" />
          <span>
            {t.loadError}
            <button className="retry" onClick={retryLoad}>
              {t.retry}
            </button>
          </span>
        </div>
      )}

      <Controls
        onShow={copybook.showAnimation}
        onHint={copybook.showHint}
        onRestart={copybook.reset}
      />

      <SettingsPanel settings={settings} onChange={setSettings} />

      {back.to !== '/' && (
        <Link className="write-home" to="/">
          {t.homeLabel}
        </Link>
      )}
    </main>
  );
}
