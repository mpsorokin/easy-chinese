import '@/shared/ui/Meter.css';

// Thin progress bar (decorative: the numbers are always shown as text next to it).
export default function Meter({ value, max }: { value: number; max: number }) {
  return (
    <span className="meter" aria-hidden>
      <span style={{ width: `${max ? (100 * value) / max : 0}%` }} />
    </span>
  );
}
