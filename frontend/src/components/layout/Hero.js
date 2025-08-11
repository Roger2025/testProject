// src/components/home/Hero.js (Menu + 搜尋列)

import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ onSearch }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
 
  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = searchTerm.trim().toLowerCase();
    if (keyword) {
      onSearch(keyword); // 將搜尋關鍵字傳給父層
    }
  };

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
                <li><Link to="/user/register">會員資訊</Link></li>
                <li><Link to="/suer/order">訂餐專區</Link></li>
                {/* <li><a href="/test">優惠專區</a></li> */}
                {/* <li><a href="/test">評價與收藏</a></li> */}
                {/* <li><a href="/test">客戶服務</a></li> */}
                {/* <li><a href="/test">聯絡我們</a></li> */}
                <li><Link to="/user/login">登入/登出</Link></li>                
              </ul>
            </div>
          </div>

          {/* Search & Banner = 商品區 */}
          <div className="col-lg-9">
            <div className="hero__search">
              {/* 左邊:搜尋列 */}
              <div className="hero__search__form">
                <form onSubmit={handleSearch}>
                  <div className="hero__search__categories">
                    所有店家
                    <span className="arrow_carrot-down"></span>
                  </div>
                  <input
                    type="text"
                    placeholder="你需要什麼？"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
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