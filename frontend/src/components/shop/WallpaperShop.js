// ogani: shop-grid.html - Breadcrumb Section 
// src/components/shop/WallpaperShop.js
import { Link } from 'react-router-dom';

// React 端 
// import imageUrl from '../../assets/images/breadcrumb.jpg'; 

// 透過後端 Node.js /public/images/ 下載圖片
// 必須先打開 Node.js 伺服器 localhost:3001/images/merchant1
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/${modulePath}`;
};
const imageUrl = getImageURL('breadcrumb.jpg');

const WallpaperShop = () => {
  return (
    <section
      className="breadcrumb-section set-bg"
      style={{ backgroundImage: `url(${imageUrl})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="breadcrumb__text">
              <h2>Byte Eat 當前店家</h2>
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

export default WallpaperShop;