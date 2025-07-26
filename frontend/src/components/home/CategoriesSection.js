import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

// 類別資料清單，可從 API 或 props 傳入
const categories = [
  { title: '早餐店1', img: require('../../assets/images/categories/cat-1.jpg') },
  { title: '早餐店2', img: require('../../assets/images/categories/cat-2.jpg') },
  { title: '早餐店3', img: require('../../assets/images/categories/cat-3.jpg') },
  { title: '早餐店4', img: require('../../assets/images/categories/cat-4.jpg') },
  { title: '早餐店5', img: require('../../assets/images/categories/cat-5.jpg') },
  { title: '早餐店6', img: require('../../assets/images/categories/cat-1.jpg') },
  { title: '早餐店7', img: require('../../assets/images/categories/cat-2.jpg') },
  { title: '早餐店8', img: require('../../assets/images/categories/cat-3.jpg') },
  { title: '早餐店9', img: require('../../assets/images/categories/cat-4.jpg') },
  { title: '早餐店10', img: require('../../assets/images/categories/cat-5.jpg') },  
];

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4, // 每次顯示 4 組
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000,
  arrows: false,
};

const CategoriesSection = () => {
  return (
    <section className="categories">
      <div className="container">
        <Slider {...sliderSettings}>
        {/* <div className="row"> */}
          {/* <div className="categories__slider owl-carousel"> */}
            {categories.map((cat, index) => (
              <div key={index}> {/* className="col-lg-3" */}
                <div
                  className="categories__item"
                  style={{
                    backgroundImage: `url(${cat.img})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                  }}
                >
                  <h5><a href="#">{cat.title}</a></h5>
                </div>
              </div>
            ))}
          
          {/* </div> */}
        {/* </div> */}
        </Slider>    
      </div>
    </section>
  );
};

export default CategoriesSection;