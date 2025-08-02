import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/admin_styles/PendingUsersPage.css'; // 引入樣式

const PendingUsersPage = () => {
  const [pendingShops, setPendingShops] = useState([]);

  const fetchPendingShops = async () => {
    try {
      
      const res = await axios.get('http://localhost:5000/api/admin/pending-users', {
        withCredentials: true
      });
      setPendingShops(res.data.pendingShops);
    } catch (err) {
      console.error('❌ 取得待審核用戶失敗:', err);
    }
  };

  const handleApprove = async (account) => {
    try {
      //  改為完整後端路徑 + withCredentials
      const res = await axios.patch(`http://localhost:5000/api/admin/approve-user/${account}`, null, { // 發出修改角色請求
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

  return (
    <div className="pending-users-page">
      <h2 className="title">待審核商家列表</h2>
      {pendingShops.length === 0 ? (
        <p className="no-users">目前沒有待審核的帳號</p>
      ) : (
        <table className="pending-table">
          <thead>
            <tr>
              <th>帳號</th>
              <th>店家名稱</th>
              <th>店家地址</th>
              <th>狀態</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>
            {pendingShops.map((p) => (
              //你加上 key={p.account} 是告訴 React：這一列的資料代表帳號為 shop123 的用戶，下次重新渲染時請記得他
              <tr key={p.account}>
                <td>{p.account}</td>
                <td>{p.storename}</td>
                <td>{p.address}</td>
                <td className="pending-role">{p.status}</td>
                <td>
                    <button onClick={() => {
                        const confirmApprove = window.confirm(`確定要通過帳號 ${p.account} 的審核嗎？`); // 彈出對話框
                        if (confirmApprove) {
                        handleApprove(p.account);
                        }
                        }}>
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
