import { Inbox } from "lucide-react";

export default function EmptyState({ icon: Icon = Inbox, message = "Belum ada data." }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 py-10 text-text-secondary">
      <Icon size={32} />
      <span className="text-sm">{message}</span>
    </div>
  );
}