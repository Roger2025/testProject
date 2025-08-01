// 📁 pages/AllUsersPage.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin_styles/AllUsersPage.css';

function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/admin/all-users', {
        withCredentials: true
      });
      setUsers(res.data.users);
    } catch (err) {
      console.error('❌ 取得使用者失敗:', err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDelete = async (account) => {
    if (!window.confirm(`確定要停權帳號 ${account} 嗎？`)) return;
    try {
      await axios.delete(`http://localhost:5000/api/admin/delete-user/${account}`, {
        withCredentials: true
      });
      fetchUsers();
    } catch (err) {
      console.error('❌ 停權失敗:', err);
      alert('❌ 無法停權使用者');
    }
  };

  const handleRestore = async (account) => {
    if (!window.confirm(`確定要恢復帳號 ${account} 嗎？`)) return;
    try {
      await axios.patch(`http://localhost:5000/api/admin/restore-user/${account}`, {}, {
        withCredentials: true
      });
      fetchUsers();
    } catch (err) {
      console.error('❌ 恢復失敗:', err);
      alert('❌ 無法恢復帳號');
    }
  };

  // ✅ 新增：審核通過 pending 帳號
  const handleApprove = async (account) => {
    if (!window.confirm(`確定要審核通過帳號 ${account} 嗎？`)) return;
    try {
      await axios.patch(`http://localhost:5000/api/admin/approve-user/${account}`, {}, {
        withCredentials: true
      });
      fetchUsers();
    } catch (err) {
      console.error('❌ 審核失敗:', err);
      alert('❌ 無法審核帳號');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.account.includes(search);
    const matchesRole = filterRole === 'all' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="all-users-page">
      <h2>使用者總覽</h2>

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
          <option value="pending">待審核</option>
          <option value="admin">管理員</option>
        </select>
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
              <td>
                {/* ✅ 根據狀態與角色顯示對應按鈕 */}
                {u.role === 'pending' ? (
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
