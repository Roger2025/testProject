import React, { useState } from 'react';
import useAuth from '../hooks/useAuth'; // 自訂 Hook 拿登入資訊
import axios from 'axios';
import './AdminPage.css';
import useLogout from '../hooks/useLogout';
import { useNavigate } from 'react-router-dom'; // ✅ 加這行：導頁用



function AdminPage() {
  const { user, authLoading } = useAuth();
  const [testResult, setTestResult] = useState('');
  const logout = useLogout();
  const navigate = useNavigate(); // ✅ 新增：React Router 導頁 hook

  if (authLoading) return <p>載入中...</p>;
  if (!user) return <p>尚未登入</p>;
  if (user.role !== 'admin') return <p>❌ 無權限</p>;

  const handleTestAccess = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/admin-only-data', {
        withCredentials: true
      });
      setTestResult(`✅ 測試成功：${res.data.message}`);
    } catch (err) {
      setTestResult(`❌ 測試失敗：${err.response?.data?.message || '未知錯誤'}`);
    }
  };
  
  return (
    <div className="admin-container">
      <h1 className="admin-title">管理者後台平台</h1>
      <p className="admin-subtitle">歡迎來到管理者系統，您可以在此管理商品與訂單。</p>

      <div className="button-group">
        <button className="admin-button">商品管理</button>
        <button className="admin-button">訂單管理</button>
        <button className="admin-button">店家資料管理</button>
        <button className="admin-button" onClick={() => navigate('/admin/pending-users')}>
          📋 查看待審核商家
        </button>
        <button className="admin-button" onClick={handleTestAccess}>🧪 測試 admin-only API</button>
        <button className="admin-button" onClick={() => navigate('/admin/all-users')}>查看所有使用者</button>
        <button onClick={logout}>登出</button>
      </div>

      {testResult && (
        <div className="test-result">
          <p>{testResult}</p>
        </div>
      )}
    </div>
  );
}

export default AdminPage;
