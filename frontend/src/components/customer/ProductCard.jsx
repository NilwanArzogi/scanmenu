import { Plus } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import Badge from "../ui/Badge";

export default function ProductCard({ product, onSelect }) {
  return (
    <button
      onClick={() => onSelect(product)}
      className="flex flex-col items-start gap-2 rounded-lg border border-border bg-surface p-3 text-left transition-shadow hover:shadow-sm"
    >
      <div className="aspect-square w-full overflow-hidden rounded-md bg-background">
        {product.image ? (
          <img
            src={`http://127.0.0.1:8000/storage/${product.image}`}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-secondary text-xs">
            Tidak ada foto
          </div>
        )}
      </div>

      <div className="flex w-full flex-col gap-1">
        <span className="text-sm font-medium text-text-primary line-clamp-2">
          {product.name}
        </span>
        <span className="text-sm font-semibold text-primary-dark">
          {formatCurrency(product.price)}
        </span>
      </div>

      {!product.is_available && <Badge variant="danger">Tidak tersedia</Badge>}
    </button>
  );
}