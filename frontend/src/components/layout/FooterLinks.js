import React from "react";
// import MapContainer from "./MapContainer";

// const linksGroup1 = ["About Us", "About Our Shop", "Secure Shopping", "Delivery infomation", "Privacy Policy", "Our Sitemap"];
// const linksGroup2 = ["Who We Are", "Our Services", "Projects", "Contact", "Innovation", "Testimonials"];

const FooterLinks = () => (
  <div className="col-lg-4 col-md-6 col-sm-6 offset-lg-1">
    <div className="footer__widget">
      {/* <h6>Useful Links</h6> */}
      {/* <ul>{linksGroup1.map((txt, i) => <li key={i}><a href="#">{txt}</a></li>)}</ul> */}
      {/* <ul>{linksGroup2.map((txt, i) => <li key={i}><a href="#">{txt}</a></li>)}</ul> */}
    </div>
    <div className="footer__map">
      {/* <MapContainer /> */}
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
      {/* <br/>
      <a
        href="https://www.google.com/maps?q=25.0856,121.5252"
        target="_blank"
        rel="noopener noreferrer"
      >
        查看地圖
      </a>  */}
    </div>
  </div>
);

export default FooterLinks;

