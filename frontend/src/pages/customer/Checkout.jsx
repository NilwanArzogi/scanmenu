import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import api from "../../services/api";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";

export default function Checkout() {
  const { tableCode } = useParams();
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();

  const [customerName, setCustomerName] = useState("");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);

    try {
      const res = await api.post("/customer/orders", {
        table_code: tableCode,
        customer_name: customerName || null,
        note: note || null,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          note: item.note || null,
        })),
      });

      const orderNumber = res.data.data.order_number;
      clearCart();
      navigate(`/order/${orderNumber}`);
    } catch (err) {
      setError(err.response?.data?.message || "Gagal membuat pesanan.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
        <button
          onClick={() => navigate(`/menu/${tableCode}/cart`)}
          className="text-text-primary"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-medium text-text-primary">Checkout</h1>
      </div>

      <div className="flex flex-col gap-4 p-4">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-text-primary">Meja</span>
          <span className="text-sm text-text-secondary">{tableCode}</span>
        </div>

        <Input
          label="Nama (opsional)"
          placeholder="Nama kamu"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-text-primary">
            Catatan pesanan (opsional)
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="Contoh: tolong dibungkus terpisah"
            className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface p-3">
          <span className="text-sm font-medium text-text-primary">Ringkasan Pesanan</span>
          {items.map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-text-secondary">
                {item.quantity}x {item.product.name}
              </span>
              <span className="text-text-primary">
                {formatCurrency(item.product.price * item.quantity)}
              </span>
            </div>
          ))}
          <div className="flex justify-between border-t border-border pt-2 text-sm font-semibold">
            <span className="text-text-primary">Subtotal</span>
            <span className="text-primary-dark">{formatCurrency(subtotal)}</span>
          </div>
        </div>

        {error && <p className="text-sm text-danger">{error}</p>}
      </div>

      <div className="sticky bottom-0 border-t border-border bg-surface p-4 pb-safe">
        <Button className="w-full" onClick={handleSubmit} disabled={submitting}>
          {submitting ? "Memproses..." : `Buat Pesanan · ${formatCurrency(subtotal)}`}
        </Button>
      </div>
    </div>
  );
}