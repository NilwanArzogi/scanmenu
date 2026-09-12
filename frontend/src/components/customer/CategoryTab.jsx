export default function CategoryTab({ categories, active, onSelect }) {
  return (
    <div className="flex gap-2 overflow-x-auto px-4 py-3 no-scrollbar">
      <button
        onClick={() => onSelect(null)}
        className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
          active === null
            ? "bg-primary text-white"
            : "bg-surface text-text-secondary border border-border"
        }`}
      >
        Semua
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
            active === cat.slug
              ? "bg-primary text-white"
              : "bg-surface text-text-secondary border border-border"
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}