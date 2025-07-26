import React from 'react';
import banner1 from '../assets/images/banner/banner-1.jpg';
import banner2 from '../assets/images/banner/banner-2.jpg';

const BannerSection = () => {
  return (
    <div className="banner">
      <div className="container">
        <div className="row">
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="banner__pic">
              <img src={banner1} alt="Banner 1" />
            </div>
          </div>
          <div className="col-lg-6 col-md-6 col-sm-6">
            <div className="banner__pic">
              <img src={banner2} alt="Banner 2" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;