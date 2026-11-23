// Notes from classes with a teacher: /private-lesson-content/lessonNN.md, parsed once when the
// module loads into blocks the pages only render. The notes are written in Russian, so their
// headings and column names are matched here and nowhere else.

const sources = import.meta.glob<string>('/private-lesson-content/lesson*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

export type SectionKind =
  | 'vocabulary'
  | 'grammar'
  | 'dialogues'
  | 'writing'
  | 'other';

const SECTION_KINDS = new Map<string, SectionKind>([
  ['Основная лексика', 'vocabulary'],
  ['Грамматика', 'grammar'],
  ['Диалоги', 'dialogues'],
  ['Иероглифы и письмо', 'writing'],
]);

export type ColumnKind =
  | 'hanzi'
  | 'pinyin'
  | 'example'
  | 'speaker'
  | 'number'
  | 'text';

const COLUMN_KINDS = new Map<string, ColumnKind>([
  ['汉字', 'hanzi'],
  ['Pinyin', 'pinyin'],
  ['Пример', 'example'],
  ['Кто говорит', 'speaker'],
  ['№', 'number'],
]);

// "### Ответы" starts the answer key of a section. Its table names the exercise list of each
// answer by a short label; when every answer fits its list, they are shown after the lists.
const ANSWERS_HEADING = /^### Ответы[ \t]*$/m;
const ANSWER_KEY_HEADERS = 'Задание|№|汉字|Pinyin';
const ANSWER_LISTS = new Map([
  ['С русского', 'Переведи на китайский'],
  ['Порядок слов', 'Собери фразы'],
  ['С английского', 'Переведи с английского на китайский'],
]);

export type ClassTable = {
  // Accessible name; answer tables have none and are labelled by the page.
  label?: string;
  headers: string[];
  columns: ColumnKind[];
  rows: string[][];
  // A table of phrases (characters and pinyin), laid out as cards on narrow screens.
  phrases: boolean;
};

export type ClassBlock =
  | { type: 'heading'; text: string }
  | { type: 'paragraph'; text: string }
  | { type: 'rule'; rule: string; text: string }
  | { type: 'bullets'; items: string[] }
  | { type: 'numbered'; items: string[]; answers?: ClassTable }
  | { type: 'table'; table: ClassTable }
  | { type: 'answers'; blocks: ClassBlock[] };

export type ClassSection = {
  kind: SectionKind;
  title: string;
  anchor: string;
  blocks: ClassBlock[];
};

export type ClassLesson = {
  id: number;
  hanzi: string;
  pinyin: string;
  label: string;
  chineseTitle?: string;
  title: string;
  intro: ClassBlock[];
  sections: ClassSection[];
};

const tableCells = (line: string) =>
  line
    .trim()
    .slice(1, -1)
    .split('|')
    .map((cell) => cell.trim());

function makeTable(
  headers: string[],
  rows: string[][],
  label?: string,
): ClassTable {
  const columns = headers.map((h) => COLUMN_KINDS.get(h) ?? 'text');
  return {
    label,
    headers,
    columns,
    rows,
    phrases: columns.includes('hanzi') && columns.includes('pinyin'),
  };
}

const isTableRow = (line: string) => line.startsWith('|') && line.endsWith('|');
const NUMBERED = /^\d+\. /;

function groupAnswers(content: string, answers: string) {
  const [header = '', , ...rows] = answers.trim().split('\n');
  const headers = tableCells(header);
  if (headers.join('|') !== ANSWER_KEY_HEADERS) return;

  const groups = new Map<string, string[][]>();
  for (const row of rows) {
    const [group = '', ...cells] = tableCells(row);
    const list = ANSWER_LISTS.get(group);
    if (!list || cells.length !== 3) return;
    groups.set(list, [...(groups.get(list) ?? []), cells]);
  }

  // Keep the original key when an answer cannot be placed after its exercise list.
  const lists = content.trim().split(/^### /m).slice(1);
  for (const [heading, answerRows] of groups) {
    const list = lists.find((part) => part.startsWith(`${heading}\n`));
    if (!list || answerRows.length !== (list.match(/^\d+\. /gm)?.length ?? 0))
      return;
  }
  if (!groups.size) return;
  return new Map(
    [...groups].map(([heading, answerRows]) => [
      heading,
      makeTable(headers.slice(1), answerRows),
    ]),
  );
}

function parseBlocks(
  body: string,
  label: string | undefined,
  grammar = false,
  answers?: Map<string, ClassTable>,
): ClassBlock[] {
  let heading = label;
  return body
    .trim()
    .split(/\n\s*\n/)
    .flatMap((block): ClassBlock[] => {
      if (!block) return [];
      if (block.startsWith('### ')) {
        heading = block.slice(4);
        return [{ type: 'heading', text: heading }];
      }

      const lines = block.split('\n');
      if (lines.every(isTableRow)) {
        const [header = '', , ...rows] = lines;
        return [
          {
            type: 'table',
            table: makeTable(tableCells(header), rows.map(tableCells), heading),
          },
        ];
      }
      if (lines.every((line) => NUMBERED.test(line)))
        return [
          {
            type: 'numbered',
            items: lines.map((line) => line.replace(NUMBERED, '')),
            answers: heading ? answers?.get(heading) : undefined,
          },
        ];
      if (lines.every((line) => line.startsWith('- ')))
        return [{ type: 'bullets', items: lines.map((line) => line.slice(2)) }];

      // A grammar pattern such as "**Кто + 很 + прилагательное.**" followed by its explanation.
      const rule = grammar && /^\*\*([^*]+\+[^*]+)\*\*\s*(.*)$/s.exec(block);
      if (rule)
        return [{ type: 'rule', rule: rule[1] ?? '', text: rule[2] ?? '' }];
      return [{ type: 'paragraph', text: block }];
    });
}

export function parseClassContent(
  body: string,
  label?: string,
  grammar = false,
): ClassBlock[] {
  const [content = '', answers] = body.split(ANSWERS_HEADING);
  const groups = answers ? groupAnswers(content, answers) : undefined;
  const blocks = parseBlocks(content, label, grammar, groups);
  if (answers && !groups)
    blocks.push({ type: 'answers', blocks: parseBlocks(answers, undefined) });
  return blocks;
}

function readSection(text: string) {
  const [title = '', ...lines] = text.trim().split('\n');
  return { title, body: lines.join('\n').trim() };
}

// One notes file: "# 第一课 · Dì yī kè · Урок 1", then "## <topic>" with the introduction,
// then numbered "## N. <section>" parts.
export function parseClassLesson(
  id: number,
  source: string,
): ClassLesson | undefined {
  const [heading = '', introduction = '', ...sections] = source
    .trim()
    .replaceAll('\r\n', '\n')
    .split(/^## /m);
  const [hanzi = '', pinyin = '', label = ''] = heading
    .trim()
    .replace(/^# /, '')
    .split(' · ');
  const intro = readSection(introduction);
  if (!label || !intro.title) return;
  const topic = /^(\S+?[。！？])\s+(.+)$/u.exec(intro.title);
  const title = topic?.[2] ?? intro.title;

  return {
    id,
    hanzi,
    pinyin,
    label,
    chineseTitle: topic?.[1],
    title,
    intro: parseClassContent(intro.body, title),
    sections: sections.map((section, index) => {
      const { title, body } = readSection(section);
      const name = title.replace(/^\d+\. /, '');
      const kind = SECTION_KINDS.get(name) ?? 'other';
      return {
        kind,
        title: name,
        anchor: `class-section-${index + 1}`,
        blocks: parseClassContent(body, name, kind === 'grammar'),
      };
    }),
  };
}

export const classLessons: readonly ClassLesson[] = Object.entries(sources)
  .flatMap(([path, source]) => {
    const number = /\/lesson(\d+)\.md$/.exec(path)?.[1];
    const lesson = number && parseClassLesson(Number(number), source);
    return lesson ? [lesson] : [];
  })
  .sort((a, b) => a.id - b.id);

export const classLesson = (id: string | undefined) =>
  classLessons.find((lesson) => String(lesson.id) === id);
