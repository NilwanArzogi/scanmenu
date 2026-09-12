import { AlertCircle } from "lucide-react";
import Button from "./Button";

export default function ErrorState({ message = "Terjadi kesalahan.", onRetry }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-10 text-text-secondary">
      <AlertCircle size={32} className="text-danger" />
      <span className="text-sm">{message}</span>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Coba lagi
        </Button>
      )}
    </div>
  );
}