import React from 'react';
import JpImg from '../utils/JumpImg'
import '../styles/usercss/style.css'
import {Link} from 'react-router-dom'


const Home = () => {
  return (
    <header className="header">
      <div className="header__top">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="header__top__left">
                <ul>
                  <li><i className="fa fa-envelope"></i>管理者信箱： hello@colorlib.com</li>
                </ul>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="header__top__right">
                <div className="header__top__right__social">
                  <a href="http://www.facebook.com.tw"><i className="fa fa-facebook"></i></a>
                  {/* <a href="#"><i className="fa fa-twitter"></i></a>
                  <a href="#"><i className="fa fa-linkedin"></i></a>
                  <a href="#"><i className="fa fa-pinterest-p"></i></a> */}
                </div>
                <div className="header__top__right__auth">
                  <a href="/login"><i className="fa fa-user"></i> Login</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="header__logo">
            <Link to="/"><JpImg /></Link>
            </div>
          </div>
          <div className="col-lg-6">
            <nav className="header__menu">
              <ul>
                <li className="active"><Link to='/'>首頁</Link></li>
                <li><Link to='/restaurant'>餐廳</Link></li>
                <li><Link to='/login'>登入/註冊</Link></li>
              </ul>
            </nav>
            
          </div>
          {/* <div className="col-lg-3">
            <div className="header__cart">
              <ul>
                <li><a href="#"><i className="fa fa-heart"></i> <span>100</span></a></li>
                <li><a href="#"><i className="fa fa-shopping-bag"></i> <span>3</span></a></li>
              </ul>
              <div className="header__cart__price">item: <span>$150.00</span></div>
            </div>
          </div> */}
        </div>
        <div className="humberger__open">
          <i className="fa fa-bars"></i>
        </div>
      </div>
      <section className="hero">
      <div className="container">
        <div className="row">

          {/* Categories Menu */}
          {/* <div className="col-lg-3">
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
              </ul>
            </div>
          </div> */}

          {/* Search & Banner */}
          <div className="col-lg-9">
            <div className="hero__search">
              <div className="hero__search__form">
                <form action="#">
                  <div className="hero__search__categories" >
                    餐廳快找
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
                {/* <div className="hero__search__phone__text">
                  <h5>+886 09xx-xxxxxx</h5>
                  <span>support 8hr/5 time</span>
                </div> */}
              </div>
            </div>

            {/* Hero Banner
            <div
              className="hero__item"
              style={{
                // backgroundImage: `url(${banner})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }}
            >              
              <div className="hero__text">
                <span>FRUIT FRESH</span>
                <h2>Vegetable <br />100% Organic</h2>
                <p>Free Pickup and Delivery Available</p>
                <a href="#" className="primary-btn">SHOP NOW</a> 
              </div> */}
              
            {/* </div> */}
          </div>
        </div>
      </div>
    </section>
    </header>
    
  );
};

export default Home;