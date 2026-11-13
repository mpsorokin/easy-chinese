// Worksheet settings chosen in the print dialog; persisted in hskStore.ts.
import type { GridKind } from '../../domain/types.ts';

export type PrintOptions = { rows: number; grid: GridKind };

export const PRINT_ROWS = [1, 2, 3, 4, 5, 6] as const;
export const DEFAULT_PRINT_OPTIONS: PrintOptions = { rows: 3, grid: 'mi' };

export function normalizePrintOptions(raw: unknown): PrintOptions {
  const o = (raw && typeof raw === 'object' ? raw : {}) as Record<
    string,
    unknown
  >;
  const rows =
    typeof o.rows === 'number' &&
    (PRINT_ROWS as readonly number[]).includes(o.rows)
      ? o.rows
      : DEFAULT_PRINT_OPTIONS.rows;
  const grid =
    o.grid === 'mi' || o.grid === 'tian' ? o.grid : DEFAULT_PRINT_OPTIONS.grid;
  return { rows, grid };
}

// Worksheet PDF file name (first 8 characters), without the extension.
export const worksheetFileName = (chars: string[], level = '1') =>
  `hsk${level}-worksheet-${chars.slice(0, 8).join('')}`;
