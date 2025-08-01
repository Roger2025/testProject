import JpImg from '../../components/JumpImg'

const FooterAbout = () => (
    <div className="col-lg-3 col-md-6 col-sm-6">
      <div className="footer__about">
        <div className="footer__about__logo">
          <a href="./index.html">
            {/* <img src="img/logo.png" alt="Logo" /> */}
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
  );

export default FooterAbout;