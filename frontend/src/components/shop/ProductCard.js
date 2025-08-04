// ogani: shop-grid.html - Pduct Section（第2-4～第2-15部分）單一商品卡片/動態渲染商品列表	
// src/components/shop/ProductCard.js
const ProductCard = ({ data }) => {
  if (!data || !data.img) return null;

  return (
    <div className="product__item">
      <div
        className="product__item__pic set-bg"
        style={{ backgroundImage: `url(${data.img})` }}
      >
        <ul className="product__item__pic__hover">
          <li><a href="#"><i className="fa fa-heart"></i></a></li>
          <li><a href="#"><i className="fa fa-retweet"></i></a></li>
          <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
        </ul>
      </div>
      <div className="product__item__text">
        <h6><a href="#">{data.name}</a></h6>
        <h5>${data.price.toFixed(2)}</h5>
      </div>
    </div>
  );
};

export default ProductCard;