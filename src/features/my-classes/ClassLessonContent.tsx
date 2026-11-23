import { Fragment } from 'react';
import { Link } from 'react-router';
import { t } from '../../shared/i18n/en.ts';
import { canSpeak, speakChinese } from '../../shared/lib/speech.ts';
import WriteIcon from '../../shared/ui/WriteIcon.tsx';
import { courseLessonPath } from '../lesson/lessonNav.ts';

function chineseText(text: string) {
  return text.split(/([\p{Script=Han}，。！？、；：]+)/u).map((part, index) =>
    index % 2 ? (
      <span key={index} lang="zh-Hans">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export function classText(text: string) {
  return text
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g)
    .map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**') && part.length > 4)
        return <strong key={index}>{chineseText(part.slice(2, -2))}</strong>;
      if (part.startsWith('*') && part.endsWith('*') && part.length > 2)
        return <em key={index}>{chineseText(part.slice(1, -1))}</em>;

      const link =
        /^\[([^\]]+)\]\(\.\.\/src\/data\/lessons\/lesson(\d+)\.ts\)$/.exec(
          part,
        );
      if (link)
        return (
          <Link
            key={index}
            to={courseLessonPath('1', Number(link[2]))}
            lang="en"
          >
            {link[1]}
          </Link>
        );

      return <Fragment key={index}>{chineseText(part)}</Fragment>;
    });
}

const tableCells = (line: string) =>
  line
    .trim()
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());

function LessonTable({ lines, label }: { lines: string[]; label: string }) {
  const [header = '', , ...rows] = lines;
  const headers = tableCells(header);
  const speechAvailable = canSpeak();
  const phraseTable = headers.includes('汉字') && headers.includes('Pinyin');

  return (
    <div
      className={
        phraseTable ? 'class-table class-table-phrases' : 'class-table'
      }
    >
      <table role="table" aria-label={label}>
        <thead role="rowgroup">
          <tr role="row">
            {headers.map((cell, index) => (
              <th key={index} scope="col" role="columnheader">
                {classText(cell)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody role="rowgroup">
          {rows.map((row, index) => (
            <tr key={index} role="row">
              {tableCells(row).map((cell, column) => {
                const heading = headers[column];
                const hanzi = heading === '汉字';
                const pinyin = heading === 'Pinyin';
                const phrase =
                  hanzi && speechAvailable
                    ? /^\*\*([\p{Script=Han}，。！？、；：“”‘’…\s]+)\*\*$/u.exec(
                        cell,
                      )?.[1]
                    : undefined;
                const example = heading === 'Пример' ? cell.split(' · ') : [];
                return (
                  <td
                    key={column}
                    role="cell"
                    data-column={heading}
                    lang={pinyin ? 'zh-Latn-pinyin' : undefined}
                  >
                    {hanzi ? (
                      <div className="class-phrase">
                        <span>{classText(cell)}</span>
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
                    ) : example.length === 3 ? (
                      <div className="class-example">
                        <span>{classText(example[0] ?? '')}</span>
                        <span lang="zh-Latn-pinyin">{example[1]}</span>
                        <span>{example[2]}</span>
                      </div>
                    ) : (
                      classText(cell)
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function LessonAnswers({ lines, body }: { lines?: string[]; body?: string }) {
  return (
    <details className="class-answers">
      <summary>
        <span className="class-answers-show">Показать ответы</span>
        <span className="class-answers-hide">Скрыть ответы</span>
      </summary>
      {lines ? (
        <LessonTable lines={lines} label="Ответы" />
      ) : (
        <LessonBlocks body={body ?? ''} title="Ответы" />
      )}
    </details>
  );
}

const exerciseHeadings = new Map([
  ['С русского', 'Переведи на китайский'],
  ['Порядок слов', 'Собери фразы'],
  ['С английского', 'Переведи с английского на китайский'],
]);

function groupAnswers(content: string, answers: string) {
  const [header = '', divider = '', ...rows] = answers.trim().split('\n');
  if (tableCells(header).join('|') !== 'Задание|№|汉字|Pinyin') return;

  const groups = new Map<string, string[]>();
  const lists = content.trim().split(/^### /m).slice(1);
  for (const row of rows) {
    const [group, ...cells] = tableCells(row);
    const heading = exerciseHeadings.get(group ?? '');
    if (!heading || cells.length !== 3) return;
    const lines = groups.get(heading) ?? [
      '| № | 汉字 | Pinyin |',
      `| ${tableCells(divider).slice(1).join(' | ')} |`,
    ];
    lines.push(`| ${cells.join(' | ')} |`);
    groups.set(heading, lines);
  }
  // Keep the original key when an answer cannot be placed after its exercise list.
  for (const [heading, lines] of groups) {
    const list = lists.find((part) => part.startsWith(`${heading}\n`));
    if (!list || lines.length - 2 !== (list.match(/^\d+\. /gm)?.length ?? 0))
      return;
  }
  return groups.size ? groups : undefined;
}

function LessonBlocks({
  body,
  title,
  grammar,
  answers,
}: {
  body: string;
  title: string;
  grammar?: boolean;
  answers?: Map<string, string[]>;
}) {
  let heading = title;
  return body
    .trim()
    .split(/\n\s*\n/)
    .map((block, index) => {
      if (!block) return null;
      if (block.startsWith('### ')) {
        heading = block.slice(4);
        return <h3 key={index}>{classText(heading)}</h3>;
      }

      const lines = block.split('\n');
      if (lines.every((line) => line.startsWith('|') && line.endsWith('|')))
        return <LessonTable key={index} lines={lines} label={heading} />;

      if (lines.every((line) => /^\d+\. /.test(line))) {
        const key = answers?.get(heading);
        return (
          <Fragment key={index}>
            <ol>
              {lines.map((line, item) => (
                <li key={item}>{classText(line.replace(/^\d+\. /, ''))}</li>
              ))}
            </ol>
            {key && <LessonAnswers lines={key} />}
          </Fragment>
        );
      }

      if (lines.every((line) => line.startsWith('- ')))
        return (
          <ul key={index}>
            {lines.map((line, item) => (
              <li key={item}>{classText(line.slice(2))}</li>
            ))}
          </ul>
        );

      const rule = grammar && /^\*\*([^*]+\+[^*]+)\*\*\s*(.*)$/s.exec(block);
      if (rule)
        return (
          <Fragment key={index}>
            <p className="class-rule">{classText(rule[1] ?? '')}</p>
            {rule[2] && <p>{classText(rule[2])}</p>}
          </Fragment>
        );
      return <p key={index}>{classText(block)}</p>;
    });
}

export default function ClassLessonContent({
  body,
  title,
  grammar,
}: {
  body: string;
  title: string;
  grammar?: boolean;
}) {
  const [content = '', answers] = body.split(/^### Ответы[ \t]*$/m);
  const groups = answers ? groupAnswers(content, answers) : undefined;
  return (
    <>
      <LessonBlocks
        body={content}
        title={title}
        grammar={grammar}
        answers={groups}
      />
      {answers && !groups && <LessonAnswers body={answers} />}
    </>
  );
}
