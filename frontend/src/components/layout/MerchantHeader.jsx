// src/components/layout/MerchantHeader.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
// import { useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../assets/ogani/css/style.css';
import '../../assets/ogani/css/font-awesome.min.css';
import logo from '../../assets/ogani/img/logo.png';
// 假設你有登出的 action，如果沒有請先建立
// import { logout } from '../../features/merchant/auth/merchantAuthSlice';

const MerchantHeader = () => {
  const navigate = useNavigate();
  // const dispatch = useDispatch();

  // 處理登出功能
  const handleLogout = () => {
    try {
      // 清除 Redux 中的驗證狀態
      // dispatch(logout());
      
      // 清除 localStorage 中的 token 或相關資料
      localStorage.removeItem('merchantToken');
      localStorage.removeItem('merchantId');
      localStorage.removeItem('merchantInfo');
      
      // 導航回網站首頁
      navigate('/', { replace: true });
    } catch (error) {
      console.error('登出過程中發生錯誤:', error);
    }
  };

  // 處理導航
  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <header className="header bg-white shadow-sm">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center py-3">
          {/* Logo 區域 - 點擊回到首頁 */}
          <div 
            className="navbar-brand" 
            style={{ cursor: 'pointer' }}
            onClick={() => handleNavigation('/')}
          >
            <img src={logo} alt="Ogani Logo" style={{ height: '40px' }} />
          </div>

          {/* 導航列 */}
          <nav className="d-none d-lg-block">
            <ul className="nav">
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link active" 
                  onClick={() => handleNavigation('/merchant/dashboard')}
                >
                  儀表板
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => handleNavigation('/merchant/menu')}
                >
                  菜單管理
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => handleNavigation('/merchant/orders')}
                >
                  訂單紀錄
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => handleNavigation('/merchant/storestatus')}
                >
                  營業狀態
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => handleNavigation('/merchant/profile')}
                >
                  店家資料
                </button>
              </li>
            </ul>
          </nav>

          {/* 登出按鈕 */}
          <div>
            <button 
              className="btn btn-outline-danger"
              onClick={handleLogout}
            >
              登出
            </button>
          </div>
        </div>
      </div>

      {/* 手機版導航選單 */}
      <div className="d-lg-none">
        <div className="container">
          <nav className="nav flex-column py-2">
            <button 
              className="nav-link btn btn-link text-start" 
              onClick={() => handleNavigation('/merchant/dashboard')}
            >
              儀表板
            </button>
            <button 
              className="nav-link btn btn-link text-start" 
              onClick={() => handleNavigation('/merchant/menu')}
            >
              菜單管理
            </button>
            <button 
              className="nav-link btn btn-link text-start" 
              onClick={() => handleNavigation('/merchant/orders')}
            >
              訂單紀錄
            </button>
            <button 
              className="nav-link btn btn-link text-start" 
              onClick={() => handleNavigation('/merchant/storestatus')}
            >
              營業狀態
            </button>
            <button 
              className="nav-link btn btn-link text-start" 
              onClick={() => handleNavigation('/merchant/profile')}
            >
              店家資料
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default MerchantHeader;