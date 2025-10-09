import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import { connect } from 'react-redux';
import { isArray as _isArray, map as _map, findIndex as _findIndex, get as _get, isEmpty as _isEmpty, forEach as _forEach, find as _find } from 'lodash';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';
import ProductDetails from "../ProductComponents/ProductDetails";
import everestVodka from '../../assets/images/Titos.jpg';
import { commonActionCreater } from "../../Redux/Actions/commonAction";
import { ProductClick, PageView } from '../../Global/helper/react-ga';
import { cleanEntityData } from '../../Global/helper/commonUtil';
import WithLoading from '../../Global/UIComponents/LoaderHoc';
import { genericPostData } from "../../Redux/Actions/genericPostData";

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
            categoryType: '',
            categoryId: '',
            walletProduct: null
        }
    }

    componentDidMount() {
        // this.setState({
        //     categoryType: this.props.match.params.categoryType,
        //     categoryId: this.props.match.params.categoryId
        // });
        // let data = [];
        // _get(this.props, 'productListingAfterSort').map((parent) => {
        //     data.push({ childBottleIndex: 0 })
        // })

        // this.setState({ topProductActiveIndex: data });


        // const retailerId = this.props.match.params.retailerId;

        // this.fetchWalletProducts({ retailerId });
    }

    // fetchWalletProducts = async ({retailerId}) => {
    //     const reqbody = cleanEntityData({
    //         // vendor_id: retailerId,
    //         // customer_id: this.props.customer_id
    //         vendor_id: 6621,
    //         customer_id: '7099'
    //     });
    //     genericPostData({
    //         dispatch: this.props.dispatch,
    //         reqObj: reqbody,
    //         url: `/api/walletproductlst/walletProducts`,
    //         constants: {
    //             init: "WALLET_PRODUCT_INIT",
    //             success: "WALLET_PRODUCT_SUCCESS",
    //             error: "WALLET_PRODUCT_ERROR"
    //         },
    //         identifier: "WALLET_PRODUCT_",
    //         successCb: this.walletProductSuccess,
    //         errorCb: this.walletProductError,
    //         dontShowMessage: true,
    //     });
    // }

    // walletProductSuccess = (data) => {
    //     if (!_isEmpty(data)) {
    //         this.setState({
    //             walletProduct: data
    //         })
    //     }
    // };
    // walletProductError = (err) => {
    //     console.log('error in wallet product', err);
    // }

    fetchProductDetails = (ProductID) => {
        let categoryName = _get(this.props, `categoriesList[${this.props.tabValue}].category_name`, null)
        this.props.history.push(`/category/${categoryName}/product/${ProductID}`)
    }

    productDetailsFetchSuccess = () => {
    }

    productDetailsFetchError = () => {

    }

    redirectToPDP = (product, parentIndex) => {
        const bottleSize = _get(product, `child[${this.getActiveChildIndex(parentIndex)}].bottle_size`, '');
        const bottleSizeDetail = _find(_get(product, 'child'), ['bottle_size', bottleSize])
        const payload = cleanEntityData({
            productId: _get(product, 'id'),
            name: _get(product, 'name'),
            variant: bottleSize,
            price: _get(bottleSizeDetail, 'price') ? Number(_get(bottleSizeDetail, 'price')) : undefined,
        });
        ProductClick(payload);
        PageView();

        this.props.dispatch(commonActionCreater(bottleSize, "SET_BOTTLE_SIZE"));
        // let categoryName = _get(this.props, `categoriesList[${this.props.tabValue}].category_name`, null);
        // let categoryID = _get(this.props, `categoriesList[${this.props.tabValue}].category_id`, null)
        let categoryName = this.state.categoryType;
        let categoryID = this.state.categoryId;
        let ProductID = _get(product, "id", null);
        // this.props.history.push(`/store/category/${categoryName}/${categoryID}/${ProductID}`);
        this.props.history.push(`/store/${ProductID}`);
    }
    setBottleSizeIndex = (parentBottleIndex, childBottleIndex) => {
        let data = this.state.topProductActiveIndex;
        data[parentBottleIndex].childBottleIndex = childBottleIndex;
        this.setState({ topProductActiveIndex: data })
    }

    getActiveChildIndex = (parentIndex) => {
        let childActiveIndex = _get(this.state, `topProductActiveIndex[${parentIndex}].childBottleIndex`, 0);
        return childActiveIndex;
    }

    handleAddToCart = (product) => {
        const reqbody = cleanEntityData({

            api_token: localStorage.getItem("Token"),
            cart_id: localStorage.getItem("cart_id"),
            zipcode: localStorage.getItem("zipcode"),
            "product_id": _get(product, 'prod_id'),
            "qty": "1",
            "size": _get(product, 'redeamable_here'),
            "vendor_loc_id": localStorage.getItem("vendor_location_id"),
            "pastorderid": "100027235",
            wallet: 1

        });
        // console.log(reqbody, 'req body');
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: reqbody,
            url: `/wallet/wallet/walletAddToCart`,
            constants: {
                init: "ADD_TO_CART_WALLET_INIT",
                success: "ADD_TO_CART_WALLET_SUCCESS",
                error: "ADD_TO_CART_WALLET_ERROR"
            },
            identifier: "ADD_TO_CART_WALLET",
            successCb: this.addToCartWalletSuccess,
            errorCb: this.addToCartWalletFailure,
            dontShowMessage: true,
        });

    }

    addToCartWalletSuccess = (data) => {
        if (_get(data, '0.code', -1) === 1) {
            localStorage.setItem('walletOrder', true);
            localStorage.setItem("cart_id", _get(data, '0.cart_id'));
            this.props.history.push('/cart');
        }
    }

    addToCartWalletFailure = (err) => {
        console.log('error in wallet catalogue', err);
    }

    render() {

        const { productListingData, classes } = this.props;
        let ProductList = []
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

        let mapProductSizeButton = (data, parentIndex) => _map(data, (subItem, childIndex) => {
            console.log('subItem', subItem.bottle_size);
            return (<React.Fragment key={childIndex}>
                <Button className={_get(this.state,
                    `topProductActiveIndex[${parentIndex}].childBottleIndex`, 0) === childIndex ? 'active' : ''}
                    onClick={() => this.setBottleSizeIndex(parentIndex, childIndex)}
                    onMouseOver={() => this.setBottleSizeIndex(parentIndex, childIndex)}>
                    {subItem.bottle_size}
                </Button>
            </React.Fragment>)
        })
        _isArray(_get(this.props, 'productListingAfterSort', [])) && this.props.productListingAfterSort.map((product, parentIndex) => {
            // let sizeButtons = !_isEmpty(_get(product, 'child')) ? mapProductSizeButton({ data: _get(product, 'child')}) : []
            ProductList.push(
                <div className="storeItemsList" key={_get(product, 'prod_id')}>
                    <div>
                        <div style={{ backgroundImage: `url(${_get(product, 'image')})` }} className="listProductImg">
                        </div>
                        <div className="productName">
                            {_get(product, 'prod_name')}
                        </div>
                        <div className="displaySize">
                            {/* { !_isEmpty(_get(product, 'child')) ? _get(product, 'child.0.bottle_size') : 'NA'} */}
                            {_get(product, `child[${this.getActiveChildIndex(parentIndex)}].bottle_size`, '')}ml
                        </div>
                        <div className="dispalyPrice">
                            <span>$</span>
                            {/* { !_isEmpty(_get(product, 'child')) ? _get(product, 'child.0.price') : 'NA'} */}
                            {_get(product, `child[${this.getActiveChildIndex(parentIndex)}].price`, '')}
                        </div>
                        <div className="availableSize">
                            {!_isEmpty(_get(product, 'child')) ? `${_get(product, 'child').length} sizes available` : 'NA'}
                        </div>
                        <div className="walletdisplaySize">
                            {/* { !_isEmpty(_get(product, 'child')) ? _get(product, 'child.0.bottle_size') : 'NA'} */}
                            <div className="mb-2">Available in Wallet: {_get(product, `available_wallet`, '')}ml</div>
                            Redeemable Here: {_get(product, `redeamable_here`, '')}ml
                        </div>
                        <div className="walletaddtocart">
                            <Button onClick={() => this.handleAddToCart(product)} variant="contained" className="bottomActionbutton cartActionBtn" type="submit">
                                {this.state.addToCartLoading ? <CircularProgress /> : <> <ShoppingCartOutlinedIcon className="iconSize mr-2"></ShoppingCartOutlinedIcon> ADD TO CART</>}
                            </Button>
                        </div>
                        {/* <div className="hoverItems">
                            <Button onClick={() => this.redirectToPDP(product, parentIndex)} className="listPageAddcartbtn"> SHOP NOW </Button>
                            <div className="proSizes">
                                
                                {mapProductSizeButton(product.child, parentIndex)}

                               
                            </div>
                        </div> */}
                    </div>
                </div>
            )
        })
        return (
            <React.Fragment>
                <CssBaseline />
                {/* {
!this.state.showProductDetailsPage  ? */}
                <div className="productsList">
                    {ProductList}
                </div>
                {/* : <ProductDetails {...this.props} ProductID={this.state.prodId} /> */}

            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    // let productListingData = _get(state,'productList.lookUpData', {});
    let isLoading = _get(state, 'productList.isFetching');
    let customer_id = _get(state, 'userSignInInfo.lookUpData.0.result.customer_id');
    return { isLoading, customer_id };
}
export default connect(mapStateToProps)(WithLoading(ProductsListing));