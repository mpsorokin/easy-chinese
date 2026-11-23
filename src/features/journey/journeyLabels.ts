// Names and glyphs of journey steps, shared by the map and the home page card.
import { t } from '@/shared/i18n/en.ts';
import type { NodeKind, PlacedNode } from '@/features/journey/journey.ts';

// Ink glyph on each kind of step.
export const GLYPH: Record<NodeKind, string> = {
  story: '读',
  learn: '写',
  practice: '练',
  checkpoint: '印',
  review: '复',
};

// "Practice · Part 2", "Checkpoint".
export const stepTitle = ({ node }: PlacedNode) =>
  t.journey.nodeTitle(t.journey.kinds[node.kind], node.part);

// Label of the button that opens a step: resume, review or continue.
export const continueLabel = ({ node, status }: PlacedNode) =>
  status.partial
    ? t.journey.resume
    : node.kind === 'review'
      ? t.journey.review
      : t.journey.continue;
