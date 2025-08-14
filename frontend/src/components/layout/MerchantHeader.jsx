import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import 'bootstrap/dist/css/bootstrap.min.css';
// import '../../styles/style.css';
// import '../../styles/font-awesome.min.css';
import logo from '../../assets/ogani/img/logo.png';
// 假設你有登出的 action，如果沒有請先建立
import { logout } from '../../features/merchant/auth/merchantAuthSlice';
import axios from 'axios'; 

const MerchantHeader = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 處理登出功能
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:3001/api/auth/logout', {}, { withCredentials: true });
    } catch (e) { /* 即使失敗也走清理 */ }
    dispatch(logout());                 // ⬅️ 清 Redux
    localStorage.removeItem('merchantToken');
    localStorage.removeItem('merchantId');
    localStorage.removeItem('merchantInfo');
    navigate('/auth/login', { replace: true });
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
                  onClick={() => handleNavigation('/merchant/order')}
                >
                  訂單紀錄
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => handleNavigation('/merchant/storestatus')}
                >
                  營業排程
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className="nav-link btn btn-link" 
                  onClick={() => handleNavigation('/merchant/profile')}
                >
                  基本資料
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
              onClick={() => handleNavigation('/merchant/order')}
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
