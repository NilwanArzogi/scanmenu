import { useParams, useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { formatCurrency } from "../../utils/formatCurrency";
import OrderStatusStep from "../../components/customer/OrderStatusStep";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import Button from "../../components/ui/Button";

export default function OrderStatus() {
  const { orderNumber } = useParams();
  const navigate = useNavigate();

  const { data: order, loading, error, refetch } = useFetch(
    `/customer/orders/${orderNumber}`
  );

  if (loading) return <Loading label="Memuat status pesanan..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!order) return null;

  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="text-center">
        <p className="text-sm text-text-secondary">Order</p>
        <h1 className="text-xl font-semibold text-text-primary">
          {order.order_number}
        </h1>
        <p className="text-sm text-text-secondary">Meja {order.table_number}</p>
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <OrderStatusStep status={order.status} />
      </div>

      <div className="rounded-lg border border-border bg-surface p-4">
        <h2 className="mb-2 text-sm font-medium text-text-primary">
          Detail Pesanan
        </h2>
        <div className="flex flex-col gap-1">
          {order.items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-text-secondary">
                {item.quantity}x {item.product_name}
              </span>
              <span className="text-text-primary">
                {formatCurrency(item.line_total)}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-between border-t border-border pt-2 text-sm font-semibold">
          <span className="text-text-primary">Total</span>
          <span className="text-primary-dark">{formatCurrency(order.total)}</span>
        </div>
        {order.note && (
          <p className="mt-2 text-xs text-text-secondary">Catatan: {order.note}</p>
        )}
      </div>

      <Button variant="secondary" icon={Home} onClick={() => navigate("/")}>
        Kembali ke Menu
      </Button>
    </div>
  );
}