// ogani: shop-grid.html - Product Section　
// src/components/shop/Product.js
import ProductDiscount from './ProductDiscount';

const Product = () => {
  return (
    <section className="product spad">
      <div className="container">
        <div className="row">
          {/* 左側 Sidebar */}
          <div className="col-lg-3 col-md-5">
            <div className="sidebar">
              <div className="sidebar__item">
                <h4>會員中心</h4>
                <ul>
                  <li><a href="/register">會員資訊</a></li>
                  <li><a href="/orderpage">訂餐專區</a></li>
                  <li><a href="/test">優惠專區</a></li>
                  <li><a href="/test">評價與收藏</a></li>
                  <li><a href="/test">客戶服務</a></li>
                  <li><a href="/test">聯絡我們</a></li>
                  <li><a href="/login">登入/登出</a></li>                
                </ul>
              </div>
            </div>
          </div>

          {/* 優惠商品區 */}
          <div className="col-lg-9 col-md-7">
            <ProductDiscount />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Product;