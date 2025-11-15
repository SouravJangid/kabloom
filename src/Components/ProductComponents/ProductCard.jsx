// import React from "react";
// import data from "./data/productData.json";       
// import "./ProductCard.scss";
// import StarIcon from "@material-ui/icons/Star";
// import StarHalfIcon from "@material-ui/icons/StarHalf";
// import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
// import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
// const renderStars = (rating) => {
//   const full = Math.floor(rating);
//   const half = rating % 1 >= 0.5;
//   return (
//     <>
//       {[...Array(full)].map((_, i) => (
//         <StarIcon key={i} fontSize="small" className="stars" />
//       ))}
//       {half && <StarHalfIcon fontSize="small" className="stars" />}
//     </>
//   );
// };
// const ProductCard = () => {
//   const card = data.productCard[0];  

//   return (
//     <div className="product-container">
//       <div className="product-header">
//         <h1 className="product-title">{card.title}</h1>

//         <div className="product-details">
//           <p>Product Dimensions: <span>{card.dimensions}</span> </p>
//           <p>Manufacturer: <span>{card.manufacturer}</span> </p>
//           <p>Units: <span>{card.units}</span> </p>
//         </div>
//         <div className="customer-review">Customer Reviews:</div>
//         <div className="customer-reviews">
//           <p>{card.rating}</p>
//           {renderStars(card.rating)}
//           <p className="review-count">
//             <ExpandMoreIcon/>
//             {card.reviewCount} ratings
//           </p>
//           </div>
//       </div>
//       <div className="video-section">
//         <h3>Product Videos</h3>
//         <div className="video-thumbnail">
//         <div className="video-container">
//           <img src={card.videoThumbnail} alt="Video thumbnail" />
//           <div className="play-button">
//             <PlayCircleFilledIcon className="play-icon" />
//           </div>
//         </div>
//        
//         </div>
//       </div>     
//     </div>
//   );
// };

// export default ProductCard;

/*  ProductCard.jsx  */
import React from "react";
import _get from "lodash/get";
import StarIcon from "@material-ui/icons/Star";
import StarHalfIcon from "@material-ui/icons/StarHalf";
import StarBorderIcon from "@material-ui/icons/StarBorder";
import PlayCircleFilledIcon from "@material-ui/icons/PlayCircleFilled";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import "./ProductCard.scss";


/* ------------------------------------ */
/* RENDER STARS                         */
/* ------------------------------------ */
const renderStars = ratingValue => {
  const full = Math.floor(ratingValue);
  const hasHalf = ratingValue % 1 >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);

  return (
    <>
      {Array.from({ length: full }).map((_, i) => (
        <StarIcon key={`full-${i}`} fontSize="small" className="stars" />
      ))}
      {hasHalf && <StarHalfIcon fontSize="small" className="stars" />}
      {Array.from({ length: empty }).map((_, i) => (
        <StarBorderIcon key={`empty-${i}`} fontSize="small" className="stars empty" />
      ))}
    </>
  );
};

const ProductCard = ({ selectedChild }) => {
  if (!selectedChild) return null;

  /* ------------------------------------ */
  /* SAFE DATA EXTRACTION                 */
  /* ------------------------------------ */
  const title = _get(selectedChild, "name", "N/A");
  const manufacturer = _get(selectedChild, "brand_name", "KaBloom");
  const units = `${_get(selectedChild, "flower_count", "100")} stems`;

  const ratingSummary = Number(_get(selectedChild, "reviews.rating_summary", 0));
  const rating = ratingSummary > 0 ? (ratingSummary / 20).toFixed(1) : "0.0";

  const reviewCount = String(_get(selectedChild, "reviews.review_count", "0"))
    .replace(/\D+/g, "")
    .trim();

  const price = Number(_get(selectedChild, "price", 0)).toFixed(2);

  const smallImage = _get(selectedChild, "image[0].small_image", "");

  /* ------------------------------------ */
  /* VIDEO LOGIC                          */
  /* ------------------------------------ */
  const productVideos = _get(selectedChild, "product_video", []) || [];

  const videoEntry = productVideos.find(v => v.type === "video");
  const videoUrl = videoEntry?.url || "";
  const videoThumbnail = videoEntry?.thumbnail || "";

  const fallbackThumbnail =
    videoThumbnail ||
    _get(productVideos, "0.thumbnail") ||
    smallImage ||
    "";

  /* ------------------------------------ */
  /* RENDER                               */
  /* ------------------------------------ */
  return (
    <div className="product-container">
      {/* HEADER */}
      <div className="product-header">
        <h1 className="product-title">{title}</h1>

        <div className="product-details">
          <p>
            Product Dimensions: <span>N/A</span>
          </p>
          <p>
            Manufacturer: <span>{manufacturer}</span>
          </p>
          <p>
            Units: <span>{units}</span>
          </p>
        </div>

        <div className="customer-review">Customer Reviews:</div>
        <div className="customer-reviews">
          <p>{rating}</p>
          {renderStars(Number(rating))}
          <p className="review-count">
            <ExpandMoreIcon />
            {reviewCount} ratings
          </p>
        </div>
      </div>

      {/* VIDEO SECTION */}
      <div className="video-section">
        <h3>Product Videos</h3>

        <div className="video-thumbnail">
          {productVideos.length === 0 ? (
            <p className="no-video">No video available</p>
          ) : videoUrl ? (
            <div className="video-container">
               <video
                src={videoUrl}
                poster={fallbackThumbnail}
                controls
                preload="metadata"
                className="product-video"
              /> 
            </div>
          ) : (
            <></>
          )}
          <div className="product-footer">
            <img src={smallImage} alt={title} className="footer-img" />
            <div className="footer-info">
              <h4>{title}</h4>
              <div className="footer-rating">
                <p>{rating}</p>
                {renderStars(Number(rating))}
                <span>{reviewCount} ratings</span>
              </div>
              <div className="footer-price">${price}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
