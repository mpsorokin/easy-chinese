// Chinese pronunciation through the browser's built-in speech synthesis (no audio files):
// the voice and the speaking rate come from the browser and the system.

export const canSpeak = (): boolean =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

// A Mandarin voice if the system has one, preferring voices installed on the device: they
// work offline and start sooner than network voices (Chrome's "Google" voices also stop
// long utterances after about 15 seconds). Otherwise the browser picks by `lang`.
function chineseVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang.replace('_', '-').startsWith('zh'));
  const mainland = voices.filter((v) => /^zh-(CN|Hans)/i.test(v.lang));
  return (
    mainland.find((v) => v.localService) ??
    mainland[0] ??
    voices.find((v) => v.localService) ??
    voices[0]
  );
}

export type SpeakOptions = {
  rate?: number; // SpeechSynthesisUtterance.rate: 1 is the voice's normal speed
  onEnd?: () => void;
  // Called when the speech was cancelled or interrupted by other speech.
  onStop?: () => void;
  onError?: () => void;
};

// Chrome can garbage-collect an utterance that nothing references while it is still
// speaking, and then never fires its events. Keep the current one alive.
let current: SpeechSynthesisUtterance | undefined;

// Speaks `text` in Mandarin, interrupting anything still being spoken.
export function speakChinese(
  text: string,
  { rate = 0.8, onEnd, onStop, onError }: SpeakOptions = {},
): void {
  if (!canSpeak()) return;
  const synth = window.speechSynthesis;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = rate;
  const voice = chineseVoice();
  if (voice) u.voice = voice;
  u.onend = () => {
    if (current === u) current = undefined;
    onEnd?.();
  };
  u.onerror = (event) => {
    if (current === u) current = undefined;
    if (event.error === 'canceled' || event.error === 'interrupted') onStop?.();
    else onError?.();
  };
  // Some Chrome builds drop an utterance queued right after cancel(), so cancel only when
  // something is actually queued or speaking.
  if (synth.speaking || synth.pending) synth.cancel();
  current = u;
  synth.speak(u);
}

export function stopSpeaking(): void {
  if (!canSpeak()) return;
  current = undefined;
  window.speechSynthesis.cancel();
}
