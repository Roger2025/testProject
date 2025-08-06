// src/components/home/PopularShop.js (熱門早餐店的自動瀏覽)

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import PopularShopSlider from './PopularShopSlider';

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

const sliderSettings = {
  dots: false,
  infinite: true,
  speed: 500,
  slidesToShow: 4, // 每次顯示 4 組
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 2000, // 自動播放間隔
  arrows: false, // 由 CarouselNav 控制 // 自訂箭頭不使用 slick 內建的
};

const PopularShop = () => {
  const sliderRef = useRef(null); // TODO: 控制滑動方向
  const [products, setProducts] = useState([]);

  // 取得資料並更新 products
  useEffect(() => {
    axios.get('http://localhost:3001/api/shops/')
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

      // 🔍 篩選出包含 'Popular' 的店家
      const popularOnly = formatted.filter(shop =>
        Array.isArray(shop.category) && shop.category.includes('Popular')
      );

        setProducts(popularOnly);
      })
      .catch(err => {
        console.error('載入店家資料失敗:', err);
      });
  }, []);

  // 等 products 更新後執行 slickNext()
  useEffect(() => {
    if (sliderRef.current && products.length > 0) {
      sliderRef.current.slickNext();
    }
  }, [products]);

  return (
    <section className="categories">
      <div className="container">
          <PopularShopSlider shops={products} sliderSettings={sliderSettings} />
      </div>
    </section>
  );
};

export default PopularShop;