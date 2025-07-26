const FooterNewsletter = () => (
    <div className="col-lg-4 col-md-12">
      <div className="footer__widget">
        <h6>Join Our Newsletter Now</h6>
        <p>Get E-mail updates about our latest shop and special offers.</p>
        <form action="#">
          <input type="text" placeholder="Enter your mail" />
          <button type="submit" className="site-btn">Subscribe</button>
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