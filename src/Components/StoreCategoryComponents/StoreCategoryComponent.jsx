import React from "react";
// import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import LocalShippingOutlinedIcon from "@material-ui/icons/LocalShippingOutlined";
// import Typography from "@material-ui/core/Typography";
// import withStyles from "@material-ui/core/styles/withStyles";
// import CircularProgress from "@material-ui/core/CircularProgress";
// import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import { connect } from "react-redux";
import {
  isArray as _isArray,
  map as _map,
  findIndex as _findIndex,
  get as _get,
  isEmpty as _isEmpty,
  forEach as _forEach,
  find as _find,
  filter as _filter,
} from "lodash";
// import {
//   Card,
//   CardImg,
//   CardText,
//   CardBody,
//   CardTitle,
//   CardSubtitle,
  // Button,
// } from "reactstrap";
// import ProductDetails from "../ProductComponents/ProductDetails";
// import everestVodka from "../../assets/images/Titos.jpg";
// import { commonActionCreater } from "../../Redux/Actions/commonAction";
// import { ProductClick, PageView } from "../../Global/helper/react-ga";
import {
  // cleanEntityData,
  // deliveryMethods,
  productListingDeliveryMethods,
} from "../../Global/helper/commonUtil";
// import WithLoading from "../../Global/UIComponents/LoaderHoc";

// const styles = theme => ({
//     main: {
//         width: 'auto',
//         display: 'block', // Fix IE 11 issue.
//         marginLeft: theme.spacing.unit * 3,
//         marginRight: theme.spacing.unit * 3,
//         [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
//             width: 400,
//             marginLeft: 'auto',
//             marginRight: 'auto',
//         },
//     },
//     paper: {
//         marginTop: theme.spacing.unit * 8,
//         display: 'flex',
//         flexDirection: 'column',
//         alignItems: 'center',
//         padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
//     },
//     avatar: {
//         margin: theme.spacing.unit,
//         backgroundColor: theme.palette.secondary.main,
//     },
//     form: {
//         width: '100%', // Fix IE 11 issue.
//         marginTop: theme.spacing.unit,
//     },
//     submit: {
//         marginTop: theme.spacing.unit * 3,
//     },

//    });

