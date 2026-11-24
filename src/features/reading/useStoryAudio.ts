import { useEffect, useRef, useState } from 'react';
import { canSpeak, speakChinese, stopSpeaking } from '@/shared/lib/speech.ts';

// Speech rates for SpeechSynthesisUtterance.rate (1 is the voice's normal speed).
export const readingSpeeds = [0.5, 0.65, 0.8, 1, 1.25] as const;

// Reads a story aloud sentence by sentence with the browser's speech synthesis.
// There are no audio files: the voice and the speed come from the browser alone.
// Pause stops the sentence; Play starts it again from its beginning (speechSynthesis.pause
// is unreliable across browsers).
export function useStoryAudio(
  sentences: readonly string[],
  scrollTo: (index: number) => void,
) {
  const supported = canSpeak();
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [speed, setSpeed] = useState(1);
  // Speech callbacks outlive the render that created them: read settings through refs,
  // and ignore callbacks from an utterance that was replaced or stopped.
  const settings = useRef({ repeat, speed });
  useEffect(() => {
    settings.current = { repeat, speed };
  }, [repeat, speed]);
  const request = useRef(0);

  useEffect(
    () => () => {
      request.current++;
      stopSpeaking();
    },
    [],
  );

  function pause() {
    request.current++;
    stopSpeaking();
    setPlaying(false);
  }

  function play(target: number, rate = settings.current.speed) {
    const text = sentences[target];
    if (!supported || text === undefined) return;
    const token = ++request.current;
    setIndex(target);
    setError(false);
    setPlaying(true);
    scrollTo(target);
    speakChinese(text, {
      rate,
      onEnd: () => {
        if (request.current !== token) return;
        if (settings.current.repeat) play(target);
        else if (target + 1 < sentences.length) play(target + 1);
        else setPlaying(false);
      },
      // Our own stops bump `request` first, so this is speech started elsewhere.
      onStop: () => {
        if (request.current === token) setPlaying(false);
      },
      onError: () => {
        if (request.current !== token) return;
        pause();
        setError(true);
      },
    });
  }

  function goTo(target: number) {
    if (target < 0 || target >= sentences.length || target === index) return;
    if (playing) {
      play(target);
    } else {
      setIndex(target);
      setError(false);
      scrollTo(target);
    }
  }

  return {
    supported,
    playing,
    error,
    index,
    repeat,
    speed,
    pause,
    playSentence: (target: number) => play(target),
    toggle: () => (playing ? pause() : play(index)),
    goTo,
    toggleRepeat: () => setRepeat((value) => !value),
    // A rate cannot change mid-utterance, so the current sentence restarts at the new one.
    changeSpeed: (next: number) => {
      setSpeed(next);
      if (playing) play(index, next);
    },
  };
}
