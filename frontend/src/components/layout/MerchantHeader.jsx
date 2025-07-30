// src/components/layout/Header.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap 標準樣式
import '../../assets/ogani/css/style.css';          // Ogani 自定義樣式主檔
import '../../assets/ogani/css/font-awesome.min.css'; // 如需圖示支援
import logo from '../../assets/ogani/img/logo.png'; // 替換為實際 logo 圖片位置

const Header = () => {
  return (
    <header className="header bg-white shadow-sm">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-3">
          {/* Logo 區域 */}
          <Link to="/" className="navbar-brand">
            <img src={logo} alt="Ogani Logo" style={{ height: '40px' }} />
          </Link>

          {/* 導航列 */}
          <nav className="d-none d-lg-block">
            <ul className="nav">
              <li className="nav-item">
                <Link className="nav-link active" as={Link} to="/merchant/dashboard">介面板</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/merchant/menu">菜單管理</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/merchant/orders">訂單紀錄</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/merchant/store-status">營業狀態</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/merchant/admin">店家資料</Link>
              </li>
            </ul>
          </nav>

          {/* 登入按鈕 */}
          <div>
            <Link as={Link} to="/login" className="btn btn-outline-success">
              登入 / 註冊
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;