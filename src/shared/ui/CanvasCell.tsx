import { useEffect, useRef } from 'react';
import type { ComponentProps } from 'react';
import { prepCanvas } from '@/shared/lib/draw.ts';

type CanvasCellProps = Omit<ComponentProps<'canvas'>, 'size' | 'height'> & {
  size: number;
  height?: number;
  draw: (ctx: CanvasRenderingContext2D, size: number) => void;
};

// Small canvas that renders crisply on high-DPI screens.
// draw(ctx, size) runs after every render; the drawings are cheap.
export default function CanvasCell({
  size,
  height = size,
  draw,
  className,
  style,
  ...rest
}: CanvasCellProps) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const ctx = prepCanvas(ref.current, size, height);
    draw(ctx, size);
  });
  return (
    <canvas
      ref={ref}
      className={className}
      style={{ width: size, height, ...style }}
      {...rest}
    />
  );
}
