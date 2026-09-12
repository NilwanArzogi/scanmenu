import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Search, ShoppingCart } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import CategoryTab from "../../components/customer/CategoryTab";
import ProductCard from "../../components/customer/ProductCard";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import { useCart } from "../../context/CartContext";

export default function Menu() {
  const { tableCode } = useParams();
  const navigate = useNavigate();
  const { items } = useCart();

  const [category, setCategory] = useState(null);
  const [search, setSearch] = useState("");

  const { data: categories } = useFetch("/customer/categories");
  const {
    data: products,
    loading,
    error,
    refetch,
  } = useFetch("/customer/products", { category, search });

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <div className="flex flex-col">
      <div className="sticky top-0 z-10 bg-surface border-b border-border">
        <div className="flex items-center justify-between px-4 pt-4">
          <div>
            <h1 className="text-lg font-semibold text-text-primary">ScanMenu</h1>
            <p className="text-xs text-text-secondary">Meja {tableCode}</p>
          </div>
          <button
            onClick={() => navigate(`/menu/${tableCode}/cart`)}
            className="relative rounded-md p-2 text-text-primary hover:bg-background"
            aria-label="Keranjang"
          >
            <ShoppingCart size={22} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-white">
                {cartCount}
              </span>
            )}
          </button>
        </div>

        <div className="px-4 pb-3 pt-3">
          <div className="flex items-center gap-2 rounded-md border border-border bg-background px-3 py-2">
            <Search size={16} className="text-text-secondary" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari menu..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-text-secondary"
            />
          </div>
        </div>

        {categories && (
          <CategoryTab categories={categories} active={category} onSelect={setCategory} />
        )}
      </div>

      <div className="p-4">
        {loading && <Loading label="Memuat menu..." />}
        {error && <ErrorState message={error} onRetry={refetch} />}
        {!loading && !error && products?.length === 0 && (
          <EmptyState message="Menu tidak ditemukan." />
        )}
        {!loading && !error && products?.length > 0 && (
          <div className="grid grid-cols-2 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onSelect={(p) =>
                  navigate(`/menu/${tableCode}/product/${p.slug}`)
                }
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}