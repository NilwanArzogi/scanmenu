import {
  Wallet,
  ShoppingBag,
  Clock,
  Flame,
  CheckCircle2,
  TrendingUp,
} from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import { formatCurrency } from "../../utils/formatCurrency";
import StatCard from "../../components/admin/StatCard";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";
import Card from "../../components/ui/Card";

export default function Dashboard() {
  const { data, loading, error, refetch } = useFetch("/admin/dashboard");

  if (loading) return <Loading label="Memuat dashboard..." />;
  if (error) return <ErrorState message={error} onRetry={refetch} />;
  if (!data) return null;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Dashboard</h1>
        <p className="text-sm text-text-secondary">Ringkasan hari ini</p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard
          icon={Wallet}
          label="Total Pendapatan"
          value={formatCurrency(data.total_revenue_today)}
          accent
        />
        <StatCard icon={ShoppingBag} label="Total Pesanan" value={data.total_orders_today} />
        <StatCard icon={Clock} label="Pending" value={data.pending_orders} />
        <StatCard icon={Flame} label="Diproses" value={data.processing_orders} />
        <StatCard icon={CheckCircle2} label="Selesai" value={data.completed_orders} />
      </div>

      <Card className="p-4">
        <div className="mb-3 flex items-center gap-2 text-text-primary">
          <TrendingUp size={18} />
          <h2 className="text-sm font-semibold">Produk Terlaris Hari Ini</h2>
        </div>

        {data.best_sellers.length === 0 ? (
          <EmptyState message="Belum ada penjualan hari ini." />
        ) : (
          <div className="flex flex-col divide-y divide-border">
            {data.best_sellers.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md bg-background text-xs font-medium text-text-secondary">
                    {index + 1}
                  </span>
                  <span className="text-sm text-text-primary">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-text-secondary">
                  {item.total_sold} terjual
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}