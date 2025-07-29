// src/routes/MerchantRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from '../pages/merchant/LoginPage';
import DashboardPage from '../pages/merchant/DashboardPage';
import MenuPage from '../pages/merchant/MenuPage';
import MenuEdit from '../features/merchant/menu/MenuEdit';
import SetMenuEdit from '../features/merchant/setMenu/SetMenuEdit';
import { useMerchantAuth } from '../hooks/useMerchantAuth';
import ProtectedRoute from './ProtectedRoute';

const MerchantRoutes = () => {
  const { merchant } = useMerchantAuth();

  return (
    <Routes>
      {/* 公開路由 */}
      <Route path="/merchant/login" element={<LoginPage />} />

      {/* 受保護的路由 */}
      <Route
        path="/merchant/*"
        element={
          <ProtectedRoute>
            <Routes>
              <Route path="dashboard" element={<DashboardPage />} />
              {/* 整合後的菜單頁 */}
              <Route path="menu" element={<MenuPage />} />

              {/* 單品新增 / 編輯 */}
              <Route path="menus/new" element={<MenuEdit merchantId={merchant?._id} />} />
              <Route path="menus/edit/:id" element={<MenuEdit merchantId={merchant?._id} />} />

              {/* 套餐新增 / 編輯（共用） */}
              <Route path="set-menus/new" element={<SetMenuEdit merchantId={merchant?._id} />} />
              <Route path="set-menus/edit/:id" element={<SetMenuEdit merchantId={merchant?._id} />} />

              {/* 預設跳轉 */}
              <Route path="*" element={<Navigate to="/merchant/dashboard" />} />
            </Routes>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default MerchantRoutes;
