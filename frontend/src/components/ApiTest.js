import React, { useEffect, useState } from 'react';

const ApiTest = () => {
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:3001';

    fetch(`${apiUrl}/api/test`)
      .then(res => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then(data => {
        setMessage(data.message || JSON.stringify(data));
      })
      .catch(err => {
        console.error('API 錯誤:', err);
        setMessage(`API 錯誤：${err.message}`);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '1rem', border: '1px solid gray', margin: '1rem' }}>
      <h2>API 測試結果</h2>
      {loading ? <p>載入中...</p> : <pre>{message}</pre>}
    </div>
  );
};

export default ApiTest;