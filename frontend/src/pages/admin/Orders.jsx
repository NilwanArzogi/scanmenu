import { useState } from "react";
import { useFetch } from "../../hooks/useFetch";
import api from "../../services/api";
import OrderCard from "../../components/admin/OrderCard";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";

const statusTabs = [
  { key: null, label: "Semua" },
  { key: "pending", label: "Pending" },
  { key: "confirmed", label: "Dikonfirmasi" },
  { key: "processing", label: "Diproses" },
  { key: "ready", label: "Siap" },
  { key: "completed", label: "Selesai" },
];

export default function Orders() {
  const [statusFilter, setStatusFilter] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  const { data: orders, loading, error, refetch } = useFetch("/admin/orders", {
    status: statusFilter,
  });

  async function handleUpdateStatus(orderId, newStatus) {
    setUpdatingId(orderId);
    try {
      await api.patch(`/admin/orders/${orderId}/status`, { status: newStatus });
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal memperbarui status.");
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h1 className="text-lg font-semibold text-text-primary">Pesanan</h1>
        <p className="text-sm text-text-secondary">Kelola pesanan masuk</p>
      </div>

      <div className="flex gap-2 overflow-x-auto no-scrollbar">
        {statusTabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => setStatusFilter(tab.key)}
            className={`shrink-0 rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              statusFilter === tab.key
                ? "bg-primary text-white"
                : "bg-surface text-text-secondary border border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && orders?.length === 0 && (
        <EmptyState message="Tidak ada pesanan." />
      )}
      {!loading && !error && orders?.length > 0 && (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onUpdateStatus={handleUpdateStatus}
              updating={updatingId === order.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}