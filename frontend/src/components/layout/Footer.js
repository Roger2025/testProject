import JpImg from '../../components/common/JumpImg';

// React 前端測試使用
// import imageURL from '../../assets/images/payment-item.png'; 

// 透過後端 Node.js /public/images/ 下載圖片
// 必須先打開 Node.js 伺服器 localhost:3001/images/merchant1
export const getImageURL = (modulePath) => {
  return `http://localhost:3001/images/${modulePath}`;
};
const imageURL = getImageURL('payment-item.png');

const Footer = () => {
  return (
    <footer className="footer spad">
      <div className="container">
        <div className="row">
          {/* <FooterAbout /> */}
          <div className="col-lg-3 col-md-6 col-sm-6">
            <div className="footer__about">
              <div className="footer__about__logo">
                <a href="/">
                  <JpImg />
                </a>
              </div>
              <ul>
                <li>
                  <span style={{ whiteSpace: "nowrap" }}>
                  地址: 111台北市士林區文林路338號4樓之1
                  </span>
                </li>
                <li>電話: +886 2 8861 4338</li>
                <li>網址: https://www.lccnet.com.tw/</li>
              </ul>
            </div>
          </div>
          {/* <FooterLinks /> */}
          <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-1">
            <div className="footer__widget">
            </div>
            <div className="footer__map">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3613.2614601811906!2d121.52314117592742!3d25.093009235911783!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3442aea4b2fcac53%3A0xc166fb93a670b0e2!2zMTEx5Y-w5YyX5biC5aOr5p6X5Y2A5paH5p6X6LevMzM46JmfNCDkuYsgMQ!5e0!3m2!1szh-TW!2stw!4v1754015187659!5m2!1szh-TW!2stw" 
                width="100%" 
                height="200px" 
                style={{border:0}} 
                allowfullscreen="" 
                loading="lazy" 
                referrerpolicy="no-referrer-when-downgrade"
              >
              </iframe>
            </div>
          </div>
          {/* <FooterNewsletter /> */}
          <div className="col-lg-4 col-md-12">
            <div className="footer__widget">
              <h6>歡迎來到 Byte Eat 的平台</h6>
              <p>透過電子郵件獲取有關 Byte Eat 最新商店和特別優惠的最新消息</p>
              <form action="#">
                <input type="text" placeholder="輸入您的信箱" />
                <button type="submit" className="site-btn">訂閱</button>
              </form>
              <div className="footer__widget__social">
                <a href="https://www.facebook.com/"><i className={`fa fa-facebook`}></i></a>
                <a href="https://www.instagram.com/"><i className={`fa fa-instagram`}></i></a>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          {/* <FooterCopyright /> */}
          <div className="col-lg-12">
            <div className="footer__copyright">
              <div className="footer__copyright__text">
                <p>
                  &copy; {new Date().getFullYear()} All rights reserved | This meal ordering platform is made with 
                  <i className="fa fa-heart"></i> 
                  by 
                  <a href="https://www.lccnet.com.tw/" target="_blank" rel="noopener noreferrer">
                  Byte Eat
                  </a>
                </p>
              </div>
              <div className="footer__copyright__payment">
                <img src={imageURL} alt="Payment Icons" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;