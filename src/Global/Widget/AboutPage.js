// AboutPage.js
import React from 'react';
import '../../assets/stylesheets/aboutPage.css';
import { DEFAULT_STORE_HOURS } from '../../assets/data/aboutPageConstants';


function AboutPage({ about_vendor, storeHours }) {
  if (!about_vendor) {
    return <div>About vendor information not available.</div>;
  }

  return (
    <div className="about-page">
      <h1 className="about-title">About Us</h1>
      <div className="about-underline"></div>
      <div className="about-card">
        <div className="about-col">
          <div className="about-col-title">DELIVERY INFORMATION</div>
          <div className="about-row">Do we offer delivery? <b>Yes</b></div>
          <div className="about-row">Do we offer pickup? <b>Yes</b></div>
        </div>

        <div className="about-col">
          <div className="about-col-title">CONTACT INFORMATION</div>
          <>
            <div className="about-row">
              <span className="about-icon" role="img" aria-label="address">📍</span>
              <span className="about-address">{about_vendor.formatted_address}</span>
            </div>
            {about_vendor.loc_email && (
              <div className="about-row">
                <span className="about-icon" role="img" aria-label="email">🌐</span>
                <a className="about-link" href={`mailto:${about_vendor.loc_email}`}>{about_vendor.loc_email}</a>
              </div>
            )}
            {about_vendor.loc_phone && (
              <div className="about-row">
                <span className="about-icon" role="img" aria-label="phone">📞</span>
                <a className="about-link" href={`tel:${about_vendor.loc_phone}`}>{about_vendor.loc_phone}</a>
              </div>
            )}
          </>
        </div>
      </div>
    </div>
  );
}

AboutPage.defaultProps = {
  storeHours: DEFAULT_STORE_HOURS,
};

export default AboutPage;
