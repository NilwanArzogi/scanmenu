import { Loader2 } from "lucide-react";

export default function Loading({ label = "Memuat..." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-text-secondary">
      <Loader2 className="animate-spin" size={24} />
      <span className="text-sm">{label}</span>
    </div>
  );
}