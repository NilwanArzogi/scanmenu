import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ShoppingBag } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import CartItem from "../../components/customer/CartItem";
import Button from "../../components/ui/Button";
import EmptyState from "../../components/ui/EmptyState";

export default function Cart() {
  const { tableCode } = useParams();
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, subtotal } = useCart();

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-border bg-surface px-4 py-3">
        <button
          onClick={() => navigate(`/menu/${tableCode}`)}
          className="text-text-primary"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-sm font-medium text-text-primary">Keranjang</h1>
      </div>

      {items.length === 0 ? (
        <EmptyState icon={ShoppingBag} message="Keranjang masih kosong." />
      ) : (
        <>
          <div className="flex flex-col px-4">
            {items.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                onQuantityChange={(qty) => updateQuantity(index, qty)}
                onRemove={() => removeItem(index)}
              />
            ))}
          </div>

          <div className="sticky bottom-0 flex flex-col gap-3 border-t border-border bg-surface p-4 pb-safe">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text-secondary">Subtotal</span>
              <span className="font-semibold text-text-primary">
                {formatCurrency(subtotal)}
              </span>
            </div>
            <Button className="w-full" onClick={() => navigate(`/menu/${tableCode}/checkout`)}>
              Checkout
            </Button>
          </div>
        </>
      )}
    </div>
  );
}