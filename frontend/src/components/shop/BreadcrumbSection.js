// ogani : shop-grid.html : Breadcrumb Section 
// BreadcrumbSection.js
// Path = components/shop/ 
import React from 'react';
import { Link } from 'react-router-dom';
import breadcrumbImage from '../../assets/images/breadcrumb.jpg'; // 根據實際路徑調整

const BreadcrumbSection = () => {
  return (
    <section
      className="breadcrumb-section set-bg"
      style={{ backgroundImage: `url(${breadcrumbImage})` }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12 text-center">
            <div className="breadcrumb__text">
              <h2>Byte Eat Shop</h2> {/* 標題 可變 = Vegetable’s Package */}
              <div className="breadcrumb__option">
                <Link to="/">Home</Link>
                {/* <Link to="/">Vegetables</Link> */} {/* 差異在 shop-grid.html 沒有此一列 */}
                <span>Shop</span> {/* 標題 可變 = Vegetable’s Package */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BreadcrumbSection;