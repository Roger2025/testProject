const linksGroup1 = ["About Us", "About Our Shop", "Secure Shopping", "Delivery infomation", "Privacy Policy", "Our Sitemap"];
const linksGroup2 = ["Who We Are", "Our Services", "Projects", "Contact", "Innovation", "Testimonials"];

const FooterLinks = () => (
  <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-1">
    <div className="footer__widget">
      <h6>Useful Links</h6>
      <ul>{linksGroup1.map((txt, i) => <li key={i}><a href="#">{txt}</a></li>)}</ul>
      <ul>{linksGroup2.map((txt, i) => <li key={i}><a href="#">{txt}</a></li>)}</ul>
    </div>
  </div>
);

export default FooterLinks;