// Stroke-data file name for a character: its code point in hex.
// Shared by the app (data/charData.ts) and the generator (scripts/build-data.ts).
export const charFile = (c: string) => {
  const cp = c.codePointAt(0);
  if (cp === undefined) throw new Error('charFile: empty string');
  return `${cp.toString(16)}.json`;
};
