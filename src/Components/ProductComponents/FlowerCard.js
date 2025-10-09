import React from 'react';
import './../../assets/stylesheets/flowerCard.css';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import { speedMap } from '../../Global/Constants/commonconstants';


function FlowerCard({ product, defaultImage ,isImgLazy}) {
  
  const imageUrl = product?.image?.small_image || defaultImage || '';
  const price = product?.child?.[0]?.price || product?.price || '';

  const speedOptions = product?.speed_id;
  const speed = Array.isArray(speedOptions)
    ? [...new Set(speedOptions.map(s => speedMap[s.Type] || s.Type))].join(', ')
    : '';

  return (
    <div className="flowercard">
      <img
        className="flowercardImg"
        src={imageUrl}
        {...(isImgLazy ? { loading: "lazy" } : {})}
        // loading="lazy"
        alt={product?.name || 'Product'}
      />
      <div className="flowercardName" title={product?.name}>
        {product?.name}
      </div>
      {price && (
        <div className="flowercardPrice">
          from ${parseFloat(price).toFixed(2)}
        </div>
      )}
      {speed && (
        <div className="flowercardSpeed">
          <LocalShippingIcon className="truckIcon" />
          <div className="speedBadgeContainer">
            {speed.split(', ').map((s, idx) => (
              <span key={idx} className="speedBadge">
                {s}
                </span>
              ))}
              </div>
         </div>
        )}
    </div>
  );
}

export default FlowerCard;
