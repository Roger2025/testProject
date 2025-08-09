// src/commponents/layout/HeaderShop.js (店家開頭)

import { useParams } from 'react-router-dom';
import JpImg from '../../components/common/JumpImg';
import { Link } from 'react-router-dom';

const HeaderShop = () => {
  const { merchantId } = useParams();
  const currentMerchantId = merchantId || 'store1'; // 預設為 store1

  return (
    <header className="header">
      <div className="container">
        <div className="row">
          <div className="col-lg-3">
            <div className="header__logo">
              <a href="/shop">
                <JpImg />
              </a>
            </div>
          </div>
          <div className="col-lg-6">
            <nav className="header__menu">
              <ul>
                <li className="active"><Link to="/">平台首頁</Link></li>
                <li><Link to={`/shop/${currentMerchantId}`}>當前店家</Link></li>
                <li><Link to="/shopcart">購物車</Link></li>          
                <li><Link to="/order">訂單專區</Link></li>
                <li><Link to="/login">登入/登出</Link></li>      
                {/* <li><Link to="/test">Test</Link></li> */}
                {/* <li><Link to="#">TestPages</Link>
                  <ul className="header__menu__dropdown">
                    <li><Link to="/shop">選定店家</Link></li>
                    <li><Link to="/shopcart">購物車</Link></li>
                    <li><Link to="/orderpage">訂單專區</Link></li>
                    <li><Link to="/location">MyLocation</Link></li>
                  </ul>
                </li> */}
              </ul>
            </nav>
          </div>
          {/* <div className="col-lg-3">
            <div className="header__cart">
              <ul>
                <li><Link to="#"><i className="fa fa-heart"></i> <span>1</span></Link></li>
                <li><Link to="/shopcart"><i className="fa fa-shopping-bag"></i> <span>3</span></Link></li>
              </ul>
            </div>
          </div> */}
        </div>
      </div>
    </header>
  );
};

export default HeaderShop;