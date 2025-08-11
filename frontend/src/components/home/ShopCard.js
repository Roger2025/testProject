// ogani: shop-grid.html - Product Section（第2-4～第2-15部分）單一商品卡片/動態渲染商品列表	
// src/components/home/ShopCard.js (店家卡)
import { Link } from 'react-router-dom';

const defaultImageURL = 'http://localhost:3001/images/ByteEat.png'; // 平台的 logo 路徑

const ShopCard = ({ data }) => {
  if (!data || !data.img) return null;

  const imageURL = data.img || defaultImageURL;
  
  return (
    <div className="product__item">
      <Link to={data.url} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div
        className="product__item__pic set-bg"
        style={{ backgroundImage: `url(${imageURL})` }}
        role="img"
        aria-label={data.name}
      >
        <ul className="product__item__pic__hover">
          <li><a href="#"><i className="fa fa-heart"></i></a></li>
          <li><a href="#"><i className="fa fa-retweet"></i></a></li>
          <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
        </ul>
      </div>
      <div className="product__item__text">
        <h6>{data.name}</h6>
      </div>
      </Link>
    </div>
  );
};

export default ShopCard;