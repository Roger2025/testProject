const FooterCopyright = () => (
    <div className="col-lg-12">
      <div className="footer__copyright">
        <div className="footer__copyright__text">
          <p>
            &copy; {new Date().getFullYear()} All rights reserved | This template is made with <i className="fa fa-heart"></i> by <a href="https://colorlib.com" target="_blank">Colorlib</a>
          </p>
        </div>
        <div className="footer__copyright__payment">
          <img src="img/payment-item.png" alt="Payment Icons" />
        </div>
      </div>
    </div>
  );

export default FooterCopyright;