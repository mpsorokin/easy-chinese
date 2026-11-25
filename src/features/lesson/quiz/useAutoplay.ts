import { useEffect } from 'react';
import { canSpeak, speakChinese } from '@/shared/lib/speech.ts';

// Plays a word once when a listening question opens.
export function useAutoplay(text: string | undefined) {
  useEffect(() => {
    if (text && canSpeak()) speakChinese(text);
  }, [text]);
}
