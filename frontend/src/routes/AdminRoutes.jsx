import { Routes, Route, Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import AdminPage from '../pages/admin/AdminPage';
import PendingUsersPage from '../pages/admin/PendingUsersPage';
import AllUsersPage from '../pages/admin/AllUsersPage';

// 管理者路由子模組
function AdminRoutes() {
  const { user, authLoading } = useAuth();

  // 檢查是否為管理員
  const withAdminAuth = (Component) => {
    console.log("最新user資訊:", user);
    console.log("authLoading:", authLoading);
    if (authLoading) return <p>🔄 載入中...</p>; // 還沒拿到user資訊 等一下

    if (!user || user.role !== 'admin') return <Navigate to="/auth/login" replace />;

    // 如果 adminVerified 還是 undefined 就顯示載入中 不跳轉
    if (user.adminVerified !== true) {
      return <p>🔄 正在驗證中，請稍候...</p>; 
    }

    return <Component />; // 完成判斷 渲染
  };

  return (
    <Routes>
      <Route path="" element={withAdminAuth(AdminPage)} />
      <Route path="pending-users" element={withAdminAuth(PendingUsersPage)} />
      <Route path="all-users" element={withAdminAuth(AllUsersPage)} />
    </Routes>
  );
}

export default AdminRoutes;
