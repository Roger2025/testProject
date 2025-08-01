// ogani : shop-grid.html : Breadcrumb Section 
// BreadcrumbSection.js
// Path = components/shop/ 
import React from 'react';
import { Link } from 'react-router-dom';
// import breadcrumbImage from '../../assets/images/breadcrumb.jpg'; // React 端 

// 透過後端 Node.js /public/images/ 下載圖片
// 必須先打開 Node.js 伺服器 localhost:3001/images/merchant1
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/${modulePath}`;
};

const imageUrl = getImageURL('breakfast01.jpg');

const ByteEatLogo = () => {
  return (
    <section
      className="breadcrumb-section set-bg"
      // style={{ backgroundImage: `url(${breadcrumbImage})` }} // React
      style={{ backgroundImage: `url(${imageUrl})` }}  // Node.js
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="breakfast__text">
              <h2>Byte Eat 早餐店平台</h2> {/* 標題 可變 = Vegetable’s Package */}
              <div className="breadcrumb__option">
                <Link to="/">首頁</Link>
                {/* <Link to="/">Vegetables</Link> */} {/* 差異在 shop-grid.html 沒有此一列 */}
                <span>Btye Eat</span> {/* 標題 可變 = Vegetable’s Package */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ByteEatLogo;