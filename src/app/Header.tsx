import { stars as starString, t } from '../shared/i18n/en.ts';
import type { CharEntry } from '../domain/types.ts';
import type { Grade } from '../domain/grading.ts';
import { canSpeak, speakChinese } from '../shared/lib/speech.ts';
import WriteIcon from '../shared/ui/WriteIcon.tsx';

export default function Header({
  item,
  stars,
  onPrev,
  onNext,
}: {
  item: CharEntry;
  stars: Grade | undefined;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="write-header">
      <button
        className="write-nav write-prev"
        onClick={onPrev}
        aria-label={t.prev}
      >
        <WriteIcon name="chevron" />
      </button>
      <div className="write-character">
        <span className="write-glyph" lang="zh-Hans">
          {item.c}
        </span>
        <div className="write-meta">
          <div className="write-reading">
            <span lang="zh-Latn-pinyin">{item.py}</span>
            {canSpeak() && (
              <button
                className="write-audio"
                type="button"
                aria-label={t.listenCharacter(item.c)}
                onClick={() => speakChinese(item.c)}
              >
                <WriteIcon name="volume" />
              </button>
            )}
          </div>
          <div className="write-meaning">{item.en}</div>
        </div>
        <div className="write-choice">
          {stars && <span className="write-stars">{starString(stars)}</span>}
        </div>
      </div>
      <button className="write-nav" onClick={onNext} aria-label={t.next}>
        <WriteIcon name="chevron" />
      </button>
    </div>
  );
}
