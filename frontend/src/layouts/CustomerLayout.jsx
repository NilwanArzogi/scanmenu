import { Outlet } from "react-router-dom";

export default function CustomerLayout() {
  return (
    <div className="min-h-screen bg-background pb-safe">
      <Outlet />
    </div>
  );
}