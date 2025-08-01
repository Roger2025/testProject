// ogani : shop-grid.html : Product Section　
// ShopSection.js is modified from ProductSection.js
// Path = components/shop/
import React from 'react';
import ProductSidebar from './ProductSidebar';
// import ProductDiscount from './ProductDiscount';
import FavoriteShop from './FavoriteShop';

const ShopSection = () => {
  return (
    <section className="product spad">
      <div className="container">
        <div className="row">
          {/* 左側 Sidebar */}
          <div className="col-lg-3 col-md-5">
            <ProductSidebar />
          </div>

          {/* 商品區 */}
          <div className="col-lg-9 col-md-7">
            {/* <ProductDiscount /> */}
            <FavoriteShop />
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShopSection;