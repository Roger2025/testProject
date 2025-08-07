import useAuth from '../../hooks/useAuth'; // 自訂 Hook 拿登入資訊
import useLogout from '../../hooks/useLogout';
import { useNavigate } from 'react-router-dom';
import '../../styles/admin_styles/AdminPage.css';

// 管理者頁面
function AdminPage() {
  const { user, authLoading  } = useAuth();
  const logout = useLogout();
  const navigate = useNavigate();

  if (authLoading || !user) return <p>🔄 載入中...</p>;

  return (
    <div className="admin-container">
      <h1 className="admin-title">管理者後台平台</h1>
      <p className="admin-subtitle">歡迎來到管理者系統，您可以在此管理商品與訂單。</p>

      <div className="button-group">
        <button className="admin-button" onClick={() => navigate('/admin/pending-users')}>
          📋 查看待審核商家
        </button>
        <button className="admin-button" onClick={() => navigate('/admin/all-users')}>
          📝查看所有使用者 有審核、停權/恢復功能
        </button>
        <button onClick={logout}>登出</button>
      </div>
    </div>
  );
}

export default AdminPage;