class ProductsListing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showProductDetailsPage: false,
      prodId: "",
      topProductActiveIndex: [],
      categoryType: "",
      categoryId: "",
    };
  }

  componentDidMount() {
    this.setState({
      categoryType: this.props.match.params.categoryType,
      categoryId: this.props.match.params.categoryId,
    });
    let data = [];
    _get(this.props, "productListingAfterSort").map((parent) => {
      data.push({ childBottleIndex: 0 });
    });

    this.setState({ topProductActiveIndex: data });
  }

  fetchProductDetails = (ProductID) => {
    let categoryName = _get(
      this.props,
      `categoriesList[${this.props.tabValue}].category_name`,
      null
    );
    this.props.history.push(`/category/${categoryName}/product/${ProductID}`);
  };

  productDetailsFetchSuccess = () => {};

  productDetailsFetchError = () => {};

  redirectToPDP = (productId) => {
    // const bottleSize = _get(
    //   product,
    //   `child[${this.getActiveChildIndex(parentIndex)}].bottle_size`,
    //   ""
    // );
    // const childId = _get(
    //   product,
    //   `child[${this.getActiveChildIndex(parentIndex)}].id`,
    //   ""
    // );
    // const bottleSizeDetail = _find(_get(product, "child"), [
    //   "bottle_size",
    //   bottleSize,
    // ]);
    // const payload = cleanEntityData({
    //   productId: _get(product, "id"),
    //   name: _get(product, "name"),
    //   variant: bottleSize,
    //   price: _get(bottleSizeDetail, "price")
    //     ? Number(_get(bottleSizeDetail, "price"))
    //     : undefined,
    // });
    // ProductClick(payload);
    // PageView();

    // this.props.dispatch(commonActionCreater(bottleSize, "SET_BOTTLE_SIZE"));
    // this.props.dispatch(commonActionCreater(childId, "SET_BOTTLE_ID"));
    // // let categoryName = _get(this.props, `categoriesList[${this.props.tabValue}].category_name`, null);
    // // let categoryID = _get(this.props, `categoriesList[${this.props.tabValue}].category_id`, null)
    // let categoryName = this.state.categoryType;
    // let categoryID = this.state.categoryId;
    // let ProductID = _get(product, "id", null);
    // this.props.history.push(`/store/category/${categoryName}/${categoryID}/${ProductID}`);
    this.props.history.push(`/store/${productId}`);
  };
  setBottleSizeIndex = (parentBottleIndex, childBottleIndex) => {
    let data = this.state.topProductActiveIndex;
    data[parentBottleIndex].childBottleIndex = childBottleIndex;
    this.setState({ topProductActiveIndex: [] }, () => {
      this.setState({
        topProductActiveIndex: data,
      });
    });
  };

  getActiveChildIndex = (parentIndex) => {
    let childActiveIndex = _get(
      this.state,
      `topProductActiveIndex[${parentIndex}].childBottleIndex`,
      0
    );
    return childActiveIndex;
  };

  render() {
    let ProductList = [];
    // const { productListingData, classes } = this.props;
    // let mapProductSizeButton = ({ data }) => _map(data, (d, index) => {
    //     if (index === 0) {
    //         return (
    //             <Button className='active' key={index}>{d.bottle_size}</Button>
    //         )
    //     } else {
    //         return (
    //             <Button key={index}>{d.bottle_size}</Button>
    //         )
    //     }
    // });

    // let mapProductSizeButton = (data, parentIndex) =>
    //   _map(data, (subItem, childIndex) => {
    //     return (
    //       <React.Fragment key={childIndex}>
    //         <Button
    //           className={
    //             _get(
    //               this.state,
    //               `topProductActiveIndex[${parentIndex}].childBottleIndex`,
    //               0
    //             ) === childIndex
    //               ? "active"
    //               : ""
    //           }
    //           onClick={() => this.setBottleSizeIndex(parentIndex, childIndex)}
    //           onMouseOver={() =>
    //             this.setBottleSizeIndex(parentIndex, childIndex)
    //           }
    //         >
    //           {subItem.bottle_size}
    //         </Button>
    //       </React.Fragment>
    //     );
    //   });

    let mapSpeedButton = (data, parentIndex) =>
      _map(data, (subItem, childIndex) => {
        subItem = productListingDeliveryMethods[`${subItem}`];
        return (
          <React.Fragment key={childIndex}>
            <span className="speed-type-name">
              {subItem}
              {/* {deliveryMethods(subItem)} */}
            </span>
          </React.Fragment>
        );
      });
  
      _isArray(_get(this.props, "productListingAfterSort", [])) &&
      this.props.productListingAfterSort.map((p, parentIndex) => {
        // let sizeButtons = !_isEmpty(_get(product, 'child')) ? mapProductSizeButton({ data: _get(product, 'child')}) : []
        let smallImage = "";
        _map(_get(p, "image", []), (im) => {
          if (im.hasOwnProperty("small_image")) {
            smallImage = _get(im, "small_image");
          }
        });

        const filteredChildItem = _filter(_get(p, "child", []), (i) => {
          if (_get(i, "bottle_size") !== "0") {
            return i;
          }
        });
        const product = {
          ...p,
          child: filteredChildItem,
          smallImage,
        };

        const productDeliveryType = product?.child?.reduce((acc, curr) => {
          const currentTypes = new Set(
            _get(curr, "speed_id", []).map((item) => item.Type)
          );
          return new Set([...acc, ...currentTypes]);
        }, new Set());
        const productDeliveryTypeArray = Array.from(productDeliveryType);
        ProductList.push(
          <div className="storeItemsList" key={_get(product, "id")}>
            <div onClick={() => this.redirectToPDP(_get(product, "id"))}>
              {/* <div style={{ backgroundImage: `url(${_get(product, 'image')})` }} className="listProductImg"> */}
              <div
                style={{
                  backgroundImage: `url(${_get(product, "smallImage", "")})`,
                }}
                className="listProductImg"
              ></div>
              {/* <div className="hoverItems">
                            <Button onClick={() => this.redirectToPDP(product, parentIndex)} className="listPageAddcartbtn"> SHOP NOW </Button>
                        </div> */}

              <div className="productName" title={product.name}>
                {product.name}
              </div>
              {/* <div className="displaySize">
                            
                            {_get(product, `child[${this.getActiveChildIndex(parentIndex)}].bottle_size`, '')}
                        </div> */}
              <div className="dispalyPrice">
                {/* { !_isEmpty(_get(product, 'child')) ? _get(product, 'child.0.price') : 'NA'} */}
                $
                {_get(
                  product,
                  `child[${this.getActiveChildIndex(parentIndex)}].price`,
                  ""
                )}
              </div>
              <div className="speed-type mt-3">
                <LocalShippingOutlinedIcon className="mr-1" />
                {mapSpeedButton(productDeliveryTypeArray, parentIndex)}
              </div>
              {/* <div>{mapProductSizeButton(product.child, parentIndex)}</div> */}
              {/* <div className="availableSize">
                            {_isEmpty(_get(product, 'child')) ? 'NA' : _get(product, 'child').length === 1 ? `${_get(product, 'child').length} size available` : `${_get(product, 'child').length} sizes available`}
                        </div> */}
              {/* <div className="walletdisplaySize">
                            
                            <div className="mb-2">Available in Wallet: {_get(product, `child[${this.getActiveChildIndex(parentIndex)}].bottle_size`, '')}ml</div>
                            Redeemable Here: {_get(product, `child[${this.getActiveChildIndex(parentIndex)}].bottle_size`, '')}ml
                        </div>
                        <div className="walletaddtocart">
                        <Button onClick={() => this.handleAddToCart()} variant="contained" className="bottomActionbutton cartActionBtn" type="submit">
                            {this.state.addToCartLoading ? <CircularProgress /> : <> <ShoppingCartOutlinedIcon className="iconSize mr-2"></ShoppingCartOutlinedIcon> ADD TO CART</>}
                        </Button>
                        </div> */}
            </div>
          </div>
        );
      });

      
    return (
      <React.Fragment>
        <CssBaseline />
        {/* {
!this.state.showProductDetailsPage  ? */}
        <div className="productsList">{ProductList}</div>
        {/* : <ProductDetails {...this.props} ProductID={this.state.prodId} /> */}
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  // let productListingData = _get(state,'productList.lookUpData', {});
  let isLoading = _get(state, "productList.isFetching");
  return { isLoading };
}
// export default connect(mapStateToProps)(WithLoading(ProductsListing));
export default connect(mapStateToProps)(ProductsListing);
