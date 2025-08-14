import React from 'react';
import { useParams } from 'react-router-dom';
import JpImg from '../../utils/JumpImg'
import '../../styles/usercss/style.css'
import {Link,Outlet} from 'react-router-dom'


const Header = () => {
  const { merchantId } = useParams();
  const currentMerchantId = merchantId || 'store5'; // 預設為 store5

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
                    <a href="https://x.com/"><i className="fa fa-twitter"></i></a>
                  {/*<a href="#"><i className="fa fa-linkedin"></i></a>
                  <a href="#"><i className="fa fa-pinterest-p"></i></a> */}
                </div>
                <div className="header__top__right__auth">
                  <Link to="/login"><i className="fa fa-user"></i> Login</Link>
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
                <li className="active"><Link to='/user'>首頁</Link></li>
                <li><Link to={`/user/shop/${currentMerchantId}`}>店家</Link></li>
                <li><Link to='/auth/login'>登入/註冊</Link></li>
                <li><Link to='/'>登出</Link></li>
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
          <div className="col-lg-3">
            <div className="hero__categories">
              <div className="hero__categories__all">
                <i className="fa fa-bars"></i>
                <span>會員中心</span>
              </div>
              <ul>
                {/* <li><a href="#">會員中心</a></li> */}
                <li><Link to={`/user/shop/${currentMerchantId}`}>訂餐專區</Link></li>
                <li><Link to={'history-orders'}>歷史訂單</Link></li>
                {/* <li><a href="#">優惠專區</a></li> */}
                {/* <li><a href="#">評價與收藏</a></li> */}
                {/* <li><a href="#">客戶服務</a></li> */}
                {/* <li><a href="#">聯絡我們</a></li> */}
                {/* <li><Link to="/auth/login">登入/登出</Link></li>  */}
              </ul>
            </div>
          </div>

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
              {/* <div className="hero__search__phone">
                <div className="hero__search__phone__icon">
                  <i className="fa fa-phone"></i>
                </div>
                <div className="hero__search__phone__text">
                  <h5>+886 09xx-xxxxxx</h5>
                  <span>support 8hr/5 time</span>
                </div>
              </div> */}
              
            </div>
            <div className="hero__content">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </section>
    </header>
    
  );
};

export default Header;