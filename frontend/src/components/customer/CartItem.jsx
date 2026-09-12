import { Trash2 } from "lucide-react";
import { formatCurrency } from "../../utils/formatCurrency";
import QuantityStepper from "./QuantityStepper";

export default function CartItem({ item, onQuantityChange, onRemove }) {
  return (
    <div className="flex gap-3 border-b border-border py-3 last:border-b-0">
      <div className="h-16 w-16 shrink-0 overflow-hidden rounded-md bg-background">
        {item.product.image ? (
          <img
            src={`http://127.0.0.1:8000/storage/${item.product.image}`}
            alt={item.product.name}
            className="h-full w-full object-cover"
          />
        ) : null}
      </div>

      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <span className="text-sm font-medium text-text-primary">
            {item.product.name}
          </span>
          <button
            onClick={onRemove}
            className="shrink-0 text-text-secondary hover:text-danger"
            aria-label="Hapus"
          >
            <Trash2 size={16} />
          </button>
        </div>

        {item.note && (
          <span className="text-xs text-text-secondary">Catatan: {item.note}</span>
        )}

        <div className="flex items-center justify-between pt-1">
          <span className="text-sm font-semibold text-primary-dark">
            {formatCurrency(item.product.price * item.quantity)}
          </span>
          <QuantityStepper
            value={item.quantity}
            onChange={onQuantityChange}
            min={0}
          />
        </div>
      </div>
    </div>
  );
}