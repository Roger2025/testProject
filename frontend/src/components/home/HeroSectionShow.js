// src/components/home/HeroSection.js
import React, { useState } from 'react';
// import banner from '../../assets/images/hero/banner.jpg';
// import CategoriesSection from './CategoriesSection';

const HeroSectionShow = () => {
  const [showMenu, setShowMenu] = useState(false);
 
  return (
    <section className="hero hero-normal"> {/* .hero {position: relative;} 會影響區塊；.hero-normal {position: absolute;} 不會影響區塊 */}
      <div className="container">
        <div className="row">

          {/* Categories Menu = 左側 Sidebar */}
          <div className="col-lg-3">
            <div className="hero__categories">
              <div className="hero__categories__all"
              onClick={() => setShowMenu(!showMenu)} // 切換 Menu 顯示狀態
              style={{ cursor: 'pointer' }}
              >
                <i className="fa fa-bars"></i>
                <span>會員中心</span>
              </div>
               {/*<ul style={{ display: showMenu ? 'block' : 'none' }}> {/* 根據狀態顯示或隱藏 Menu */}
               <ul style={{ display: 'none'}}> 
                <li><a href="/register">會員資訊</a></li>
                <li><a href="/orderpage">訂餐專區</a></li>
                <li><a href="/login">支付管理</a></li>
                <li><a href="/test">優惠專區</a></li>
                <li><a href="/test">評價與收藏</a></li>
                <li><a href="/test">客戶服務</a></li>
                <li><a href="/test">聯絡我們</a></li>
                {/* <li><a href="#">Fresh Onion</a></li>
                <li><a href="#">Papayaya & Crisps</a></li>
                <li><a href="#">Oatmeal</a></li>
                <li><a href="#">Fresh Bananas</a></li> */}
              </ul>
            </div>
          </div>

          {/* Search & Banner = 商品區 */}
          <div className="col-lg-9">
            <div className="hero__search">
              {/* 左邊:搜尋列 */}
              <div className="hero__search__form">
                <form action="#">
                  <div className="hero__search__categories">
                    所有店家
                    <span className="arrow_carrot-down"></span>
                  </div>
                  <input type="text" placeholder="你需要什麼？" />
                  <button type="submit" className="site-btn">搜尋</button>
                </form>
              </div>
              {/* 右邊:聯絡電話 */}
              {/* <div className="hero__search__phone">
                <div className="hero__search__phone__icon">
                  <i className="fa fa-phone"></i>
                </div>
                <div className="hero__search__phone__text">
                  <h5>+886 2 8861 4338</h5>
                  <span>support 24/7 time</span>
                </div>
              </div> */}
            </div>

            {/* Hero Banner */}
            {/* <div
              className="hero__item"
              style={{
                backgroundImage: `url(${banner})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >
              <div className="hero__text">
                <span>FRUIT FRESH</span>
                <h2>Vegetable <br />100% Organic</h2>
                <p>Free Pickup and Delivery Available</p>
                <a href="#" className="primary-btn">線上訂餐</a>
              </div>
            </div> */}
            {/* <div className="hero__item">   
              <CategoriesSection />
            </div> */}
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSectionShow;