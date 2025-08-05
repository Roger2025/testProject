import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin_styles/AllUsersPage.css';

function AllUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('active'); 

  // 更新畫面
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
      const res = await axios.delete(`http://localhost:5000/api/admin/delete-user/${account}`, {
        withCredentials: true
      });
      if (res.data.status === 'success') {
        alert(res.data.message);   // 成功提示
        fetchUsers();              // 更新畫面
      } else {
        alert('⚠️ ' + res.data.message); // 顯示後端錯誤原因
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
      const res = await axios.patch(`http://localhost:5000/api/admin/restore-user/${account}`, {}, {
        withCredentials: true
      });
      if (res.data.status === 'success') {
        alert(res.data.message);   // 成功提示
        fetchUsers();              // 重新整理資料
      } else {
        alert('⚠️ ' + res.data.message); // 顯示後端錯誤原因
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
      const res = await axios.patch(`http://localhost:5000/api/admin/approve-user/${account}`, {}, {
        withCredentials: true
      });
      if (res.data.status === 'success') {
        alert(res.data.message);    // 成功提示
        fetchUsers();               // 更新畫面
      } else {
        alert('⚠️ ' + res.data.message); // 顯示後端邏輯錯誤
      }

    } catch (err) {
      console.error('❌ 審核失敗:', err);
      alert('❌ 無法審核帳號');
    }
  };

  // role + status + search 多條件過濾
  const filteredUsers = users.filter(u => {
    const matchesSearch = (u.account || '').includes(search); // includes模糊比對
    const matchesRole = filterRole === 'all' || u.role === filterRole; // filterRole下拉式選單的腳色
    const matchesStatus = filterStatus === 'all' || u.status === filterStatus; // filterStatus下拉式選單狀態
    return matchesSearch && matchesRole && matchesStatus;
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
            <tr key={u.account} className={u.status === 'disabled' ? 'disabled-row' : 'enabled-row'}> {/* 控制停權恢復樣式*/}
              <td>{u.account}</td>  { /*帳號作為唯一識別值 讓React在重新渲染時可以有效比對DOM提高效能 */}
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>{u.storeName || '-'}</td>
              <td>{u.storeAddress || '-'}</td>
              <td className={`status-text ${u.status || 'active'}`}>{u.status || 'active'}</td>
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
