// src/pages/DebugPage.jsx
import React, { useState } from 'react';
import axios from 'axios';

function DebugPage() {
  const [result, setResult] = useState('');

  const handleTest = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/debug/test-role-check', {
        withCredentials: true
      });
      setResult(res.data.message);
    } catch (err) {
      setResult(err.response?.data?.message || '❌ 發生錯誤');
    }
  };

  const handleWhoami = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/debug/whoami', {
        withCredentials: true
      });
      setResult(JSON.stringify(res.data, null, 2));
    } catch (err) {
      setResult(err.response?.data?.message || '❌ 無法取得登入資訊');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>🧪 Debug 測試頁面</h2>
      <button onClick={handleTest}>測試是否 admin 或 shop 可通過</button>
      <button onClick={handleWhoami} style={{ marginLeft: '10px' }}>查看目前登入身分</button>
      <pre style={{ marginTop: '20px', background: '#f0f0f0', padding: '10px' }}>{result}</pre>
    </div>
  );
}

export default DebugPage;
