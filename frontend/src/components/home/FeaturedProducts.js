import React from 'react';

// 商品清單
const products = [
  { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-1.jpg'), categories: ['hamburger', 'toast'] },
  { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-2.jpg'), categories: ['omelette', 'drinks'] },
  { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-3.jpg'), categories: ['omelette', 'toast'] },
  { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-4.jpg'), categories: ['toast', 'hamburger'] },
  { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-5.jpg'), categories: ['toast', 'omelette'] },
  { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-6.jpg'), categories: ['hamburger', 'drinks'] },
  { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-7.jpg'), categories: ['toast', 'omelette'] },
  { title: 'Crab Pool Security', price: 30, img: require('../../assets/images/featured/feature-8.jpg'), categories: ['drinks', 'omelette'] },
];

const FeaturedProducts = () => {
  return (
    <section className="featured spad">
      <div className="container">

        <div className="row">
          <div className="col-lg-12">
            <div className="section-title">
              <h2>Featured Product</h2>
            </div>
            <div className="featured__controls">
              <ul>
                <li className="active">所有菜單</li>
                <li>漢堡</li>
                <li>吐司</li>
                <li>蛋餅</li>
                <li>鬆餅</li>
                <li>麵食</li>
                <li>套餐</li>
                <li>麵食</li>
                <li>飲品</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="row featured__filter">
          {products.map((p, index) => (
            <div className="col-lg-3 col-md-4 col-sm-6" key={index}>
              <div className="featured__item">
                <div
                  className="featured__item__pic"
                  style={{
                    backgroundImage: `url(${p.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <ul className="featured__item__pic__hover">
                    <li><a href="#"><i className="fa fa-heart"></i></a></li>
                    <li><a href="#"><i className="fa fa-retweet"></i></a></li>
                    <li><a href="#"><i className="fa fa-shopping-cart"></i></a></li>
                  </ul>
                </div>
                <div className="featured__item__text">
                  <h6><a href="#">{p.title}</a></h6>
                  <h5>${p.price.toFixed(2)}</h5>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedProducts;