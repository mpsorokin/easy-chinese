// The lesson pictures by file name: art('food') is the URL of ./level/food.webp. Names are
// unique across the folders (art.test.ts checks it). Each picture stays its own hashed file,
// precached for offline use.
const files = import.meta.glob<string>('./**/*.webp', {
  eager: true,
  query: '?url',
  import: 'default',
});

const byName = new Map(
  Object.entries(files).map(([path, url]) => [
    path.slice(path.lastIndexOf('/') + 1, -'.webp'.length),
    url,
  ]),
);

// Every file path, for the uniqueness test.
export const artPaths = Object.keys(files);

// Throws for an unknown name, so a typo fails when the module loads (and in tests).
export function art(name: string): string {
  const url = byName.get(name);
  if (!url) throw new Error(`No lesson art "${name}"`);
  return url;
}
