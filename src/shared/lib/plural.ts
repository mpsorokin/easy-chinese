// English plural form: plural(n, 'stroke') → 'stroke' | 'strokes'.
export function plural(n: number, one: string, many = `${one}s`) {
  return n === 1 ? one : many;
}
