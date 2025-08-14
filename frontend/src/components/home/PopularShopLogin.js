// ogani: shop-grid.html - Product Section　
// src/components/home/PopularShopLogin.js (已登入-熱門早餐店的自動瀏覽)
import PopularShopLoginSlider from './PopularShopLoginSlider';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const PopularShopLogin = () => {
  const { merchantId } = useParams();
  const currentMerchantId = merchantId || 'store5'; // 預設為 store5
    
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
                  {/* <li><Link to="/auth/register">會員資訊</Link></li> */}
                  <li><Link to={`/user/shop/${currentMerchantId}`}>訂餐專區</Link></li>
                  <li><Link to={'/user/shop/history-orders'}>歷史訂單</Link></li>
                  {/* <li><a href="/test">優惠專區</a></li> */}
                  {/* <li><a href="/test">評價與收藏</a></li> */}
                  {/* <li><a href="/test">客戶服務</a></li> */}
                  {/* <li><a href="/test">聯絡我們</a></li> */}
                  {/* <li><Link to="/auth/login">登入/登出</Link></li>                 */}
                </ul>
              </div>
            </div>
          </div>

          {/* 商品區 */}
          <div className="col-lg-9 col-md-7">
            <PopularShopLoginSlider />
          </div>
        </div>
      </div>
    </section>
  );
};

export default PopularShopLogin;