// The journey map of a level: every course lesson as a region of steps (read the dialogues,
// learn and practise each part, the checkpoint), each step's state from stored progress, and
// the step to continue with. No React.
import {
  COURSE_LESSONS,
  courseParts,
  storySteps,
} from '../../data/courseLessons.ts';
import type { CourseLesson } from '../../data/courseLessons.ts';
import type { Grade } from '../../domain/grading.ts';
import { dueItems } from '../../domain/srs.ts';
import {
  FROM_JOURNEY,
  courseRunPath,
  courseWritePath,
  journeyCheckpointPath,
  journeyPracticePath,
  journeyReviewPath,
} from '../lesson/lessonNav.ts';
import {
  PASS_GRADE,
  courseLessonKey,
  journeyKey,
  lessonResults,
  writeResult,
} from '../progress/progress.ts';
import type { Progress } from '../progress/progress.ts';
import type { Sessions } from '../progress/sessionStore.ts';

export type NodeKind = 'story' | 'learn' | 'practice' | 'checkpoint' | 'review';

type JourneyNode = {
  id: string;
  kind: NodeKind;
  lesson: number;
  part?: number;
  href: string;
  chars: string[]; // characters the step covers (empty for the story and review)
  count?: number; // review: items due
};

type Region = { lesson: CourseLesson; nodes: JourneyNode[] };

type NodeState = 'untouched' | 'started' | 'done' | 'mastered';
// `partial`: how far an unfinished round got (answers, dialogue steps, characters written).
type NodeStatus = {
  state: NodeState;
  stars: 0 | Grade;
  partial?: { done: number; total: number };
};

const UNTOUCHED: NodeStatus = { state: 'untouched', stars: 0 };

const hasStory = (lesson: CourseLesson) => storySteps(lesson).length > 0;

export function buildJourney(
  level: string,
  lessons: readonly CourseLesson[] = COURSE_LESSONS,
): Region[] {
  return lessons.flatMap((lesson) => {
    const parts = courseParts(lesson);
    if (!parts.length) return [];
    const id = lesson.id;
    const nodes: JourneyNode[] = [];
    if (hasStory(lesson))
      nodes.push({
        id: journeyKey(level, id, 'story'),
        kind: 'story',
        lesson: id,
        href: `${courseRunPath(level, id, 1)}?${FROM_JOURNEY}`,
        chars: [],
      });
    parts.forEach((p, k) => {
      const part = k + 1;
      const chars = p.map((e) => e.c);
      nodes.push(
        {
          id: `${courseLessonKey(level, id, part)}:learn`,
          kind: 'learn',
          lesson: id,
          part,
          href: `${courseWritePath(level, id, part)}?${FROM_JOURNEY}`,
          chars,
        },
        {
          id: journeyKey(level, id, 'practice', part),
          kind: 'practice',
          lesson: id,
          part,
          href: journeyPracticePath(level, id, part),
          chars,
        },
      );
    });
    nodes.push({
      id: journeyKey(level, id, 'checkpoint'),
      kind: 'checkpoint',
      lesson: id,
      href: journeyCheckpointPath(level, id),
      chars: parts.flat().map((e) => e.c),
    });
    return [{ lesson, nodes }];
  });
}

const fromGrade = (best: Grade): NodeStatus => ({
  state: best === 3 ? 'mastered' : best >= PASS_GRADE ? 'done' : 'started',
  stars: best,
});

// Exercises of the Lessons tab that also count as a part's practice.
const PART_QUIZZES = ['meaning', 'pinyin', 'words'] as const;

export function nodeStatus(
  node: JourneyNode,
  p: Progress,
  level: string,
): NodeStatus {
  switch (node.kind) {
    case 'review':
      return UNTOUCHED;
    case 'story':
      return p.journey?.[node.id] ? { state: 'done', stars: 0 } : UNTOUCHED;
    case 'learn': {
      const write = writeResult(p, node.chars);
      if (write) return fromGrade(write.best);
      return node.chars.some((c) => p.chars[c])
        ? { state: 'started', stars: 0 }
        : UNTOUCHED;
    }
    case 'practice': {
      // The journey round, or else all of the part's quizzes in the Lessons tab.
      const own = p.journey?.[node.id]?.best ?? 0;
      const quizzes = lessonResults(
        p,
        courseLessonKey(level, node.lesson, node.part ?? 1),
        node.chars,
      );
      const grades = PART_QUIZZES.map((ex) => quizzes[ex]?.best ?? 0);
      const viaQuizzes = Math.min(...grades);
      const best = Math.max(own, viaQuizzes);
      if (best >= 1) return fromGrade(best as Grade);
      return grades.some((g) => g > 0)
        ? { state: 'started', stars: 0 }
        : UNTOUCHED;
    }
    case 'checkpoint': {
      const best = p.journey?.[node.id]?.best;
      return best ? fromGrade(best) : UNTOUCHED;
    }
  }
}

