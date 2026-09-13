import { useState } from "react";
import { Plus, Pencil, Trash2, QrCode, Download } from "lucide-react";
import { useFetch } from "../../hooks/useFetch";
import api from "../../services/api";
import DataTable from "../../components/admin/DataTable";
import Button from "../../components/ui/Button";
import Modal from "../../components/ui/Modal";
import Input from "../../components/ui/Input";
import Badge from "../../components/ui/Badge";
import Loading from "../../components/ui/Loading";
import ErrorState from "../../components/ui/ErrorState";
import EmptyState from "../../components/ui/EmptyState";

export default function Tables() {
  const { data: tables, loading, error, refetch } = useFetch("/admin/tables");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [tableNumber, setTableNumber] = useState("");
  const [status, setStatus] = useState("active");
  const [formError, setFormError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [qrModalOpen, setQrModalOpen] = useState(false);
  const [qrTable, setQrTable] = useState(null);
  const [qrSvg, setQrSvg] = useState(null);

  function openCreate() {
    setEditing(null);
    setTableNumber("");
    setStatus("active");
    setFormError(null);
    setModalOpen(true);
  }

  function openEdit(table) {
    setEditing(table);
    setTableNumber(table.table_number);
    setStatus(table.status);
    setFormError(null);
    setModalOpen(true);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      if (editing) {
        await api.put(`/admin/tables/${editing.id}`, {
          table_number: tableNumber,
          status,
        });
      } else {
        await api.post("/admin/tables", { table_number: tableNumber });
      }
      setModalOpen(false);
      refetch();
    } catch (err) {
      setFormError(err.response?.data?.message || "Gagal menyimpan meja.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(table) {
    if (!confirm(`Hapus meja "${table.table_number}"?`)) return;

    try {
      await api.delete(`/admin/tables/${table.id}`);
      refetch();
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus meja.");
    }
  }

  async function openQrCode(table) {
    setQrTable(table);
    setQrSvg(null);
    setQrModalOpen(true);

    try {
      const res = await api.get(`/admin/tables/${table.id}/qrcode`, {
        responseType: "text",
      });
      setQrSvg(res.data);
    } catch (err) {
      setQrSvg(null);
    }
  }

  function downloadQrCode() {
    if (!qrSvg || !qrTable) return;

    const blob = new Blob([qrSvg], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `qrcode-meja-${qrTable.table_number}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Meja</h1>
          <p className="text-sm text-text-secondary">Kelola meja & QR code</p>
        </div>
        <Button icon={Plus} onClick={openCreate}>
          Tambah Meja
        </Button>
      </div>

      {loading && <Loading />}
      {error && <ErrorState message={error} onRetry={refetch} />}
      {!loading && !error && tables?.length === 0 && (
        <EmptyState message="Belum ada meja." />
      )}
      {!loading && !error && tables?.length > 0 && (
        <DataTable
          columns={[
            { key: "table_number", label: "Nomor Meja" },
            { key: "table_code", label: "Kode Meja" },
            {
              key: "status",
              label: "Status",
              render: (row) =>
                row.status === "active" ? (
                  <Badge variant="success">Aktif</Badge>
                ) : (
                  <Badge variant="danger">Nonaktif</Badge>
                ),
            },
          ]}
          data={tables}
          renderActions={(row) => (
            <>
              <button
                onClick={() => openQrCode(row)}
                className="text-text-secondary hover:text-primary-dark"
                aria-label="Lihat QR Code"
              >
                <QrCode size={16} />
              </button>
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
        title={editing ? "Edit Meja" : "Tambah Meja"}
      >
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input
            label="Nomor Meja"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            placeholder="Contoh: 07"
            required
          />

          {editing && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-text-primary">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
              >
                <option value="active">Aktif</option>
                <option value="inactive">Nonaktif</option>
              </select>
            </div>
          )}

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

      <Modal
        open={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
        title={`QR Code Meja ${qrTable?.table_number ?? ""}`}
      >
        <div className="flex flex-col items-center gap-4">
          {qrSvg ? (
            <div
              className="rounded-lg border border-border p-4"
              dangerouslySetInnerHTML={{ __html: qrSvg }}
            />
          ) : (
            <Loading label="Memuat QR code..." />
          )}

          <Button icon={Download} onClick={downloadQrCode} disabled={!qrSvg}>
            Download QR Code
          </Button>
        </div>
      </Modal>
    </div>
  );
}