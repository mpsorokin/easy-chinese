export const classesPath = '/my-classes';
export const classPath = (lesson: number) => `${classesPath}/${lesson}`;

export const translationDirections = ['zh-en', 'en-zh'] as const;
export type TranslationDirection = (typeof translationDirections)[number];

export function isTranslationDirection(
  value: unknown,
): value is TranslationDirection {
  return value === 'zh-en' || value === 'en-zh';
}

export const classTranslationPath = (
  lesson: number,
  direction: TranslationDirection,
) => `${classPath(lesson)}/practice/${direction}`;
