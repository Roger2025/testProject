// ogani: shop-grid.html - Breadcrumb Section 
// src/components/home/Wallpaper.js (已登入-平台壁紙)

import { Link } from 'react-router-dom';

// import imageUrl from '../../assets/images/wallpaper.jpg'; // React 端 

// 透過後端 Node.js /public/images/ 下載圖片
// 必須先打開 Node.js 伺服器 localhost:3001/images/merchant1
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/${modulePath}`;
};
const imageUrl = getImageURL('wallpaper.jpg');

const Wallpaper = () => {
  return (
    <section
      className="breadcrumb-section set-bg"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="breakfast__text">
              <h2>Byte Eat 早餐店平台</h2>
              <div className="breadcrumb__option">
                <Link to="/">首頁</Link>
                <span>Btye Eat</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Wallpaper;