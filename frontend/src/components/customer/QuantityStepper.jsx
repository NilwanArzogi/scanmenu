import { Minus, Plus } from "lucide-react";

export default function QuantityStepper({ value, onChange, min = 1, max = 99 }) {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-primary disabled:opacity-40"
        aria-label="Kurangi"
      >
        <Minus size={16} />
      </button>
      <span className="w-6 text-center text-sm font-medium">{value}</span>
      <button
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-text-primary disabled:opacity-40"
        aria-label="Tambah"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}