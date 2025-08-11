// import logo from './logo.svg';
import './App.css';

// import 'bootstrap/dist/css/bootstrap.min.css';
// import 'font-awesome/css/font-awesome.min.css';

// src/App.js
import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Routes, Route, Navigate } from 'react-router-dom';

import HomeRoutes from './routes/HomeRoutes';
// import StorePage from './pages/StorePage'; // 測試 merchantId 回傳到後端 Node.js

function App() {
  return (
    <div className='App'>

        <Routes>
          {/* 其他頁面由 HomeRoutes 處理 */}
          <Route path="/*" element={<HomeRoutes />} />

          {/* 最後兜底：未知路徑導回首頁 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

    </div>
  );
}

export default App;
