import React from "react";
import data from "./data/productData.json";
import "./ManufacturerInfo.scss";

const ManufacturerInfo = () => {
  return (
    <div className="manufacturer">
      <h3>From the manufacturer</h3>
      <div className="manufacturer-top">
        <div className="top-banner">
          <img
            src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/305f8226-ce31-4616-b2f2-69d1916f566d._CR0,0,970,300_PT0_SX970__.jpg"
            alt="Manufacturer Banner"
            className="banner-img"
          />
        </div>

        <div className="top-main">
          <div className="main-left">
            <div className="img-card">
              <img src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/e4ceb4e3-a2b4-4cf9-95e0-f74f92ff2770._CR0,0,300,400_PT0_SX300__.jpg" alt="KaBloom" />
            </div>
          </div>

          <div className="main-center">
            <h4>Brighten up your day!</h4>
            <em>Our blooms are sure to add some color to your life</em>
            <p>KaBloom offers one of the largest selections of fresh cut flowers, carefully arranged bouquets and gift baskets; our large variety of beautifully mixed bouquets, colorful exotic Orchids and luscious Red Roses will help you celebrate life’s special moments. With our patented flower hydration system, our flowers are fresh on delivery, hydrated continually straight from the farm to your door. Come shop our wide variety of fresh house plants like Bonsai Trees and Succulents!</p>
          </div>

          <div className="main-right">
            <div className="logo-card">
              <img src="https://m.media-amazon.com/images/S/aplus-media-library-service-media/9102231b-ca76-409b-bff0-7b0ab90a4c4c._CR0,0,350,175_PT0_SX350__.jpg" alt="KaBloom Logo" />
              <h5>Live Beautifully!</h5>
              <p>We believe that beauty is everywhere, and our floral designers want to help bring the experience to your doorstep. The natural beauty of our fresh cut flowers cannot be overstated, and it is a testament to the quality and excellence we strive to achieve for you!</p>
            </div>
          </div>
        </div>
      </div>
      <div className="manufacturer-grid">
        {data?.features?.length ? (
          data.features.map((feature, index) => (
            <div key={index} className="feature-card">
              <img src={feature.image} alt={feature.heading} />
              <h5>{feature.heading}</h5>
              <p>{feature.paragraph}</p>
            </div>
          ))
        ) : (
          <p>No features available</p>
        )}
      </div>
      <div className="manufacturer-bottom">
        <div className="top-banner">
          <img
            src="https://res.cloudinary.com/drb2zkobo/image/upload/v1762946587/image_124_re7zrc.png"
            alt="Manufacturer Banner"
            className="banner-img"
          />
        </div>
        <div className="top-main">
          <div className="main-left">
            <div className="img-card">
              <img src="https://res.cloudinary.com/drb2zkobo/image/upload/v1762946587/image_123_xrhbaj.png" alt="KaBloom" />
            </div>
          </div>
          <div className="main-right">
            <div className="gift-touch-container">
              <h1 className="gift-title">Your Gift, Your Touch!</h1>
              <p className="gift-subtitle">It Is Our Job To Make This Easy For You. All You Have To Do Is:</p>

              <ol className="gift-steps">
                {data?.steps?.length ? (
                  data.steps.map((step, index) => (
                    <li key={index}>
                      <span>{String.fromCharCode(97 + index)}.</span>
                      {step}
                    </li>
                  ))
                ) : (
                  <li>No steps found</li>
                )}
              </ol>

              <p className="gift-footer">
                <span className="bullet">•</span> Voila! Once You've Made Your Purchase, Your Gift Will Be Out For Delivery.
              </p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ManufacturerInfo;
