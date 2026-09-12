import { Routes, Route, Navigate } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import Menu from "../pages/customer/Menu";
import ProductDetail from "../pages/customer/ProductDetail";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import OrderStatus from "../pages/customer/OrderStatus";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<CustomerLayout />}>
        <Route path="/menu/:tableCode" element={<Menu />} />
        <Route path="/menu/:tableCode/product/:slug" element={<ProductDetail />} />
        <Route path="/menu/:tableCode/cart" element={<Cart />} />
        <Route path="/menu/:tableCode/checkout" element={<Checkout />} />
        <Route path="/order/:orderNumber" element={<OrderStatus />} />
      </Route>
      <Route path="*" element={<Navigate to="/menu/tbl-01-demo" replace />} />
    </Routes>
  );
}