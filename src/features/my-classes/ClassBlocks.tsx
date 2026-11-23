import type { ReactNode } from 'react';
import { t } from '@/shared/i18n/en.ts';
import { canSpeak, speakChinese } from '@/shared/lib/speech.ts';
import WriteIcon from '@/shared/ui/WriteIcon.tsx';
import type {
  ClassBlock,
  ClassTable,
} from '@/features/my-classes/classLessons.ts';
import ClassText from '@/features/my-classes/ClassText.tsx';

const speechAvailable = canSpeak();
// A cell that is a whole Chinese phrase in bold can be listened to.
const PHRASE = /^\*\*([\p{Script=Han}，。！？、；：“”‘’…\s]+)\*\*$/u;

function TableCell({
  table,
  cell,
  column,
}: {
  table: ClassTable;
  cell: string;
  column: number;
}) {
  const kind = table.columns[column];
  if (kind === 'hanzi') {
    const phrase = speechAvailable ? PHRASE.exec(cell)?.[1] : undefined;
    return (
      <div className="class-phrase">
        <span>
          <ClassText text={cell} />
        </span>
        {phrase && (
          <button
            type="button"
            className="class-audio"
            lang="en"
            onClick={() => speakChinese(phrase)}
            aria-label={t.listenCharacter(phrase)}
          >
            <WriteIcon name="volume" />
          </button>
        )}
      </div>
    );
  }

  // "**你呢？** · Nǐ ne? · А ты?": characters, pinyin and translation on their own lines.
  const example = kind === 'example' ? cell.split(' · ') : [];
  if (example.length === 3)
    return (
      <div className="class-example">
        <span>
          <ClassText text={example[0] ?? ''} />
        </span>
        <span lang="zh-Latn-pinyin">{example[1]}</span>
        <span>{example[2]}</span>
      </div>
    );
  return <ClassText text={cell} />;
}

function Table({ table }: { table: ClassTable }) {
  return (
    <div
      className={
        table.phrases ? 'class-table class-table-phrases' : 'class-table'
      }
    >
      {/* Explicit roles keep the table semantics when narrow screens lay rows out as grids. */}
      <table role="table" aria-label={table.label ?? t.classAnswers}>
        <thead role="rowgroup">
          <tr role="row">
            {table.headers.map((cell, index) => (
              <th key={index} scope="col" role="columnheader">
                <ClassText text={cell} />
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {table.rows.map((row, index) => (
            <tr key={index} role="row">
              {row.map((cell, column) => (
                <td
                  key={column}
                  role="cell"
                  data-column={table.columns[column]}
                  lang={
                    table.columns[column] === 'pinyin'
                      ? 'zh-Latn-pinyin'
                      : undefined
                  }
                >
                  <TableCell table={table} cell={cell} column={column} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Answers({ children }: { children: ReactNode }) {
  return (
    <details className="class-answers" lang="en">
      <summary>
        <span className="class-answers-show">{t.classShowAnswers}</span>
        <span className="class-answers-hide">{t.classHideAnswers}</span>
      </summary>
      <div lang="ru">{children}</div>
    </details>
  );
}

function Block({ block }: { block: ClassBlock }) {
  switch (block.type) {
    case 'heading':
      return (
        <h3>
          <ClassText text={block.text} />
        </h3>
      );
    case 'paragraph':
      return (
        <p>
          <ClassText text={block.text} />
        </p>
      );
    case 'rule':
      return (
        <>
          <p className="class-rule">
            <ClassText text={block.rule} />
          </p>
          {block.text && (
            <p>
              <ClassText text={block.text} />
            </p>
          )}
        </>
      );
    case 'bullets':
      return (
        <ul>
          {block.items.map((item, index) => (
            <li key={index}>
              <ClassText text={item} />
            </li>
          ))}
        </ul>
      );
    case 'numbered':
      return (
        <>
          <ol>
            {block.items.map((item, index) => (
              <li key={index}>
                <ClassText text={item} />
              </li>
            ))}
          </ol>
          {block.answers && (
            <Answers>
              <Table table={block.answers} />
            </Answers>
          )}
        </>
      );
    case 'table':
      return <Table table={block.table} />;
    case 'answers':
      return (
        <Answers>
          <ClassBlocks blocks={block.blocks} />
        </Answers>
      );
  }
}

export default function ClassBlocks({
  blocks,
}: {
  blocks: readonly ClassBlock[];
}) {
  return blocks.map((block, index) => <Block key={index} block={block} />);
}
