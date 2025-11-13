import React from "react";
import data from "./data/productData.json";       
import "./ProductCard.scss";
import StarIcon from "@material-ui/icons/Star";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
const renderStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return (
    <>
      {[...Array(full)].map((_, i) => (
        <StarIcon key={i} fontSize="small" className="stars" />
      ))}
      {half && <StarHalfIcon fontSize="small" className="stars" />}
    </>
  );
};
const ProductCard = () => {
  const card = data.productCard[0];  

  return (
    <div className="product-container">
      <div className="product-header">
        <h1 className="product-title">{card.title}</h1>

        <div className="product-details">
          <p>Product Dimensions: <span>{card.dimensions}</span> </p>
          <p>Manufacturer: <span>{card.manufacturer}</span> </p>
          <p>Units: <span>{card.units}</span> </p>
        </div>
        <div className="customer-review">Customer Reviews:</div>
        <div className="customer-reviews">
          <p>{card.rating}</p>
          {renderStars(card.rating)}
          <p className="review-count">
            <ExpandMoreIcon/>
            {card.reviewCount} ratings
          </p>
          </div>
      </div>
      <div className="video-section">
        <h3>Product Videos</h3>
        <div className="video-thumbnail">
        <div className="video-container">
          <img src={card.videoThumbnail} alt="Video thumbnail" />
          <div className="play-button">
            <PlayCircleFilledIcon className="play-icon" />
          </div>
        </div>
          
        <div className="product-footer">
        <img src={card.productImage} alt={card.title} />
        <div className="footer-info">
          <h4>12 Luxe Garden Charm - Handpicked Rose Ensemble</h4>
          <div className="footer-rating">
            <p>{card.rating}</p>
            {renderStars(card.rating)}
            <span>{card.reviewCount} ratings</span>
          </div>
          <div className="footer-price">${card.price}</div>
        </div>
      </div>
        </div>
      </div>     
    </div>
  );
};

export default ProductCard;