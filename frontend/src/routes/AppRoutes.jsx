import { Routes, Route, Navigate } from "react-router-dom";
import CustomerLayout from "../layouts/CustomerLayout";
import AdminLayout from "../layouts/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";

import Menu from "../pages/customer/Menu";
import ProductDetail from "../pages/customer/ProductDetail";
import Cart from "../pages/customer/Cart";
import Checkout from "../pages/customer/Checkout";
import OrderStatus from "../pages/customer/OrderStatus";

import Login from "../pages/admin/Login";
import Dashboard from "../pages/admin/Dashboard";
import Categories from "../pages/admin/Categories";
import Products from "../pages/admin/Products";
import Tables from "../pages/admin/Tables";
import Orders from "../pages/admin/Orders";

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

      <Route path="/admin/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route
          path="/admin/dashboard"
          element={
          <ProtectedRoute roles={["admin"]}>
            <Dashboard />
          </ProtectedRoute> }
        />
      </Route>

      <Route path="/admin/categories" 
      element={
      <Categories />} 
      />
      <Route path="/admin/products" 
      element={
      <Products />} 
      />
      <Route path="/admin/tables" 
      element={
      <Tables />} 
      />
      <Route path="/admin/orders" 
      element={
      <Orders />} 
      />

      <Route path="*" element={<Navigate to="/menu/tbl-01-demo" replace />} />
    </Routes>
  );
}