export default function StatCard({ icon: Icon, label, value, accent = false }) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-center gap-2 text-text-secondary">
        <Icon size={16} />
        <span className="text-xs font-medium">{label}</span>
      </div>
      <span className={`text-2xl font-semibold ${accent ? "text-primary-dark" : "text-text-primary"}`}>
        {value}
      </span>
    </div>
  );
}