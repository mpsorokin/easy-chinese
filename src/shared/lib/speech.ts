// Chinese pronunciation through the browser's built-in speech synthesis (no network calls).

export const canSpeak = (): boolean =>
  typeof window !== 'undefined' && 'speechSynthesis' in window;

// A Mandarin voice if the system has one; otherwise the browser picks by `lang`.
function chineseVoice(): SpeechSynthesisVoice | undefined {
  const voices = window.speechSynthesis.getVoices();
  return (
    voices.find((v) => v.lang === 'zh-CN') ??
    voices.find((v) => v.lang.startsWith('zh'))
  );
}

// Speaks `text` in Mandarin, interrupting anything still being spoken.
export function speakChinese(text: string): void {
  if (!canSpeak()) return;
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = 0.8;
  const voice = chineseVoice();
  if (voice) u.voice = voice;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(u);
}
