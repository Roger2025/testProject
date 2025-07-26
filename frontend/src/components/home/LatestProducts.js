import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import lp1 from '../../assets/images/latest-product/lp-1.jpg';
import lp2 from '../../assets/images/latest-product/lp-2.jpg';
import lp3 from '../../assets/images/latest-product/lp-3.jpg';

// 每個區塊的資料
const sections = [
  { title: 'Latest Products' },
  { title: 'Top Rated Products' },
  { title: 'Review Products' },
];

const productSets = [
  [
    { title: 'Crab Pool Security', price: 30, img: lp1 },
    { title: 'Crab Pool Security', price: 30, img: lp2 },
    { title: 'Crab Pool Security', price: 30, img: lp3 },
  ],
  [
    { title: 'Crab Pool Security', price: 30, img: lp1 },
    { title: 'Crab Pool Security', price: 30, img: lp2 },
    { title: 'Crab Pool Security', price: 30, img: lp3 },
  ],
];

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 1, // 每次只顯示一組
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false,
};

const LatestProducts = () => {
  return (
    <section className="latest-product spad">
      <div className="container">
        <div className="row">
          {sections.map((section, idx) => (
            <div className="col-lg-4 col-md-6" key={idx}>
              <div className="latest-product__text">
                <h4>{section.title}</h4>
                <Slider {...sliderSettings}>
                {/* <div className="latest-product__slider owl-carousel"> */}
                  {productSets.map((set, idx2) => (
                    <div className="latest-prdouct__slider__item" key={idx2}>
                      {set.map((item, i) => (
                        <a href="#" className="latest-product__item" key={i}>
                          <div className="latest-product__item__pic">
                            <img src={item.img} alt={item.title} />
                          </div>
                          <div className="latest-product__item__text">
                            <h6>{item.title}</h6>
                            <span>${item.price.toFixed(2)}</span>
                          </div>
                        </a>
                      ))}
                    </div>
                  ))}
                {/* </div> */}
                </Slider>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LatestProducts;