// src/routes/MerchantRoutes.jsx
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MerchantHeader from '../components/layout/MerchantHeader';
import LoginPage from '../pages/merchant/LoginPage';  //登入頁路徑到時候整合登入模組要改
import DashboardPage from '../pages/merchant/DashboardPage';
import MenuPage from '../pages/merchant/MenuPage';
import MenuEdit from '../features/merchant/menu/MenuEdit';
import SetMenuEdit from '../features/merchant/setMenu/SetMenuEdit';
import StoreStatusPage from '../pages/merchant/StoreStatusPage';
import { useMerchantAuth } from '../hooks/useMerchantAuth';
import ProtectedRoute from './ProtectedRoute';
const FEATURE_ENABLE_SET_MENU = false; // 開發期間關閉，正式時設 true

// 商家布局組件 - 包含 Header 的完整布局
const MerchantLayout = ({ children }) => {
  return (
    <div className="merchant-layout">
      <MerchantHeader />
      <div className="container-fluid">
        <div className="row">
          <div className="col-12">
            <main className="py-4">
              {children}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

const MerchantRoutes = () => {
  const { merchant } = useMerchantAuth();

  return (
    <Routes>
      {/* 公開路由 - 登入頁面不需要 Header */}
      <Route path="/login" element={<LoginPage />} />

      {/* 受保護的路由 - 包含 MerchantHeader */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <MerchantLayout>
              <Routes>
                <Route path="dashboard" element={<DashboardPage />} />
                
                {/* 整合後的菜單頁 */}
                <Route path="menu" element={<MenuPage />} />

                {/* 單品新增 / 編輯 */}
                <Route path="menu/new" element={<MenuEdit merchantId={merchant?._id} />} />
                <Route path="menu/edit/:id" element={<MenuEdit merchantId={merchant?._id} />} />

                {/* 套餐新增 / 編輯 開發期間不開放 */}
                {FEATURE_ENABLE_SET_MENU && (
                <Route path="set-menu/new" element={<SetMenuEdit merchantId={merchant?._id} />} />
                )}
                {FEATURE_ENABLE_SET_MENU && (
                <Route path="set-menu/edit/:id" element={<SetMenuEdit merchantId={merchant?._id} />} />
                )}

                {/* 店家狀態頁 */}
                      <Route path="/storestatus" element={<StoreStatusPage />} />

                {/* 預設跳轉到儀表板 */}
                <Route path="/" element={<Navigate to="dashboard" replace />} />
                <Route path="*" element={<Navigate to="dashboard" replace />} />
              </Routes>
            </MerchantLayout>
          </ProtectedRoute>
        }
      />

      {/* 處理未匹配的路由 */}
      <Route path="*" element={<Navigate to="/merchant/login" replace />} />
    </Routes>
  );
};

export default MerchantRoutes;