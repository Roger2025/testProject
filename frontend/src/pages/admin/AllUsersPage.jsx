import React, { useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import '../../styles/admin_styles/AllUsersPage.css';

// 所有使用者頁面
function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [lastRefreshedAt, setLastRefreshedAt] = useState(null); // 顯示資料更新時間

  // 取得時間欄位（自動兼容 created_at / createdAt）
  const getCreatedAt = (u) => u?.created_at || u?.createdAt || null;

  // 轉成可讀時間
  const formatDateTime = (isoStr) => {
    if (!isoStr) return '-';
    const d = new Date(isoStr);
    if (isNaN(d.getTime())) return '-';
    return d.toLocaleString();
  };

  // 更新畫面
  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/admin/all-users', {
        withCredentials: true
      });
      setUsers(res.data.users || []);
      setLastRefreshedAt(new Date()); // 記錄更新時間
    } catch (err) {
      console.error('❌ 取得使用者失敗:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 停權
  const handleDelete = async (account) => {
    if (!window.confirm(`確定要停權帳號 ${account} 嗎？`)) return;
    try {
      const res = await axios.delete(`http://localhost:3001/api/admin/delete-user/${account}`, {
        withCredentials: true
      });
      if (res.data.status === 'success') {
        alert(res.data.message);
        fetchUsers();
      } else {
        alert('⚠️ ' + res.data.message);
      }
    } catch (err) {
      console.error('❌ 停權失敗:', err);
      alert('❌ 無法停權使用者');
    }
  };

  // 恢復帳號
  const handleRestore = async (account) => {
    if (!window.confirm(`確定要恢復帳號 ${account} 嗎？`)) return;
    try {
      const res = await axios.patch(`http://localhost:3001/api/admin/restore-user/${account}`, {}, {
        withCredentials: true
      });
      if (res.data.status === 'success') {
        alert(res.data.message);
        fetchUsers();
      } else {
        alert('⚠️ ' + res.data.message);
      }
    } catch (err) {
      console.error('❌ 恢復失敗:', err);
      alert('❌ 無法恢復帳號');
    }
  };

  // 通過商家審核
  const handleApprove = async (account) => {
    if (!window.confirm(`確定要審核通過帳號 ${account} 嗎？`)) return;
    try {
      const res = await axios.patch(`http://localhost:3001/api/admin/approve-user/${account}`, {}, {
        withCredentials: true
      });
      if (res.data.status === 'success') {
        alert(res.data.message);
        fetchUsers();
      } else {
        alert('⚠️ ' + res.data.message);
      }
    } catch (err) {
      console.error('❌ 審核失敗:', err);
      alert('❌ 無法審核帳號');
    }
  };

  // role + status + search 多條件過濾
  const filteredUsers = useMemo(() => {
    const list = users.filter(u => {
      const matchesSearch = (u.account || '').includes(search);
      const matchesRole = filterRole === 'all' || u.role === filterRole;
      const matchesStatus = filterStatus === 'all' || u.status === filterStatus;
      return matchesSearch && matchesRole && matchesStatus;
    });

    // 當切到待審核時，以建立時間排序（新到舊）
    if (filterStatus === 'pending') {
      list.sort((a, b) => {
        const da = new Date(getCreatedAt(a) || 0).getTime();
        const db = new Date(getCreatedAt(b) || 0).getTime();
        return da - db; // 舊到新
      });
    }
    return list;
  }, [users, search, filterRole, filterStatus]);

  // 統計資訊（總數、狀態、角色）
  const stats = useMemo(() => {
    const total = users.length;
    const byStatus = users.reduce((acc, u) => {
      const s = u.status || 'active';
      acc[s] = (acc[s] || 0) + 1;
      return acc;
    }, {});
    const byRole = users.reduce((acc, u) => {
      const r = u.role || 'user';
      acc[r] = (acc[r] || 0) + 1;
      return acc;
    }, {});
    return { total, byStatus, byRole };
  }, [users]);

  return (
    <div className="all-users-page">
      <div style={{display:'flex', alignItems:'baseline', justifyContent:'space-between'}}>
        <h2>使用者管理</h2>
        <small style={{opacity:0.7}}>
          資料更新於：{lastRefreshedAt ? lastRefreshedAt.toLocaleString() : '-'}
        </small>
      </div>

      {/* 統計區 */}
      <div className="stats-bar" style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(140px, 1fr))', gap:'12px', margin:'8px 0 16px'}}>
        <div className="stat-card"><b>總數(商家、消費、管理者)</b><div>{stats.total}</div></div>
        <div className="stat-card"><b>Active</b><div>{stats.byStatus.active || 0}</div></div>
        <div className="stat-card"><b>Pending</b><div>{stats.byStatus.pending || 0}</div></div>
        <div className="stat-card"><b>Disabled</b><div>{stats.byStatus.disabled || 0}</div></div>
        <div className="stat-card"><b>Admin</b><div>{stats.byRole.admin || 0}</div></div>
        <div className="stat-card"><b>Shop</b><div>{stats.byRole.shop || 0}</div></div>
        <div className="stat-card"><b>User</b><div>{stats.byRole.user || 0}</div></div>
      </div>

      <p className="subtitle">可審核、停權、恢復帳號</p>
      <p className="subtitle">(狀態)一覽: Pending → 待審核， Disabled → 停權， active → 正常</p>
      <p className="subtitle">(操作)一覽: 審核通過 → 商家可登入上架， 停權 → 帳號鎖住， 恢復帳號 → 帳號正常</p>

      <div className="controls">
        <input
          type="text"
          placeholder="搜尋帳號"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          value={filterRole}
          onChange={(e) => setFilterRole(e.target.value)}
        >
          <option value="all">全部角色</option>
          <option value="user">一般會員</option>
          <option value="shop">商家</option>
          <option value="admin">管理員</option>
        </select>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">全部狀態</option>
          <option value="active">已啟用</option>
          <option value="pending">待審核</option>
          <option value="disabled">已停權</option>
        </select>
        <button onClick={fetchUsers}>重新整理</button>
      </div>

      <table className="users-table">
        <thead>
          <tr>
            <th>帳號</th>
            <th>Email</th>
            <th>角色</th>
            <th>店名</th>
            <th>地址</th>
            <th>狀態</th>
            <th>建立時間</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.map(u => (
            <tr key={u.account} className={u.status === 'disabled' ? 'disabled-row' : 'enabled-row'}>
              <td>{u.account}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.storeName || '-'}</td>
              <td>{u.storeAddress || '-'}</td>
              <td className={`status-text ${u.status || 'active'}`}>{u.status || 'active'}</td>
              <td>{formatDateTime(getCreatedAt(u))}</td> {/* 顯示時間 */}
              <td>
                {u.status === 'pending' ? (
                  <button className="btn-approve" onClick={() => handleApprove(u.account)}>審核通過</button>
                ) : u.role !== 'admin' ? (
                  u.status === 'disabled' ? (
                    <button className="btn-restore" onClick={() => handleRestore(u.account)}>恢復帳號</button>
                  ) : (
                    <button className="btn-disable" onClick={() => handleDelete(u.account)}>停權</button>
                  )
                ) : (
                  <span style={{ color: '#aaa' }}>管理者不可停權</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
    </div>
  );
}

export default AllUsersPage;
