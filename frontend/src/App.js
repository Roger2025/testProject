import { BrowserRouter , Route, Routes, Navigate } from 'react-router-dom';
import useAuth from './hooks/useAuth';
import LoginPage from './pages/admin/LoginPage';
import RegisterPage from './pages/admin/RegisterPage';
import VerifyEmailPage from './pages/admin/VerifyEmailPage';
import AdminPage from './pages/admin/AdminPage';
import PendingUsersPage from './pages/admin/PendingUsersPage';
import AllUsersPage from './pages/admin/AllUsersPage';

function App() {
  const { user, authLoading } = useAuth();

  // 檢查是否為管理員
  const withAdminAuth = (Component) => {
  console.log("最新user資訊:", user);
  console.log("authLoading:", authLoading);
  if (authLoading) return <p>🔄 載入中...</p>; // 還沒拿到user資訊 等一下
    console.log("最新user資訊:", user);
  console.log("authLoading:", authLoading);
  if (!user || user.role !== 'admin') return <Navigate to="/login" replace />;
  if (user.adminVerified !== true) return <Navigate to="/verify" replace />;
  return <Component />; // 完成判斷 渲染
 };
 
  // 檢查是否為商家
//  const withShopAuth = (Component) => {
//     if (authLoading) return <p>載入中...</p>;
//     if (!user || user.role !== 'shop') return <Navigate to="/login" />;
//     return <Component />;
//   };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/verify" element={<VerifyEmailPage />} />
        <Route path="/admin" element={withAdminAuth(AdminPage)} />
        <Route path="/admin/pending-users" element={withAdminAuth(PendingUsersPage)} />
        <Route path="/admin/all-users" element={withAdminAuth(AllUsersPage)} />
        <Route path="/user" element={<div>👤 使用者首頁</div>} />
        <Route path="/shop" element={<div>🏪 商家首頁</div>} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;