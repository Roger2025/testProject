import React from "react";
import FooterAbout from "./FooterAbout";
import FooterLinks from "./FooterLinks";
import FooterNewsletter from "./FooterNewsletter";
import FooterCopyright from "./FooterCopyright";
// import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer spad">
      <div className="container">
        <div className="row">
          <FooterAbout />
          <FooterLinks />
          <FooterNewsletter />
        </div>
        <div className="row">
          <FooterCopyright />
        </div>
      </div>
    </footer>
  );
};

export default Footer;