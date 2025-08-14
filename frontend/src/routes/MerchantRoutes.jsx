// src/routes/MerchantRoutes.jsx
import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import MerchantHeader from '../components/layout/MerchantHeader';
import DashboardPage from '../pages/merchant/DashboardPage';
import MenuPage from '../pages/merchant/MenuPage';
import ProfilePage from '../pages/merchant/ProfilePage';
import OrdersPage from '../pages/merchant/OrdersPage';
import StoreStatusPage from '../pages/merchant/StoreStatusPage';
import MenuEdit from '../features/merchant/menu/MenuEdit';

function MerchantShell() {
  return (
    <>
      <MerchantHeader />
      <Outlet />
    </>
  );
}

export default function MerchantRoutes() {
  return (
    <Routes>
      <Route
        element={
          <ProtectedRoute role="shop">
            <MerchantShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="menu/new" element={<MenuEdit />} />
        <Route path="menu/edit/:id" element={<MenuEdit />} />
        <Route path="order" element={<OrdersPage />} />
        <Route path="storestatus" element={<StoreStatusPage />} />
        <Route path="profile" element={<ProfilePage />} />
        {/* Catch-all route to redirect to dashboard if no match */}
        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}