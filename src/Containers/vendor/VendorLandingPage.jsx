import React, { lazy } from 'react';
import VendorProductsListing from '../../Components/ProductComponents/VendorProductsListing';
import Banner from '../../Global/Widget/Banner';
import DynamicTab from '../../Global/Widget/DynamicTab';
import defaultImage from '../../assets/images/Logo/kabloom-logo.png';
import {genericPostData} from '../../Redux/Actions/genericPostData';
import { connect } from 'react-redux';

const PLACEHOLDER_IMAGE = defaultImage;

class VendorLandingPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      vendorData: null,
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    this.fetchProductsPage(1);
  }

  // Fetch the vendor page (with products) for a specific page number.
  // This method is passed down as onRequestPage to VendorProductsListing.
  fetchProductsPage = (pageNo = 1) => {
    const vendorId =
      this.props.location?.state?.vendorId || this.props.match.params.vendorId;
    const zipcode =
      this.props.location?.state?.zipcode || localStorage.getItem('zipcode');

    if (!vendorId || !zipcode) {
      this.setState({ error: 'Vendor ID or zipcode missing!', loading: false });
      return;
    }

    // keep loading true only on initial load or explicit reload
    this.setState({ loading: true, error: null });

    const body = {
      vendor_id: vendorId,
      zipcode: zipcode,
      page_no: Number(pageNo) || 1,
      limit: '20',
    };

    genericPostData({
      dispatch: this.props.dispatch,
      reqObj: body,
      url: '/api/Vendordata/getVendorData',
      constants: {
        init: 'VENDOR_PAGE_INIT',
        success: 'VENDOR_PAGE_SUCCESS',
        error: 'VENDOR_PAGE_ERROR',
      },
      identifier: 'VENDOR_PAGE',
      successCb: (data) => {
        // Expect data to contain vendorData + products { data: [...], pagination: {...} }
        this.setState({ vendorData: data, loading: false });
      },
      errorCb: () => this.setState({ error: 'Failed to fetch vendor data', loading: false }),
      dontShowMessage: true,
    });
  };

  render() {
    const { vendorData, loading, error } = this.state;

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    if (!vendorData)
      return (
        <div>
          <h2>No vendor data available.</h2>
        </div>
      );

    const vendorInfo = vendorData.vendor_info?.[0] || {};
    const vendorName = vendorInfo.vendor_name || 'Vendor';

    // Pass the full products object so VendorProductsListing can see .data AND .pagination
    const productsObject = vendorData.products || { data: [], pagination: null };

    const aboutVendor =
      Array.isArray(vendorData?.about_vendor) &&
      vendorData.about_vendor.length > 0
        ? vendorData.about_vendor[0]
        : null;

    const logoSrc = vendorInfo.vendor_image_url;

    const displayName =
      (typeof aboutVendor?.loc_name === 'string' &&
        aboutVendor.loc_name.trim().length > 0 &&
        aboutVendor.loc_name.trim()) ||
      vendorName;

    const address =
      aboutVendor?.formatted_address ||
      [
        aboutVendor?.loc_address,
        aboutVendor?.loc_city,
        aboutVendor?.loc_state,
        aboutVendor?.loc_postcode,
      ]
        .filter(Boolean)
        .join(', ');

    const website =
      vendorInfo?.website ||
      vendorInfo?.vendor_website ||
      vendorInfo?.website_url ||
      '';

    const phone =
      aboutVendor?.loc_phone ||
      vendorInfo?.vendor_phone ||
      vendorInfo?.phone ||
      '';

    const reviews = Array.isArray(vendorData?.reviews)
      ? vendorData.reviews
      : [];
    const reviewsCount = reviews.length;

    const vendorId =
    this.props.location?.state?.vendorId || this.props.match.params.vendorId;
    const zipcode =
    this.props.location?.state?.zipcode || localStorage.getItem('zipcode');

    const tabData = [
      {
        label: 'Shop',
        getComponent: () => (
          <VendorProductsListing
            productListingData={productsObject}
            defaultImage={PLACEHOLDER_IMAGE}
            vendorId={vendorId}
            zipcode={zipcode}
          />
        ),
      },
      {
        label: 'About',
        getComponent: () => {
          const AboutPage = lazy(() =>
            import('../../Global/Widget/AboutPage')
          );
          return aboutVendor ? (
            <AboutPage about_vendor={aboutVendor} />
          ) : (
            <div>About vendor information not available.</div>
          );
        },
      },
      {
        label: `Reviews (${reviewsCount})`,
        getComponent: () => {
          const Reviews = lazy(() =>
            import('../../Global/Widget/Reviews')
          );
          return <Reviews reviews={reviews} />;
        },
      },
      {
        label: 'Delivery Info',
        getComponent: () => {
          const DeliveryInfo = lazy(() =>
            import('../../Global/Widget/DeliveryInfo')
          );
          return (
            <DeliveryInfo
              deliveryInfo={vendorData?.delivery_information?.[0]}
            />
          );
        },
      },
    ];

    return (
      <div>
        <Banner
          name={displayName}
          logoSrc={logoSrc}
          address={address}
          website={website}
          phone={phone}
          reviewCount={reviewsCount}
        />
        <DynamicTab tabs={tabData} />
      </div>
    );
  }
}

export default connect()(VendorLandingPage);
