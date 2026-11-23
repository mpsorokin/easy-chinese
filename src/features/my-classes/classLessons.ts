const sources = import.meta.glob<string>('/private-lesson-content/lesson*.md', {
  eager: true,
  import: 'default',
  query: '?raw',
});

function readSection(text: string) {
  const [title = '', ...lines] = text.trim().split('\n');
  return { title, body: lines.join('\n').trim() };
}

export const classLessons = Object.entries(sources)
  .flatMap(([path, source]) => {
    const number = /\/lesson(\d+)\.md$/.exec(path)?.[1];
    if (!number) return [];

    const [heading = '', introduction = '', ...sections] = source
      .trim()
      .replaceAll('\r\n', '\n')
      .split(/^## /m);
    const [hanzi = '', pinyin = '', label = ''] = heading
      .trim()
      .replace(/^# /, '')
      .split(' · ');
    const intro = readSection(introduction);
    if (!label || !intro.title) return [];
    const topic = /^(\S+?[。！？])\s+(.+)$/u.exec(intro.title);

    return [
      {
        id: Number(number),
        hanzi,
        pinyin,
        label,
        chineseTitle: topic?.[1],
        title: topic?.[2] ?? intro.title,
        intro,
        sections: sections.map((section, index) => {
          const { title, body } = readSection(section);
          return {
            title: title.replace(/^\d+\. /, ''),
            body,
            anchor: `class-section-${index + 1}`,
          };
        }),
      },
    ];
  })
  .sort((a, b) => a.id - b.id);

export type ClassLesson = (typeof classLessons)[number];
