import type { HskWord } from '@/domain/types.ts';
import { t } from '@/shared/i18n/en.ts';

const MAX_WORDS = 3;

// Under the copybook header: the lesson words this character is part of, so it is clear
// when one word takes several characters (学习 = 学 + 习). Nothing for single characters.
export default function WordContext({
  char,
  words,
}: {
  char: string;
  words: readonly HskWord[] | undefined;
}) {
  const shown = (words ?? [])
    .filter((w) => [...w.w].length > 1 && w.w.includes(char))
    .slice(0, MAX_WORDS);
  if (shown.length === 0) return null;
  return (
    <div className="write-words" aria-label={t.partOfWord}>
      <span className="write-words-label">{t.partOfWord}</span>
      {shown.map((w) => {
        const chars = [...w.w];
        const at = chars.indexOf(char);
        return (
          <span key={w.w} className="write-word">
            <span className="write-word-chars" lang="zh-Hans">
              {chars.map((c, i) => (
                <b key={i} className={i === at ? 'is-current' : undefined}>
                  {c}
                </b>
              ))}
            </span>
            <span className="write-word-meta">
              <span lang="zh-Latn-pinyin">{w.py}</span> — {w.en}
              <small>{t.charOfWord(at + 1, chars.length)}</small>
            </span>
          </span>
        );
      })}
    </div>
  );
}
