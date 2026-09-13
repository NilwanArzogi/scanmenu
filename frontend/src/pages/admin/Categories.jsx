import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import api from "../../services/api";
import DataTable from "../../components/admin/DataTable";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";

export default function Categories() {
  const { data: categories, loading, error, refetch } = useFetch("/admin/categories");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [name, setName] = useState("");
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  function openCreate() {
    setEditing(null);
    setName("");
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(category) {
    setEditing(category);
    setName(category.name);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      if (editing) {
        await api.put(`/admin/categories/${editing.id}`, { name });
      } else {
        await api.post("/admin/categories", { name });
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err.response?.data?.message || "Gagal menyimpan kategori.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(category) {
    if (!confirm(`Hapus kategori "${category.name}"?`)) return;

    try {
      await api.delete(`/admin/categories/${category.id}`);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus kategori.");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Kategori</h1>
          <p className="text-sm text-text-secondary">Kelola kategori menu</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          Tambah Kategori
        </Button>
      </div>

      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && categories?.length === 0 && (
        <EmptyState message="Belum ada kategori." />
      )}
      {!loading && !error && categories?.length > 0 && (
        <DataTable
          columns={[
            { key: "name", label: "Nama" },
            { key: "slug", label: "Slug" },
            { key: "products_count", label: "Jumlah Produk" },
          ]}
          data={categories}
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
        title={editing ? "Edit Kategori" : "Tambah Kategori"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nama Kategori"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Contoh: Minuman Dingin"
            required
          />
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