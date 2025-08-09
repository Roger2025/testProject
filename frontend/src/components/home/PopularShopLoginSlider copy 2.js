// ogani: shop-grid.html - Pduct Section（第2-1～第2-2部分）
// src/components/home/PopularShopLoginSlider.js (已登入-單個滑動元件）

// 安裝 Swiper：npm install swiper
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/css/navigation';
import '../../styles/css/ProductDiscount.css'; // 放自訂樣式 可放 Ogani 原樣式

export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/${modulePath}`;
};

// 檢查並轉換字串型的陣列
const parseCategoryField = (rawCategory) => {
  try {
    if (Array.isArray(rawCategory)) {
      // 如果陣列第一個元素是字串且看起來像陣列
      const first = rawCategory[0];
      if (typeof first === 'string' && first.match(/\[\s*['"]/)) {
        // 移除多餘逗號並處理引號 → 嘗試解析
        const cleaned = first
          .replace(/,\s*\]/, ']')   // 尾端逗號清除
          .replace(/'/g, '"');      // 換成雙引號
        const parsed = JSON.parse(cleaned);
        return Array.isArray(parsed) ? parsed : [];
      }
      return rawCategory; // 已是合法陣列
    }

    if (typeof rawCategory === 'string' && rawCategory.startsWith('[')) {
      const cleaned = rawCategory
        .replace(/,\s*\]/, ']')
        .replace(/'/g, '"');
      const parsed = JSON.parse(cleaned);
      return Array.isArray(parsed) ? parsed : [];
    }

    return []; // 無法解析
  } catch (err) {
    console.warn('分類解析失敗:', rawCategory);
    return [];
  }
};

const PopularShopLoginSlider = () => {
  const [popularshops, setProducts] = useState([]);

  // 取得資料
  useEffect(() => {
    axios.get('http://localhost:3001/api/home/shop/')
      .then(res => {
        const formatted = res.data.map(item => {
          const parsedCategory = parseCategoryField(item.category);
          console.log(`${item.storeName} 👉`, parsedCategory); // ✅ 確認這裡是否為 ['Open', 'OnlinePay']
          
          return {
            name: item.storeName,
            img: getImageURL(item.storeImag),
            url: `/shop/${item.merchantId}`,  // 如果原本 URL 是 `/store4` 這樣拼比較直覺
            category: parsedCategory,
            // category: parseCategoryField(item.category), // 修改後 正確格式 category: ['Open', 'OnlinePay']
            // category: item.category, // 錯誤格式 ategory: [ "['Open', 'OnlinePay']" ] 
          };
        });

      // 篩選出包含 'Popular' 的店家
      const popularOnly = formatted.filter(shop =>
        Array.isArray(shop.category) && shop.category.includes('Popular')
      );

        setProducts(popularOnly);
      })
      .catch(err => {
        console.error('載入店家資料失敗:', err);
      });
  }, []);

  return (
    <div className="product__discount">
      <div className="section-title product__discount__title">
        <h2>熱門早餐店</h2>
      </div>
      <div className="row">
        <div className="product__discount__slider">
          <Swiper 
          modules={[Navigation, Autoplay]}
          spaceBetween={10} 
          slidesPerView={3}
          autoplay={{ delay: 3000, disableOnInteraction: false }}
          navigation
          breakpoints={{
            640: {
              slidesPerView: 1,
            },
            768: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
          }}
          >
            {popularshops.map((item, index) => {
              const imageURL = item.img; // item.img = 'discount01.jpg'        
              return (
              <SwiperSlide key={index}>
                <div className="product__discount__item">
                  <div
                    className="product__discount__item__pic"
                    style={{
                      backgroundImage: `url(${imageURL})`, // 獲取特定圖片的 URL  
                      backgroundSize: 'cover',
                    }}
                  >
                  </div>
                  <div className="product__discount__item__text">
                    <h5><a href="#">{item.name}</a></h5>
                  </div>
                </div>
              </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default PopularShopLoginSlider;