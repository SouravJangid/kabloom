import React from 'react';
import '../../assets/stylesheets/deliveryInfo.css';

function DeliveryInfo({ deliveryInfo }) {
  if (!deliveryInfo || deliveryInfo.length === 0) return <div>No delivery information available.</div>;

  const deliveryDetails = deliveryInfo["Delivery Details & Tips"];
  const neighborhoodsAndCities = deliveryInfo["Where do we Deliver? - Neighborhoods & Cities"] ?? [];
  const zipCodes = deliveryInfo["Where do we Deliver? - ZIP Codes"] ?? [];
  const hospitals = deliveryInfo["Local Hospitals"] ?? [];
  const cemeteries = deliveryInfo["Local Cemeteries & Funeral Homes"] ?? [];

  return (
    <>
      <h1 className="delivery-header">Delivery Information</h1>
      <div className="delivery-underline"></div>

      <div className="delivery-info-centered">
        {/* Delivery Details */}
        <h2>Delivery Details & Tips</h2>
        <p className="delivery-paragraph">{deliveryDetails}</p>

        {/* Neighborhoods & Cities */}
        <h3>Where do we Deliver?</h3>
        <strong>Neighborhoods & Cities:</strong>
        <div className="delivery-cities">
          {neighborhoodsAndCities.join(', ')}
        </div>

        {/* ZIP Codes */}
        <strong>ZIP Codes:</strong>
        <div className="delivery-zips">
          {zipCodes.join(', ')}
        </div>

        {/* Local Hospitals */}
        {hospitals.length > 0 && (
          <>
            <h3>Local Hospitals</h3>
            <p className="delivery-paragraph">
              {hospitals.map(h => h.replace(/^Local Hospitals\s*/i, '')).join(', ')}
            </p>
          </>
        )}

        {/* Cemeteries & Funeral Homes */}
        {cemeteries.length > 0 && (
          <>
            <h3>Local Cemeteries & Funeral Homes</h3>
            <p className="delivery-paragraph">
              {cemeteries.map(c => c.replace(/^Local Cemeteries & Funeral Homes\s*/i, '')).join(', ')}
            </p>
          </>
        )}
      </div>
    </>
  );
}

export default DeliveryInfo;
