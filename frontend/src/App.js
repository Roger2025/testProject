// src/App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
// import AppNavbar from './components/layout/Navbar';
import AppHeader from './components/layout/Header';
// import Home from './pages/Home'; 尚未製作,先註解
import Login from './pages/Login';
import './pages/App.css';
// import ApiTest from './components/ApiTest'; //前後端專案連線測試用,可先註解

function App() {
  return (
    <div className="App">
      <AppHeader/>
      <Routes>
        {/* <Route path="/" element={<Home />} /> */}
        <Route path="/login" element={<Login />} />
        {/* 未來可加入 ProtectedRoute 包裝 /dashboard 等 */}
      </Routes>
      {/* 前後端專案連線測試用,可先註解
      <div>
        <h1>我的前端應用</h1>
        <ApiTest />
      </div>  */}
     
    </div>
  );
}

export default App;
