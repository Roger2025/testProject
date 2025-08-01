import React from 'react';
// import logo from '../../assets/images/logo.png';
// import languageIcon from '../../assets/images/language.png';
import '../../styles/css/style.css';
import JpImg from '../../components/JumpImg'
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="header">
      {/* <div className="header__top">
        <div className="container">
           <div className="row">
            <div className="col-lg-6 col-md-6">
              <div className="header__top__left">
                <ul>
                  <li><i className="fa fa-envelope"></i>管理者信箱： hello@lccnet.com.tw</li>
                  <li>Free Shipping for all Order of $99</li> 
                </ul>
              </div>
            </div>
            <div className="col-lg-6 col-md-6">
              <div className="header__top__right">
                <div className="header__top__right__social">
                  <a href="http://www.facebook.com.tw"><i className="fa fa-facebook"></i></a>
                  <a href="#"><i className="fa fa-twitter"></i></a>
                  <a href="#"><i className="fa fa-linkedin"></i></a>
                  <a href="#"><i className="fa fa-pinterest-p"></i></a>
                </div>
                <div className="header__top__right__language">
                  <img src={languageIcon} alt="language" />
                  <div>English</div>
                  <span className="arrow_carrot-down"></span>
                  <ul>
                    <li><a href="#">Spanis</a></li>
                    <li><a href="#">English</a></li>
                  </ul>
                </div>
                <div className="header__top__right__auth">
                  <a href="/login"><i className="fa fa-user"></i> Login</a>
                </div>
              </div>
            </div> 
          </div> 
        </div> 
      </div> */}

      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="header__logo">
              <a href="./index.html">
                {/* <img src={logo} alt="logo" /> */}
                <JpImg />
              </a>
            </div>
          </div>
          <div className="col-lg-6">
            <nav className="header__menu">
              <ul>
                <li className="active"><Link to="/">首頁</Link></li>
                <li><Link to="/shop">選定店家</Link></li>
                <li><Link to="/shopcart">線上訂餐</Link></li>
                <li><Link to="/orderpage">預約取餐</Link></li>  
                <li><Link to="/login">登入/登出</Link></li> 
                {/* <li><Link to="/register">註冊</Link></li> */}
                {/* <li><Link to="/test">Test</Link></li> */}
                {/* <li><a href="#">Pages</a>
                  <ul className="header__menu__dropdown">
                    <li><a href="./shop-details.html">Shop Details</a></li>
                    <li><a href="./shoping-cart.html">Shoping Cart</a></li>
                    <li><a href="./checkout.html">Check Out</a></li>
                    <li><a href="./blog-details.html">Blog Details</a></li>
                  </ul>
                </li> */}
                {/* <li><a href="./blog.html">Blog</a></li>
                <li><a href="./contact.html">Contact</a></li> */}
              </ul>
            </nav>
          </div>
          <div className="col-lg-3">
            <div className="header__cart">
              <ul>
                {/* <li><a href="#"><i className="fa fa-heart"></i> <span>1</span></a></li> */}
                <li><Link to="#"><i className="fa fa-heart"></i> <span>1</span></Link></li>
                {/* <li><a href="#"><i className="fa fa-shopping-bag"></i> <span>3</span></a></li> */}
                <li><Link to="/shopcart"><i className="fa fa-shopping-bag"></i> <span>3</span></Link></li>
              </ul>
              {/* <div className="header__cart__price">item: <span>$150.00</span></div> */}
            </div>
          </div>
        </div>
        {/* <div className="humberger__open">
          <i className="fa fa-bars"></i>
        </div> */}
      </div>
    </header>
  );
};

export default Header;