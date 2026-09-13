import { formatCurrency } from "../../utils/formatCurrency";
import Badge from "../ui/Badge";

const statusConfig = {
  pending: { label: "Pending", variant: "default" },
  confirmed: { label: "Dikonfirmasi", variant: "primary" },
  processing: { label: "Diproses", variant: "primary" },
  ready: { label: "Siap", variant: "success" },
  completed: { label: "Selesai", variant: "success" },
  cancelled: { label: "Dibatalkan", variant: "danger" },
};

const nextStatusMap = {
  pending: { next: "confirmed", label: "Konfirmasi" },
  confirmed: { next: "processing", label: "Proses" },
  processing: { next: "ready", label: "Tandai Siap" },
  ready: { next: "completed", label: "Selesaikan" },
};

export default function OrderCard({ order, onUpdateStatus, updating }) {
  const config = statusConfig[order.status];
  const action = nextStatusMap[order.status];

  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-4">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-sm font-semibold text-text-primary">
            {order.order_number}
          </span>
          <p className="text-xs text-text-secondary">Meja {order.table_number}</p>
        </div>
        <Badge variant={config.variant}>{config.label}</Badge>
      </div>

      <div className="flex flex-col gap-1 border-t border-border pt-2">
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-text-secondary">
              {item.quantity}x {item.product_name}
            </span>
            <span className="text-text-primary">{formatCurrency(item.line_total)}</span>
          </div>
        ))}
      </div>

      {order.note && (
        <p className="rounded-md bg-background px-2 py-1 text-xs text-text-secondary">
          Catatan: {order.note}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-border pt-2">
        <span className="text-sm font-semibold text-primary-dark">
          {formatCurrency(order.total)}
        </span>
        <div className="flex gap-2">
          {action && (
            <button
              onClick={() => onUpdateStatus(order.id, action.next)}
              disabled={updating}
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              {action.label}
            </button>
          )}
          {order.status !== "cancelled" && order.status !== "completed" && (
            <button
              onClick={() => onUpdateStatus(order.id, "cancelled")}
              disabled={updating}
              className="rounded-md border border-border px-3 py-1.5 text-xs font-medium text-danger hover:bg-red-50 disabled:opacity-50"
            >
              Batalkan
            </button>
          )}
        </div>
      </div>
    </div>
  );
}