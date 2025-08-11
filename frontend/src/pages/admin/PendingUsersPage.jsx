import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../../styles/admin_styles/PendingUsersPage.css'; 

// pending頁面
const PendingUsersPage = () => {
  const [pendingShops, setPendingShops] = useState([]);
  const [search, setSearch] = useState('');                  // 新：搜尋文字（帳號/店名/地址）
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null); // 新：資料更新時間

  // 取得商家pending用戶
  const fetchPendingShops = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/admin/pending-users', {
        withCredentials: true
      });
      setPendingShops(res.data.pendingShops || []);
      setLastRefreshedAt(new Date()); // 新：記錄更新時間
    } catch (err) {
      console.error('❌ 取得待審核用戶失敗:', err);
    }
  };

  // 取得時間欄位（自動兼容 created_at / createdAt）  // 新增
  const getCreatedAt = (u) => u?.created_at || u?.createdAt || null;

  // 轉成可讀時間（在地化）  // 新增
  const formatDateTime = (isoStr) => {
    if (!isoStr) return '-';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString();
  };

  // 審核商家
  const handleApprove = async (account) => {
    try {
      //  改為完整後端路徑 + withCredentials
      const res = await axios.patch(`http://localhost:3001/api/admin/approve-user/${account}`, null, { // 發出修改角色請求
        withCredentials: true
      });
      alert(res.data.message);  //  顯示後端回應訊息
      fetchPendingShops(); // 更新畫面  //  呼叫抓最新名單
    } catch (err) {
      console.error('❌ 審核失敗:', err);
      alert('❌ 無法完成審核');
    }
  };

  useEffect(() => {
    fetchPendingShops();
  }, []);

  // 新：搜尋 + 排序（依註冊時間由早到晚）
  const filteredList = useMemo(() => {
    const list = (pendingShops || []).filter(p => {
      const q = search.trim();
      if (!q) return true;
      const hay = `${p.account || ''} ${p.storeName || ''} ${p.storeAddress || ''}`;
      return hay.toLowerCase().includes(q.toLowerCase());
    });

    // 依建立時間排序（舊到新）
    list.sort((a, b) => {
      const da = new Date(getCreatedAt(a) || 0).getTime();
      const db = new Date(getCreatedAt(b) || 0).getTime();
      return da - db;
    });
    return list;
  }, [pendingShops, search]);

  // 新：儀表板統計（只顯示 Pending 總數）
  const pendingCount = pendingShops.length;

  return (
    <div className="pending-users-page">
      {/* 標題 + 更新時間 */}
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <h2 className="title">待審核商家列表</h2>
        <small style={{ opacity: 0.7 }}>
          資料更新於：{lastRefreshedAt ? lastRefreshedAt.toLocaleString() : '-'}
        </small>
      </div>

      {/* 儀表板（只顯示 Pending 總數） */}
      <div className="stats-bar">
        <div className="stat-card">
          <b>Pending 總數</b>
          <div>{pendingCount}</div>
        </div>
      </div>

      {/* 說明（保留） */}
      <p className="subtitle">此頁列出所有「商家」待審核帳號，可直接通過審核</p>

      {/* 查詢列（和 AllUsersPage 風格一致） */}
      <div className="controls">
        <input
          type="text"
          placeholder="搜尋帳號 / 店名 / 地址"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={fetchPendingShops}>重新整理</button>
      </div>

      {filteredList.length === 0 ? (
        <p className="no-users">目前沒有待審核的帳號</p>
      ) : (
        <table className="pending-table">
          <thead>
            <tr>
              <th>帳號</th>
              <th>店家名稱</th>
              <th>店家地址</th>
              <th>狀態</th>
              <th>建立時間</th> {/* 新增欄 */}
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {filteredList.map((p) => (
              // 加上 key={p.account} 是告訴 React：這一列的資料代表帳號為 shop123 的用戶 下次重新渲染時請記得他
              <tr key={p.account}>
                <td>{p.account}</td>
                <td>{p.storeName}</td>
                <td>{p.storeAddress}</td>
                <td className="status-text pending">{p.status}</td> {/* 套用和 AllUsersPage 一樣的 pending 樣式 */}
                <td>{formatDateTime(getCreatedAt(p))}</td>           {/* 顯示建立時間 */}
                <td>
                  <button
                    className="btn-approve"
                    onClick={() => {
                      const confirmApprove = window.confirm(`確定要通過帳號 ${p.account} 的審核嗎？`); // 彈出對話框
                      if (confirmApprove) {
                        handleApprove(p.account);
                      }
                    }}
                  >
                    通過審核
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PendingUsersPage;
