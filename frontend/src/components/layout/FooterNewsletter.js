const FooterNewsletter = () => (
    <div className="col-lg-4 col-md-12">
      <div className="footer__widget">
        <h6>歡迎來到 Byte Eat 的平台</h6>
        <p>透過電子郵件獲取有關 Byte Eat 最新商店和特別優惠的最新消息</p>
        <form action="#">
          <input type="text" placeholder="輸入您的信箱" />
          <button type="submit" className="site-btn">訂閱</button>
        </form>
        <div className="footer__widget__social">
          {["facebook", "instagram", "twitter", "pinterest"].map((icon, i) => (
            <a href="#" key={i}><i className={`fa fa-${icon}`}></i></a>
          ))}
        </div>
      </div>
    </div>
  );

  export default FooterNewsletter;