export const isDone = (s: NodeStatus) =>
  s.state === 'done' || s.state === 'mastered';

// Review appears on the path once this many characters or words are due.
export const REVIEW_MIN = 3;
export const REVIEW_MAX = 12;

export const reviewItems = (p: Progress, now: number) =>
  dueItems(p.srs ?? {}, now);

export const reviewKey = (level: string) => `${level}:review`;

const reviewNode = (level: string, due: number): JourneyNode => ({
  id: reviewKey(level),
  kind: 'review',
  lesson: 0,
  href: journeyReviewPath(level),
  chars: [],
  count: due,
});

export type PlacedNode = { node: JourneyNode; status: NodeStatus };
export type PlacedRegion = { lesson: CourseLesson; nodes: PlacedNode[] };

// The map with each step's state, the review step (when due) right after the last finished
// step, and the step to continue with: the review when there is one, otherwise the first
// step not done yet.
export function placeJourney(
  level: string,
  p: Progress,
  now: number,
  sessions: Sessions = NO_SESSIONS,
  regions: readonly Region[] = buildJourney(level),
): {
  regions: PlacedRegion[];
  next: PlacedNode | undefined;
  due: number;
  done: number; // steps done (the review step not counted)
  total: number;
} {
  const placed = regions.map((r) => ({
    lesson: r.lesson,
    nodes: r.nodes.map((node) =>
      withSession(node, nodeStatus(node, p, level), p, sessions, level),
    ),
  }));
  const steps = placed.flatMap((r) => r.nodes);
  const done = steps.filter((n) => isDone(n.status)).length;
  const due = reviewItems(p, now).length;
  if (due >= REVIEW_MIN) {
    const node = reviewNode(level, Math.min(due, REVIEW_MAX));
    let at: [number, number] = [0, 0];
    placed.forEach((r, ri) =>
      r.nodes.forEach((n, ni) => {
        if (isDone(n.status)) at = [ri, ni + 1];
      }),
    );
    placed[at[0]]?.nodes.splice(
      at[1],
      0,
      withSession(node, UNTOUCHED, p, sessions, level),
    );
  }
  const all = placed.flatMap((r) => r.nodes);
  const next =
    all.find((n) => n.node.kind === 'review') ??
    all.find((n) => !isDone(n.status));
  return { regions: placed, next, due, done, total: steps.length };
}

const NO_SESSIONS: Sessions = { quiz: {}, story: {} };

// Adds what an unfinished round got through, and points the dialogues at the step reached.
function withSession(
  node: JourneyNode,
  status: NodeStatus,
  p: Progress,
  sessions: Sessions,
  level: string,
): PlacedNode {
  const started = (partial: { done: number; total: number }): NodeStatus => ({
    ...status,
    state: status.state === 'untouched' ? 'started' : status.state,
    partial,
  });
  if (node.kind === 'story') {
    const s = sessions.story[node.id];
    if (!s) return { node, status };
    return {
      node: {
        ...node,
        href: `${courseRunPath(level, node.lesson, s.step)}?${FROM_JOURNEY}`,
      },
      status: started({ done: s.step - 1, total: s.total }),
    };
  }
  if (node.kind === 'learn') {
    if (status.state !== 'started') return { node, status };
    const written = node.chars.filter((c) => p.chars[c]).length;
    return {
      node,
      status: started({ done: written, total: node.chars.length }),
    };
  }
  const q = sessions.quiz[node.id];
  if (!q) return { node, status };
  return {
    node,
    status: started({ done: q.answers.length, total: q.questions.length }),
  };
}
