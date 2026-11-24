// @vitest-environment jsdom
import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useStoryAudio } from '@/features/reading/useStoryAudio.ts';

type Utterance = {
  text: string;
  rate: number;
  onend?: () => void;
  onerror?: (event: { error: string }) => void;
};

// A fake speechSynthesis: speak() queues, cancel() interrupts the utterance in progress.
function installSpeech() {
  const spoken: Utterance[] = [];
  let active: Utterance | undefined;
  const synth = {
    get speaking() {
      return active !== undefined;
    },
    pending: false,
    getVoices: () => [],
    speak(u: Utterance) {
      spoken.push(u);
      active = u;
    },
    cancel() {
      const u = active;
      active = undefined;
      u?.onerror?.({ error: 'interrupted' });
    },
  };
  vi.stubGlobal(
    'SpeechSynthesisUtterance',
    class {
      rate = 1;
      constructor(public text: string) {}
    },
  );
  vi.stubGlobal('speechSynthesis', synth);
  const last = () => spoken.at(-1)!;
  return {
    spoken,
    synth,
    texts: () => spoken.map((u) => u.text),
    finish: () => {
      const u = last();
      active = undefined;
      act(() => u.onend?.());
    },
    fail: (error: string) => {
      const u = last();
      active = undefined;
      act(() => u.onerror?.({ error }));
    },
  };
}

const sentences = ['一。', '二。', '三。'];
let speech: ReturnType<typeof installSpeech>;
const scrollTo = vi.fn<(index: number) => void>();
const render = () => renderHook(() => useStoryAudio(sentences, scrollTo));

beforeEach(() => {
  speech = installSpeech();
  scrollTo.mockClear();
});

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

it('reads the sentences in order and stops after the last', () => {
  const { result } = render();
  act(() => result.current.toggle());
  expect(result.current.playing).toBe(true);
  speech.finish();
  speech.finish();
  expect(result.current.index).toBe(2);
  speech.finish();
  expect(speech.texts()).toEqual(sentences);
  expect(result.current.playing).toBe(false);
  expect(scrollTo.mock.calls.map(([index]: [number]) => index)).toEqual([
    0, 1, 2,
  ]);
});

it('repeats the current sentence while repeat is on', () => {
  const { result } = render();
  act(() => result.current.toggleRepeat());
  act(() => result.current.playSentence(1));
  speech.finish();
  speech.finish();
  expect(speech.texts()).toEqual(['二。', '二。', '二。']);
  expect(result.current.index).toBe(1);
});

it('pauses without moving on, and Play starts the sentence again', () => {
  const { result } = render();
  act(() => result.current.toggle());
  act(() => result.current.toggle());
  expect(result.current.playing).toBe(false);
  expect(speech.synth.speaking).toBe(false);
  act(() => result.current.toggle());
  expect(speech.texts()).toEqual(['一。', '一。']);
});

it('restarts the sentence at the new rate when the speed changes', () => {
  const { result } = render();
  act(() => result.current.toggle());
  act(() => result.current.changeSpeed(0.65));
  expect(speech.spoken.map((u) => [u.text, u.rate])).toEqual([
    ['一。', 1],
    ['一。', 0.65],
  ]);
  speech.finish();
  expect(speech.spoken.at(-1)!.rate).toBe(0.65);
});

it('moves without speaking while paused', () => {
  const { result } = render();
  act(() => result.current.goTo(2));
  expect(result.current.index).toBe(2);
  expect(speech.spoken).toEqual([]);
});

it('stops when other speech interrupts the story', () => {
  const { result } = render();
  act(() => result.current.toggle());
  speech.fail('interrupted');
  expect(result.current.playing).toBe(false);
  expect(result.current.error).toBe(false);
});

it('reports a synthesis error', () => {
  const { result } = render();
  act(() => result.current.toggle());
  speech.fail('synthesis-failed');
  expect(result.current.playing).toBe(false);
  expect(result.current.error).toBe(true);
});

it('stops speaking when the reader closes', () => {
  const { result, unmount } = render();
  act(() => result.current.toggle());
  unmount();
  expect(speech.synth.speaking).toBe(false);
});

it('does nothing without speech synthesis', () => {
  vi.unstubAllGlobals();
  const { result } = render();
  expect(result.current.supported).toBe(false);
  act(() => result.current.toggle());
  expect(result.current.playing).toBe(false);
});
