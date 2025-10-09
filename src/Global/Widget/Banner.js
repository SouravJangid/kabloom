import React from 'react';
import '../../assets/stylesheets/banner.css';
import kabloomkalogo from '../../assets/images/Logo/kabloom-logo.png';
import igicon from '../../assets/images/general-icons/instagram.png';
import googleicon from '../../assets/images/general-icons/google.png';


const Banner = ({
  logoSrc = "",
  name = '',
  address = '',
  website = '',
  phone = '',
  ratingImg,
  reviewCount = 0,
  socialLinks = [
    { platform: 'Instagram', url: 'https://instagram.com/', icon: igicon },
    { platform: 'Google', url: 'https://google.com/', icon: googleicon },
  ],
}) => {

  return (
    <div className="banner-container">
      <div className="banner">
        <div className="logo">
          <img
            src={logoSrc}
            alt={name ? `${name} Logo` : 'Vendor Logo'}
            loading="lazy"
            onError={(e) => {
              // If the vendor image fails (404, CORS, etc), swap to the placeholder
              if (e.currentTarget.src !== kabloomkalogo) {
                e.currentTarget.src = kabloomkalogo;
              }
            }}
          />
        </div>

        <div className="info">
          {name && <h1>{name}</h1>}
          {address && <p>{address}</p>}

          {website && (
            <p>
              <a
                href={website}
                className="website-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                {website}
              </a>
            </p>
          )}

          {phone && <p>{phone}</p>}

          <div className="rating">
            {/* {ratingImg && <img src={ratingImg} alt="Rating" />} */}
            {typeof reviewCount === 'number' && <span>({reviewCount} reviews)</span>}
          </div>

          <div className="social">
            {Array.isArray(socialLinks) &&
              socialLinks.map((social, index) => (
                <a
                  href={social.url}
                  key={index}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={social.icon} alt={social.platform} />
                </a>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Banner;
