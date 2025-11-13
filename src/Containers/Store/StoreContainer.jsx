import React from "react";

import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import RecentActivityComponent from "../../Components/StoreComponents/RecentActivityComponent";
import TopProductComponent from "../../Components/StoreComponents/TopProductComponent";
import TopCategoryComponent from "../../Components/StoreComponents/TopCategoryComponent";
import PromotionalComponent from "../../Components/StoreComponents/PromotionalComponent";
import genericGetData from "../../Redux/Actions/genericGetData";
import {
  get as _get,
  filter as _filter,
  isEmpty as _isEmpty,
  omit,
  sortBy,
  orderBy,
} from "lodash";
import WithLoading from "../../Global/UIComponents/LoaderHoc";

import { PageView } from "../../Global/helper/react-ga";

const styles = () => {};
class StoreContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      storeData: {},
      noProduct: false,
    };
  }

  componentDidMount() {
    PageView();
    const zipcode = localStorage.getItem("zipcode");
    // const zipState = localStorage.getItem("zipState");
    // const location = localStorage.getItem("location");
    const locTime = localStorage.getItem("dineinTime");
    const retailer = localStorage.getItem("vendor_location_id");
    let urlparam = "";
    const courier_type = localStorage.getItem("couriertype");
    // if (!_isEmpty(zipState) && !_isEmpty(location)) {
    //     urlparam = `/connect/index/homepage?store_id=1&state=${zipState}&location=${location}&dineinTime=${locTime}&retailer=${retailer}`;
    // } else if (!_isEmpty(zipState)){
    //     urlparam = `/connect/index/homepage?store_id=1&state=${zipState}&dineinTime=${locTime}&retailer=${retailer}`;
    // } else if (!_isEmpty(location)) {
    //     urlparam = `/connect/index/homepage?store_id=1&location=${location}&dineinTime=${locTime}&retailer=${retailer}`;
    // }

    if (!_isEmpty(zipcode)) {
      urlparam = `/connect/index/homepage?store_id=1&zipcode=${zipcode}&loc_id=${retailer}&courier_type=${courier_type}`;
    } else {
      urlparam = `/connect/index/homepage?store_id=1&zipcode=&loc_id=${retailer}&courier_type=${courier_type}`;
    }
    genericGetData({
      dispatch: this.props.dispatch,
      url: urlparam,
      constants: {
        init: "STORE_INFO_INIT",
        success: "STORE_INFO_SUCCESS",
        error: "STORE_INFO_ERROR",
      },
      identifier: "STORE_INFO",
      successCb: this.storeInfoSuccess,
      errorCb: this.storeInfoFetchError,
      dontShowMessage: true,
    });
  }
  storeInfoSuccess = (data) => {
    if (data?.code == -1) {
      this.setState({ noProduct: true });
    }

    this.setState({ storeData: data });
  };

  storeInfoFetchError = () => {};

  render() {
    const res = _get(this.state, "storeData.topproduct", [])?.map((x) => {
      return {
        ...x,
        child: sortBy(x.child, [
          function (o) {
            return parseInt(o.bottle_size);
          },
        ]),
      };
    });

    const { classes } = this.props;
    const topProducts = _get(this.state, "storeData.categories", [])
    
    const categoriesRenderComp = (x) => {
              const categoryName = x.categoryName;
              const products = x.products;
              const productSorted = products?.map((x) => {
                return {
                  ...x,
                  child: sortBy(x.child, [
                    function (o) {
                      return parseInt(o.bottle_size);
                    },
                  ]),
                };
              });

              return (
                <div key={`category-${categoryName}`} className="mt-5">
                  <h2>OUR TOP {categoryName}</h2>
                  <hr style={{ backgroundColor: "white" }}></hr>
                  <TopCategoryComponent
                    {...this.props}
                    // productsperadd={_filter(_get(this.state, 'storeData.productsperadd', []),
                    //     (o) => !Array.isArray(o))}
                    productsperadd={productSorted}
                  />
                </div>
              );
            };
    return this.state.noProduct ? (
      <div className="page-content-container" style={{ textAlign: "center" }}>
        {_get(this.state.storeData, "message", "No product available")}
      </div>
    ) : (
      <React.Fragment>
        {_get(this.state, "storeData.banner", [])?.length > 0 && (
          <RecentActivityComponent
            {...this.props}
            banners={this.state.storeData.banner}
          />
        )}
        <div className="page-content-container">
          <div className="mainStoreContainer">
            {topProducts.length>0 && categoriesRenderComp(topProducts[0])}
            {_get(this.state, "storeData.ads", [])?.length > 0 && (
              <div className="mt-5">
                <PromotionalComponent
                  {...this.props}
                  ads={this.state.storeData.ads}
                />
              </div>
            )}
            {topProducts.length>1 && topProducts.slice(1).map((category, index) => (
              <React.Fragment key={`category-${category.categoryName}-${index}`}>
                {categoriesRenderComp(category)}
              </React.Fragment>
            ))}
          </div>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  let isLoading = _get(state, "landingStoreInfo.isFetching");
  return { isLoading };
}

export default connect(mapStateToProps)(
  withStyles(styles)(WithLoading(StoreContainer))
);
