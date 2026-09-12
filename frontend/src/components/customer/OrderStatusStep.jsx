import { Check, Circle, X } from "lucide-react";

const steps = [
  { key: "pending", label: "Pesanan dibuat" },
  { key: "confirmed", label: "Dikonfirmasi" },
  { key: "processing", label: "Sedang diproses" },
  { key: "ready", label: "Siap" },
  { key: "completed", label: "Selesai" },
];

export default function OrderStatusStep({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-md border border-red-200 bg-red-50 p-3 text-danger">
        <X size={18} />
        <span className="text-sm font-medium">Pesanan dibatalkan</span>
      </div>
    );
  }

  const currentIndex = steps.findIndex((s) => s.key === status);

  return (
    <div className="flex flex-col gap-3">
      {steps.map((step, index) => {
        const isDone = index <= currentIndex;
        return (
          <div key={step.key} className="flex items-center gap-3">
            {isDone ? (
              <Check size={18} className="text-success" />
            ) : (
              <Circle size={18} className="text-text-secondary" />
            )}
            <span
              className={`text-sm ${
                isDone ? "font-medium text-text-primary" : "text-text-secondary"
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}