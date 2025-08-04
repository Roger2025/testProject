// src/components/home/Hero.js
import React, { useState } from 'react';

const Hero = () => {
  const [showMenu, setShowMenu] = useState(false);
 
  return (
    // src/styles/css/style.css
    // .hero {position: relative;} 會影響區塊；
    // .hero.hero-normal {position: absolute;} 不會影響區塊; 
    <section className="hero hero-normal"> 
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
               <ul style={{ display: showMenu ? 'block' : 'none' }}> {/* 根據狀態顯示或隱藏 Menu */}
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
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Hero;