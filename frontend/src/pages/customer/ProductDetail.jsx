import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { useCart } from "../../context/CartContext";
import { formatCurrency } from "../../utils/formatCurrency";
import QuantityStepper from "../../components/customer/QuantityStepper";
import Button from "../../components/ui/Button";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import Badge from "../../components/ui/Badge";

export default function ProductDetail() {
  const { tableCode, slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();

  const { data: product, loading, error, refetch } = useFetch(`/customer/products/${slug}`);

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");

  function handleAddToCart() {
    addItem(product, quantity, note);
    navigate(`/menu/${tableCode}`);
  }

  if (loading) return <Loading label="Memuat produk..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!product) return null;

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
        <h1 className="text-sm font-medium text-text-primary">{product.name}</h1>
      </div>

      <div className="aspect-square w-full bg-background">
        {product.image ? (
          <img
            src={`http://127.0.0.1:8000/storage/${product.image}`}
            alt={product.name}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-text-secondary text-sm">
            Tidak ada foto
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 p-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-text-primary">{product.name}</h2>
            <p className="text-sm text-text-secondary">{product.category.name}</p>
          </div>
          {!product.is_available && <Badge variant="danger">Tidak tersedia</Badge>}
        </div>

        <p className="text-xl font-semibold text-primary-dark">
          {formatCurrency(product.price)}
        </p>

        {product.description && (
          <p className="text-sm text-text-secondary">{product.description}</p>
        )}

        <div className="flex flex-col gap-1 pt-2">
          <label className="text-sm font-medium text-text-primary">Catatan tambahan</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Contoh: less ice, tidak pedas"
            rows={2}
            className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium text-text-primary">Jumlah</span>
          <QuantityStepper value={quantity} onChange={setQuantity} />
        </div>
      </div>

      <div className="sticky bottom-0 border-t border-border bg-surface p-4">
        <Button
          className="w-full"
          disabled={!product.is_available}
          onClick={handleAddToCart}
        >
          {product.is_available
            ? `Tambahkan ke Keranjang · ${formatCurrency(product.price * quantity)}`
            : "Produk Tidak Tersedia"}
        </Button>
      </div>
    </div>
  );
}