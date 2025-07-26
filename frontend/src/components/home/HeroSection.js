import React from 'react';
import banner from '../../assets/images/hero/banner.jpg';
import languageIcon from '../../assets/images/language.png';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="container">
        <div className="row">

          {/* Categories Menu */}
          <div className="col-lg-3">
            <div className="hero__categories">
              <div className="hero__categories__all">
                <i className="fa fa-bars"></i>
                <span>All departments</span>
              </div>
              <ul>
                <li><a href="#">會員中心</a></li>
                <li><a href="#">訂餐專區</a></li>
                <li><a href="#">支付管理</a></li>
                <li><a href="#">優惠專區</a></li>
                <li><a href="#">評價與收藏</a></li>
                <li><a href="#">客戶服務</a></li>
                <li><a href="#">聯絡我們</a></li>
                {/* <li><a href="#">Fresh Onion</a></li>
                <li><a href="#">Papayaya & Crisps</a></li>
                <li><a href="#">Oatmeal</a></li>
                <li><a href="#">Fresh Bananas</a></li> */}
              </ul>
            </div>
          </div>

          {/* Search & Banner */}
          <div className="col-lg-9">
            <div className="hero__search">
              <div className="hero__search__form">
                <form action="#">
                  <div className="hero__search__categories">
                    All Categories
                    <span className="arrow_carrot-down"></span>
                  </div>
                  <input type="text" placeholder="What do you need?" />
                  <button type="submit" className="site-btn">SEARCH</button>
                </form>
              </div>
              <div className="hero__search__phone">
                <div className="hero__search__phone__icon">
                  <i className="fa fa-phone"></i>
                </div>
                <div className="hero__search__phone__text">
                  <h5>+886 2 8861 4338</h5>
                  <span>support 24/7 time</span>
                </div>
              </div>
            </div>

            {/* Hero Banner */}
            <div
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
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;