import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import api from "../../services/api";
import { formatCurrency } from "../../utils/formatCurrency";
import DataTable from "../../components/admin/DataTable";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";

export default function Products() {
  const { data: products, loading, error, refetch } = useFetch("/admin/products");
  const { data: categories } = useFetch("/admin/categories");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    is_available: true,
    image: null,
  });
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function openCreate() {
    setEditing(null);
    setForm({
      category_id: categories?.[0]?.id ?? "",
      name: "",
      description: "",
      price: "",
      is_available: true,
      image: null,
    });
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(product) {
    setEditing(product);
    setForm({
      category_id: product.category.id,
      name: product.name,
      description: product.description || "",
      price: product.price,
      is_available: product.is_available,
      image: null,
    });
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    const formData = new FormData();
    formData.append("category_id", form.category_id);
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("is_available", form.is_available ? "1" : "0");
    if (form.image) formData.append("image", form.image);

    try {
      if (editing) {
        formData.append("_method", "PUT");
        await api.post(`/admin/products/${editing.id}`, formData);
      } else {
        await api.post("/admin/products", formData);
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err.response?.data?.message || "Gagal menyimpan produk.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(product) {
    if (!confirm(`Hapus produk "${product.name}"?`)) return;

    try {
      await api.delete(`/admin/products/${product.id}`);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus produk.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Menu</h1>
          <p className="text-sm text-text-secondary">Kelola produk makanan & minuman</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          Tambah Produk
        </Button>
      </div>

      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && products?.length === 0 && (
        <EmptyState message="Belum ada produk." />
      )}
      {!loading && !error && products?.length > 0 && (
        <DataTable
          columns={[
            { key: "name", label: "Nama" },
            { key: "category", label: "Kategori", render: (row) => row.category.name },
            { key: "price", label: "Harga", render: (row) => formatCurrency(row.price) },
            {
              key: "is_available",
              label: "Status",
              render: (row) =>
                row.is_available ? (
                  <Badge variant="success">Tersedia</Badge>
                ) : (
                  <Badge variant="danger">Tidak tersedia</Badge>
                ),
            },
          ]}
          data={products}
          renderActions={(row) => (
            <>
              <button
                onClick={() => openEdit(row)}
                className="text-text-secondary hover:text-primary-dark"
                aria-label="Edit"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(row)}
                className="text-text-secondary hover:text-danger"
                aria-label="Hapus"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
        />
      )}

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Edit Produk" : "Tambah Produk"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-primary">Kategori</label>
            <select
              value={form.category_id}
              onChange={(e) => setForm({ ...form, category_id: e.target.value })}
              className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              required
            >
              {categories?.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <Input
            label="Nama Produk"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-primary">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={2}
              className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>

          <Input
            label="Harga"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-text-primary">Foto (opsional)</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
              className="text-sm text-text-secondary"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={form.is_available}
              onChange={(e) => setForm({ ...form, is_available: e.target.checked })}
            />
            Tersedia
          </label>

          {formError && <p className="text-sm text-danger">{formError}</p>}

          <div className="flex justify-end gap-2">
            <Button variant="secondary" type="button" onClick={() => setModalOpen(false)}>
              Batal
            </Button>
            <Button type="submit" disabled={submitting}>
              {submitting ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}