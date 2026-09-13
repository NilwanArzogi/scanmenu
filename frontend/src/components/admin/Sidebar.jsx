import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  UtensilsCrossed,
  Tags,
  QrCode,
  ClipboardList,
  FileBarChart,
  LogOut,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";

const menuItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, roles: ["admin"] },
  { to: "/admin/products", label: "Menu", icon: UtensilsCrossed, roles: ["admin"] },
  { to: "/admin/categories", label: "Kategori", icon: Tags, roles: ["admin"] },
  { to: "/admin/tables", label: "Meja", icon: QrCode, roles: ["admin"] },
  { to: "/admin/orders", label: "Pesanan", icon: ClipboardList, roles: ["admin", "cashier", "kitchen"] },
  { to: "/admin/reports", label: "Laporan", icon: FileBarChart, roles: ["admin"] },
];

export default function Sidebar({ className = "" }) {
  const { user, logout } = useAuth();

  const visibleItems = menuItems.filter((item) => item.roles.includes(user?.role));

  return (
    <aside className={`flex h-full w-56 flex-col border-r border-border bg-surface ${className}`}>
      <div className="border-b border-border p-4">
        <h1 className="text-base font-semibold text-text-primary">ScanMenu</h1>
        <p className="text-xs text-text-secondary">{user?.name}</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 p-3">
        {visibleItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-orange-50 text-primary-dark"
                  : "text-text-secondary hover:bg-background hover:text-text-primary"
              }`
            }
          >
            <item.icon size={18} />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-border p-3">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-text-secondary hover:bg-background hover:text-danger"
        >
          <LogOut size={18} />
          Keluar
        </button>
      </div>
    </aside>
  );
}