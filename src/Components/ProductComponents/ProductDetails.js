import React from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import { connect } from 'react-redux';
import { map as _map, findIndex as _findIndex, get as _get, isEmpty as _isEmpty, find as _find, sortBy as _sortBy, reduce as _reduce } from 'lodash';
import genericGetData from "../../Redux/Actions/genericGetData";
import { genericPostData } from "../../Redux/Actions/genericPostData";
import { Container, Row, Col } from 'reactstrap'
import {
    Button
} from 'reactstrap';
import "react-responsive-carousel/lib/styles/carousel.min.css";
// import { Carousel } from 'react-responsive-carousel';
import { LoaderOverLay } from '../../Global/UIComponents/LoaderHoc';
// import AliceCarousel from 'react-alice-carousel'
// import 'react-alice-carousel/lib/alice-carousel.css'
import CircularProgress from '@material-ui/core/CircularProgress';
import 'react-multi-carousel/lib/styles.css';
import { commonActionCreater } from "../../Redux/Actions/commonAction";
import { cleanEntityData, deliveryMethods } from '../../Global/helper/commonUtil';
// InputLabel removed - inline labels used for grid alignment
import MenuItem from '@material-ui/core/MenuItem';
// FormControl and Select not needed after converting size to RadioGroup
import RadioGroup from '../../Global/UIComponents/RadioGroup';
import TopCategoryComponent from '../../Components/StoreComponents/TopCategoryComponent';
import QuantitySelector from './QuantitySelector';
import ZipcodeInput from './ZipcodeInput';
import { Rate, Progress } from 'antd';

import { ProductView, PageView, ProductAddedtoCart } from '../../Global/helper/react-ga';
import showMessage from '../../Redux/Actions/toastAction';

import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/scss/image-gallery.scss";

import 'antd/dist/antd.css';
import '../../App.css';
// import { Height } from '@material-ui/icons';
import './ProductDetails.css';
import { APPLICATION_BFF_URL } from '../../Redux/urlConstants';
//Todo
// import AccountCircleIcon from '@material-ui/icons/AccountCircle';

// Number of digits in zipcode used across PDP
const ZIPCODE_LENGTH = 5;

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11f issue.
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
    pdpFormSection:{
        minHeight: '300px',
        display: 'flex', 
        marginRight: 12,
        flexDirection: 'column',
        gap: 14,
        marginTop: '40px'
    },
    quantityWrapper: {
        display: 'grid',
        gridTemplateColumns: '100px 1fr',
        alignItems: 'center',
        columnGap: 16,
        gap: 12,
        '& > *:first-child': {
            marginRight: 12,
        },
        '& label': {
            fontSize: 12,
            fontWeight: 'bold',
            marginBottom: 8,
            color: '#666'
        },
    },
});

class ProductDetails extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            defaultQuantity: 1,
            productPrice: "",
            showReviews: false,
            slideIndex: 0,
            isLoading: true,
            size: "",
            price: "",
            productID: "",
            speedDropdown: [],
            selectedSpeed: "",
            recommendedProducts: [],
            productDetailMap: {},
            vendorData:{},
            // responsive: {
            //     0: { items: 3 },

            // }
            responsive: {
                superLargeDesktop: {
                    // the naming can be any, depends on you.
                    breakpoint: { max: 4000, min: 1200 },
                    items: 5
                },
                desktop: {
                    breakpoint: { max: 1199, min: 768 },
                    items: 4
                },
                tablet: {
                    breakpoint: { max: 767, min: 464 },
                    items: 3,
                    slidesToSlide: 3
                },
                mobile: {
                    breakpoint: { max: 575, min: 320 },
                    items: 2,
                    slidesToSlide: 2
                }
            },
            zipcode: localStorage.getItem('zipcode') || "",
            zipcodeLoading: false,
            zipcodeInfo: null,
            zipcodeVerified: false,
            zipCodeMessage: '',
        }
        this.scrollToTopRef = React.createRef(); // Create the ref  

    }

    fetchProductDetail = (productId) => {
        
        // const productID = this.state.productId;
        const productID = productId;
        const loc_id = localStorage.getItem('vendor_location_id');
        const dineinTime = localStorage.getItem('dineinTime');
        const zipcode = localStorage.getItem('zipcode') || "";

        const couriertype = localStorage.getItem('couriertype');
        this.setState({ isLoading: true });
        genericGetData({
            dispatch: this.props.dispatch,
            url: `/connect/index/product?prodid=${productID}&store_id=1&loc_id=${loc_id}&dineinTime=${dineinTime}&zipCode=${zipcode}&courier_type=${couriertype}`,
            constants: {
                init: "PRODUCT_DETAILS_LIST_INIT",
                success: "PRODUCT_DETAILS_LIST_SUCCESS",
                error: "PRODUCT_DETAILS_LIST_ERROR"
            },
            identifier: "PRODUCT_DETAILS_LIST",
            successCb: this.productDetailsFetchSuccess,
            errorCb: this.productDetailsFetchError,
            dontShowMessage: true
        })
        const categoryType = this.props.match.params.categoryType;

        let index = _findIndex(this.props.categoriesList, { 'category_name': categoryType })
    if (index === -1) {
            index = 0
        }
        this.setState({ tabValue: index })
        this.FooterAddButtonFunction();
    }

    componentDidMount() {
        // window.scrollTo(0, 0);

        const productID = this.props.match.params.productID;
        const loc_id = localStorage.getItem('vendor_location_id');
        const dineinTime = localStorage.getItem('dineinTime');
        const zipcode = localStorage.getItem('zipcode');
        const couriertype = localStorage.getItem('couriertype')
        genericGetData({
            dispatch: this.props.dispatch,
            url: `/connect/index/product?prodid=${productID}&store_id=1&loc_id=${loc_id}&dineinTime=${dineinTime}&zipCode=${zipcode}&courier_type=${couriertype}`,
            constants: {
                init: "PRODUCT_DETAILS_LIST_INIT",
                success: "PRODUCT_DETAILS_LIST_SUCCESS",
                error: "PRODUCT_DETAILS_LIST_ERROR"
            },
            identifier: "PRODUCT_DETAILS_LIST",
            successCb: this.productDetailsFetchSuccess,
            errorCb: this.productDetailsFetchError,
            dontShowMessage: true
        })
        const categoryType = this.props.match.params.categoryType;

        let index = _findIndex(this.props.categoriesList, { 'category_name': categoryType })
        if (index === -1) {
            index = 0
        }
        this.setState({ tabValue: index })
        this.FooterAddButtonFunction();

        // this.setState({ size: _get(this.props, "bottleSize", null) })
        // let productIndex = _findIndex(_get(this.props, 'productDetailsData.child', []), { "bottle_size": _get(this.props, "bottleSize", null) })
        // let price = _get(this.props, `productDetailsData.child[${productIndex ? productIndex : 0}].price`, null);
        // this.setState({ price })
    }
    componentDidUpdate(prevProps, prevState) {

        const prevId = prevProps.match.params.productID;
        const currentId = this.props.match.params.productID;
        // console.log(prevId, currentId, 'pdp', prevProps);
        // const { ProductID } = this.props.match.params;
        // if (prevProps.match.params.ProductID !== ProductID) {

        if (prevState.productId !== this.state.productId) {
            this.fetchProductDetail(this.state.productId);
        } else if (prevId !== currentId) {
            this.fetchProductDetail(currentId)
        }
    }

    FooterAddButtonFunction = () => {
        let data = {
            product_id: this.props.match.params.productID,
            qty: this.state.defaultQuantity,
            api_token: localStorage.getItem("Token"),
            cart_id: localStorage.getItem("cart_id")
        };
        this.props.dispatch(commonActionCreater(data, "PRODUCT_DETAILS_FOOTER"));
    }

    updateProductId = (productId) => {
        this.setState({ productId: productId });
    }

    fetchProductRecommendations = ({ productId }) => {
        // const productID = this.state.productId;
        const productID = productId;
        const loc_id = localStorage.getItem('vendor_location_id');
        const zipcode = localStorage.getItem('zipcode');
        const limit = 10
        // this.setState({ isLoading: true });
        genericGetData({
            dispatch: this.props.dispatch,
            url: `/api/agent/recommendation?product_id=${productID}&store_id=1&loc_id=${loc_id}&zipCode=${zipcode}&limit=${limit}`,
            constants: {
                init: "PRODUCT_RECOMMENDATION_LIST_INIT",
                success: "PRODUCT_RECOMMENDATION_LIST_SUCCESS",
                error: "PRODUCT_RECOMMENDATION_LIST_ERROR"
            },
            identifier: "PRODUCT_RECOMMENDATION_LIST",
            successCb: this.productRecommendationFetchSuccess,
            errorCb: this.productRecommendationFetchError,
            dontShowMessage: true
        })
        const categoryType = this.props.match.params.categoryType;

        let index = _findIndex(this.props.categoriesList, { 'category_name': categoryType })
        if (index === -1) {
            index = 0
        }
        this.setState({ tabValue: index })
        this.FooterAddButtonFunction();

    }

    productRecommendationFetchSuccess = (data) => {
        if (_get(data, 'code') === -1) {
            this.setState({ isLoading: false });
        } else {
            const recommendations = _get(data, 'recommendations', []);
            this.setState({ recommendedProducts: recommendations, isLoading: false });
        }

        if (this.scrollToTopRef.current) {
            setTimeout(() => this.scrollToTopRef.current.scrollIntoView({ behavior: 'smooth' }), 0)
        }

    }

    productRecommendationFetchError = (error) => {
        this.setState({ isLoading: false });
    }

    productDetailsFetchSuccess = (data) => {

        // this.scrollToTopRef && this.scrollToTopRef.current && this.scrollToTopRef.current.scrollIntoView({ behavior: "smooth" });
        this.setState({ isLoading: false });
        const productId = this.props.match.params.productID;
        const payload = cleanEntityData({
            productId,
            name: _get(data, 'name'),
            price: _get(data, 'price') ? Number(_get(data, 'price')) : undefined
        })

        this.updateProductId(productId)
        ProductView(payload);
        PageView();
        const vendorList = [];
        let vendorListData = [];
        const respVendorList = _get(data, 'vendor_list', {})
        Object.keys(respVendorList).forEach(v => {
            const keyValue = respVendorList[v]
            vendorList.push({ value: keyValue[0].vendor_name, displayText: keyValue[0].vendor_name })
            _map(keyValue, kv => {
                vendorListData.push({ ...kv, 'loc_id': v })
            })
        })
        vendorListData = _sortBy(vendorListData, ['price']);
        const selectedSizeProdId = _get(data, "child[0].id", null);
        const selectedVendor = _find(vendorListData, { prod_id: selectedSizeProdId });

        let selectedProd = _find(_get(data, 'child'), { id: this.props.selectedBottleProductId });
        if (_isEmpty(selectedProd)) {
            selectedProd = _get(data, "child[0]", null);
        }
        const selectedProdId = _get(selectedProd, 'id');
        const selectedBottleSize = _get(selectedProd, 'bottle_size', null);
        // const selectedPrice = _get(selectedProd, 'price', null);

        const speedDropdown = _map(_get(selectedProd, 'speed_id', []), s => {
            return {
                displayText: _get(s, 'Type'),
                value: _get(s, 'Type'),
                loc_id: _get(s, 'Loc_id'),
                price: _get(s, 'Price'),
                active: _get(s, 'active', true),
                vendorId: _get(s, 'Vendor_id'),
                vendorName: _get(s, 'Vendor_name')
            }
        });

        // pick the cheapest speed option by numeric price (safer than taking index 0)
        let selectedSpeed = '';
        let selectedPrice = '';
        const vendorData = {
        }
        if (Array.isArray(speedDropdown) && speedDropdown.length > 0) {
            const cheapestObj = this.chooseCheapestActiveSpeed(speedDropdown);
            selectedSpeed = _get(cheapestObj, 'value', '');
            selectedPrice = _get(cheapestObj, 'price', '');
            vendorData.id = _get(cheapestObj, 'vendorId', '');
            vendorData.name = _get(cheapestObj, 'vendorName', '');
        }

        this.setState({ price: selectedPrice, size: selectedBottleSize, productID: selectedProdId, maxPrice: _get(data, "child[0].maximumprice", null), vendorList, vendorListData, selectedVendor: _get(selectedVendor, 'vendor_name'), selectedPrice: _get(selectedVendor, 'price'), speedDropdown, selectedSpeed })

        // Build a normalized map of vendor/speed combinations for easier lookup
        const productDetailMap = this.buildVendorSpeedMap(_get(data, 'child', []));
        this.setState({ productDetailMap,vendorData });

    }

    // Helper: build a map of "<size>_<speedType>" => { price, vendorId, vendorName, locId, displayText }
    buildVendorSpeedMap = (childArray = []) => {
        const map = {};
        // childArray elements contain speed_id array with info per size
        childArray.forEach((child) => {
            const size = String(_get(child, 'bottle_size', 'default'));
            const speeds = _get(child, 'speed_id', []);
            speeds.forEach((s) => {
                // create a key combining size and speed type to make it unique
                const speedType = String(_get(s, 'Type', 'default'));
                const key = `${size.toLowerCase()}_${speedType.toLowerCase()}`;
                const price = _get(s, 'Price', _get(child, 'price', null));
                const vendorId = _get(s, 'Vendor_id', '') || '';
                const vendorName = _get(s, 'Vendor_name', '') || '';
                const locId = _get(s, 'Loc_id', '') || '';
                const displayText = _get(s, 'Type', '') || '';
                const active = _get(s, 'active', false) || false;
                map[key] = {
                    price,
                    vendorId,
                    vendorName,
                    locId,
                    displayText,
                    active
                };
            });
        });

        return map;
    }

    // Helper: choose the cheapest active speed object from an array of speed items
    // Returns the whole object (or the first item if no numeric prices found)
    chooseCheapestActiveSpeed = (speedArr = []) => {
        if (!Array.isArray(speedArr) || speedArr.length === 0) return {};
        // prefer active items; if none active, use all
        const activeCandidates = speedArr.filter(s => s.active !== false);
        const source = activeCandidates.length ? activeCandidates : speedArr;

        const cheapest = source.reduce((best, cur) => {
            // skip inactive
            if (cur.active === false) return best;
            const curPrice = parseFloat(_get(cur, 'price', ''));
            const bestPrice = parseFloat(_get(best, 'price', ''));
            if (Number.isFinite(curPrice) && Number.isFinite(bestPrice)) {
                return curPrice < bestPrice ? cur : best;
            }
            return best;
        }, source[0]);

        return cheapest || source[0] || {};
    }

    productDetailsFetchError = (error) => {
        this.setState({ isLoading: false });
    }

    handleTabChange = (index) => {
        this.setState({ tabValue: index });
        let categoryName = _get(this.props, `categoriesList[${index}].category_name`, null)
        this.props.history.push(`/category/${categoryName}`)
    };
    handleupdateProductPrice = (quantity,price) =>{
        let productPrice = (quantity * parseFloat(price)).toFixed(2);
        this.setState({ productPrice });
    }
    handleQuantityChange = (quantity) => {
        this.handleupdateProductPrice(quantity,this.state.productDetailMap[`${this.state.size.toLowerCase()}_${this.state.selectedSpeed.toLowerCase()}`]?.price);
        this.setState({ defaultQuantity: quantity }, () => {
            let data = {
                product_id: this.props.match.params.productID,
                qty: this.state.defaultQuantity,
                api_token: localStorage.getItem("Token"),
                cart_id: localStorage.getItem("cart_id")
            };
            this.props.dispatch(commonActionCreater(data, "PRODUCT_DETAILS_FOOTER"));
        });
    }


    handleReviews = (reviewsList) => {
        if (!_isEmpty(reviewsList)) {
            this.setState({ showReviews: !this.state.showReviews })
        }
    }

    handleAddToCart = () => {
        // const vendorDetails = _find(this.state.vendorListData, { prod_id: this.state.productID, vendor_name: this.state.selectedVendor })
        // const selectedSpeedData = _find(this.state.speedDropdown, { value: this.state.selectedSpeed });

        let reqObj = {
            product_id: this.state.productID,
            qty: this.state.defaultQuantity,
            api_token: localStorage.getItem("Token"),
            cart_id: localStorage.getItem("cart_id"),
            zipcode: localStorage.getItem("zipcode"),
            // loc_id : localStorage.getItem('retailer'),
            // loc_id: _get(vendorDetails, 'loc_id'),
            loc_id: this.state.productDetailMap[`${this.state.size.toLowerCase()}_${this.state.selectedSpeed.toLowerCase()}`].locId,
            wallet: 0,
            speed_id: this.state.selectedSpeed
        };
        this.setState({ addToCartLoading: true });
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: reqObj,
            url: `/api/cart/addtocart`,
            constants: {
                init: "ADD_TO_CART_INIT",
                success: "ADD_TO_CART_SUCCESS",
                error: "ADD_TO_CART_ERROR"
            },
            identifier: "ADD_TO_CART",
            successCb: this.addToCartSuccess,
            errorCb: this.addToCartFailure,
            dontShowMessage: true,
        })
    }

    thumbItem = (item, i) => (
        <span key={item} onClick={() => this.Carousel.slideTo(i)}>
            *{' '}
        </span>
    )

    reactGAAddToCartEvent = () => {
        const p = this.props.productDetailsData;
        const productId = this.props.match.params.productID;
        const payload = cleanEntityData({
            productId,
            name: _get(p, 'name'),
            price: _get(p, 'price') ? Number(_get(p, 'price')) : undefined,
            quantity: this.state.defaultQuantity,
        });
        ProductAddedtoCart(payload);
    };

    addToCartSuccess = (cartData) => {

        const data = cartData[0];
        if (data.code === 1) {
            this.reactGAAddToCartEvent();
            this.setState({ addToCartLoading: false })
            localStorage.setItem("cart_id", data.cart_id);
            localStorage.setItem("total_products_in_cart", data.total_products_in_cart);
            // checking guest login
            if (_isEmpty(_get(this.props.userSignInInfo, '[0].result.api_token', ''))) {
                this.props.history.push('/guest/register')

            } else {
                localStorage.setItem('walletOrder', false);
                this.props.history.push('/cart');
            };
        }
        else {
            this.setState({ addToCartLoading: false })
            this.props.dispatch(showMessage({ text: data.message, isSuccess: false }));
            // alert(data.message);
        }

    }

    addToCartFailure = () => {
        this.setState({ addToCartLoading: false })
    }

    handleIndicator = (event) => {
        this.setState({ slideIndex: event });
    }

    handleBackAction = () => {
        let categoryName = _get(this.props, `categoriesList[${this.state.tabValue}].category_name`, null)
        let categoryID = _get(this.props, `categoriesList[${this.state.tabValue}].category_id`, null)
        this.props.history.push(`/store/category/${categoryName}/${categoryID}`)
    }

    onSubmit = async values => {
        console.log("valuessssssssssssssssssssss", values)
    }

    onSubmitQuantity = () => {

    }

    handleChangeSize = (e) => {

        let size = e.target.value;

        this.setState({ size });
        let productObj = _find(this.props.productDetailsData.child, { 'bottle_size': size });
        let selectedVendor = _find(this.state.vendorListData, { prod_id: _get(productObj, "id", "") });

        const speedDropdown = _map(_get(productObj, 'speed_id', []), s => ({
            displayText: _get(s, 'Type'),
            value: _get(s, 'Type'),
            loc_id: _get(s, 'Loc_id'),
            price: _get(s, 'Price'),
            active: _get(s, 'active', true),
            vendorId: _get(s, 'Vendor_id'),
            vendorName: _get(s, 'Vendor_name')
        }));

        // choose cheapest active speed using helper
        const cheapest = this.chooseCheapestActiveSpeed(speedDropdown);
        const selectedSpeed = _get(cheapest, 'value', '');
        const selectedPrice = _get(cheapest, 'price', '');
        const vendorData = {
            id: _get(cheapest, 'vendorId', ''),
            name: _get(cheapest, 'vendorName', ''),
        }
        // this.setState({ price: _get(productObj, "price", null), productID: _get(productObj, "id", ""), maxPrice: _get(productObj, 'maximumprice', null), selectedVendor: _get(selectedVendor, 'vendor_name'), selectedPrice: _get(productObj, 'price') });

        this.setState({ price: selectedPrice, productID: _get(productObj, "id", ""), maxPrice: _get(productObj, 'maximumprice', null), selectedVendor: _get(selectedVendor, 'vendor_name'), selectedPrice: _get(productObj, 'price'), speedDropdown, selectedSpeed, vendorData: vendorData });
        this.handleupdateProductPrice(this.state.defaultQuantity,selectedPrice);
    }

    handleChangeQuantity = (e) => {
        let qty = e.target.value;
        this.setState({ defaultQuantity: qty });
    }

    handleChangeVendor = (e) => {
        let vendor = e.target.value;
        let selectedVendor = _find(this.state.vendorListData, { prod_id: this.state.productID, vendor_name: vendor });
        this.setState({ selectedVendor: vendor, price: _get(selectedVendor, 'price') });
    }

    handleChangeSpeed = (e) => {
        let speed = e.target.value;
        // const selectedSpeed = _find(this.state.speedDropdown, { value: speed });
        const productdata = this.state.productDetailMap[`${this.state.size.toLowerCase()}_${speed.toLowerCase()}`];
        const vendorData = {
            id: productdata.vendorId,
            name: productdata.vendorName
        }
        this.setState({ selectedSpeed: speed, price: productdata.price ,vendorData: vendorData});
        this.handleupdateProductPrice(this.state.defaultQuantity,productdata.price);

    }

    handleZipLookup = (zipcode) => {
        // const { zipcode } = this.state;
        if (!zipcode || zipcode.length !== ZIPCODE_LENGTH) {
            this.props.dispatch(showMessage({ text: `Please enter a valid ${ZIPCODE_LENGTH}-digit zipcode`, isSuccess: false }));
            return;
        }
        // When user checks zipcode on the PDP, update stored zipcode and re-fetch product details
        this.setState({ zipcodeLoading: true, zipcodeInfo: null });
        // localStorage.setItem('zipcode', zipcode);

        // Re-fetch product details for current product using existing fetch flow
        const productID = this.props.match.params.productID || this.state.productId;
        const loc_id = localStorage.getItem('vendor_location_id');
        const dineinTime = localStorage.getItem('dineinTime');
        const couriertype = localStorage.getItem('couriertype');
        this.setState({ zipcodeLoading: true, zipcodeVerified: false });
        

        // Use async/await fetch logic instead of genericGetData
        (async () => {
            try {
                const response = await fetch(`${APPLICATION_BFF_URL}/connect/index/product?prodid=${productID}&store_id=1&loc_id=${loc_id}&dineinTime=${dineinTime}&zipCode=${zipcode}&courier_type=${couriertype}`);
                const data = await response.json();
                this.setState({ zipcodeLoading: false });

                if ( data?.errorCode === 1) {
                    this.setState({ zipcodeVerified: false, zipCodeMessage: data?.message || 'Invalid zipcode' });
                    return;
                }
                this.setState({ zipCodeMessage: '' }); // Clear message on success
                this.productDetailsFetchSuccess(data);
                this.setState({ zipcodeVerified: true });
                localStorage.setItem('zipcode', zipcode);
                this.props.dispatch({
                    type: "PRODUCT_DETAILS_LIST_SUCCESS",
                    data,
                    receivedAt: Date.now()
                });
            } catch (err) {
                this.productDetailsFetchError(err);
                this.setState({ zipcodeLoading: false });
            }
        })();
    }

    zipcodeFetchSuccess = (data) => {
        this.setState({ zipcodeLoading: false, zipcodeInfo: data });
        this.props.dispatch(showMessage({ text: 'Zipcode details fetched', isSuccess: true }));
    }

    zipcodeFetchError = (error) => {
        this.setState({ zipcodeLoading: false, zipcodeInfo: null });
        this.props.dispatch(showMessage({ text: 'Failed to fetch zipcode details', isSuccess: false }));
    }

    //on clicking vendor profile button , redirects to vendor landing page
    handleVendorProfileClick = async () => {
        // Extract vendor_id and zipcode from product details data
        const productDetailsData = this.props.productDetailsData;
        // const vendorId = Array.isArray(productDetailsData?.vendor_id) && productDetailsData.vendor_id.length > 0
        //     ? productDetailsData.vendor_id[0]
        //     : (productDetailsData?.vendor_data && productDetailsData.vendor_data[0]?.vendor_id) || '';
        const vendorId = this.state.vendorData?.id || '';
        const zipcode = localStorage.getItem('zipcode') || productDetailsData?.zipcode || '';
        if (!vendorId || !zipcode) {
            alert('Vendor ID or zipcode missing!');
            return;
        }
        try {
            // Pass vendorId and zipcode to the vendor landing page
            this.props.history.push({
                pathname: `/vendor/${vendorId}`,
                state: { vendorId, zipcode }
            });
        } catch (error) {
            alert('Failed to fetch vendor data.');
        }
    }

    renderContent = (quantityArr, sizeOptionsArr, productDetailsData, Ingredients, descriptionContent, vendorArr, speedArr) => {
        // let reviews = _get(productDetailsData, "reviews", []);
        // let ratingSummary = _get(productDetailsData, "rating_summary", 0);
        // console.log("productDetailsData",productDetailsData);        
        let reviews = _get(productDetailsData, "reviews", null)
        let ratingSummary = 4;
        let booziness = 20;
        let adventurousness = 30;
        let sweetness = 40;
        let difficulty = 50;
        let commonContent = <>
           <Col className="order-md-1 px-0" >
               <div className="proName  mb-3 d-flex align-items-center" >
                   {_get(productDetailsData, "name", null)}
               </div>
                {/* <div style={{ fontSize: '2.5rem', lineHeight: '3rem', fontFamily: 'sans-serif'}} className="mb-4 mt-4"> {_get(productDetailsData, 'description')}</div> */}
                {reviews?.length > 0 && <div style={{ marginBottom: 20 }}><span ><Rate disabled style={{ color: "#f63", fontSize: 18 }} value={ratingSummary} allowHalf /></span><a href="#reviews"><span className="reviewCount">{`  ${_get(productDetailsData, "review_count", "0 reviews")}`}</span></a></div>}
                <div className={`col-12 col-md-10 col-lg-8 px-0  ${this.props.classes.pdpFormSection}`}>
                    
                    <ZipcodeInput
                        zipcode={this.state.zipcode}
                        // onChange={this.handleZipChange}
                        onCheck={this.handleZipLookup}
                        loading={this.state.zipcodeLoading}
                        verified={this.state.zipcodeVerified}
                        zipcodeLength={ZIPCODE_LENGTH}
                        message={this.state.zipCodeMessage}
                    />
                    <RadioGroup
                        name="size"
                        label="SELECT SIZE"
                        direction="row"
                        value={this.state.size}
                        onChange={(val) => this.handleChangeSize({ target: { value: val } })}
                        options={(sizeOptionsArr || []).map(opt => ({ value: String(opt.value), label: opt.label }))}
                        disabled={_get(productDetailsData, "stock_status", "") !== "in stock" || !localStorage.getItem('zipcode')}
                    />
                    <RadioGroup
                        name="speed"
                        label="DELIVERY BY"
                        direction="row"
                        value={this.state.selectedSpeed}
                        onChange={(val) => this.handleChangeSpeed({ target: { value: val } })}
                        options={(this.state.speedDropdown || []).map((opt) => ({
                            value: String(opt?.value),
                            label: deliveryMethods[opt?.displayText],
                            active: this.state.productDetailMap[`${this.state.size.toLowerCase()}_${opt.displayText.toLowerCase()}`]?.active
                        }))}
                        disabled={_get(productDetailsData, "stock_status", "") !== "in stock" || !localStorage.getItem('zipcode')}
                    />
                    <div className={this.props.classes.quantityWrapper}>
                        <div style={{ fontSize: 12, fontWeight: 600 }}>QUANTITY</div>
                        <div>
                            <QuantitySelector
                                value={this.state.defaultQuantity}
                                onChange={(quantity) => this.handleQuantityChange(quantity)}
                                disabled={_get(productDetailsData, "stock_status", "") !== "in stock" || !localStorage.getItem('zipcode')}
                            />
                        </div>
                    </div>
                    <div className='d-flex align-items-center'>
                        <div className='pdp-price mr-3'><strong>$ {this.state.price} {this.state.defaultQuantity>1 ?`x${this.state.defaultQuantity}`:""}</strong></div>
                        {this.state.defaultQuantity>1 && <div className='pdp-price mr-3'> = <strong>$ {this.state.productPrice}</strong> </div>}
                    </div>
                    <div className=" mb-5 cart-btn">
                        <Button
                            disabled={_get(productDetailsData, "stock_status", "") !== "in stock" || !localStorage.getItem('zipcode')}
                            onClick={() => {
                                if (!localStorage.getItem('zipcode')) {
                                    this.props.dispatch(showMessage({ text: 'Please enter and verify zipcode before adding to cart', isSuccess: false }));
                                    return;
                                }
                                this.handleAddToCart();
                            }}
                            variant="contained"
                            className="bottomActionbutton order-1 col-12 col-md-auto order-md-2 cartActionBtn"
                            type="submit">
                            {this.state.addToCartLoading ? <CircularProgress /> : <>
                                <ShoppingCartOutlinedIcon className="iconSize mr-2"></ShoppingCartOutlinedIcon> {_get(productDetailsData, "stock_status", "") === "in stock" ? "ADD TO CART" : "OUT OF STOCK"}</>
                            }
                        </Button>
                    </div>
                    

                    
                </div>

                <div >
                    <h1 style={{ marginTop: 10, fontSize: '2rem', lineHeight: '2rem', fontFamily: 'sans-serif' }}>About the Product:</h1>
                    <div className="product-description"> {_get(productDetailsData, 'description')}</div>

                    <div className="product-properties">
                        <div className="label">Brand: </div>
                        <div>
                            <a
                            href="#!"
                            className="brand-link"
                            onClick={(e) => {
                                e.preventDefault();
                                this.handleVendorProfileClick();
                            }}
                            >
                            {this.state.vendorData?.name ? this.state.vendorData.name : _get(productDetailsData, "child[0].speed_id[0].Vendor_name", 'N/A')}
                            </a>
                        </div>
                    </div>


                    <div className='product-properties'>
                        <div className='label'>Product Type: </div>
                        <div>{_get(productDetailsData, "child[0].product_type", 'N/A')}</div>
                    </div>
                    <div className='product-properties'>
                        <div className='label'>Product Category: </div>
                        <div>{_get(productDetailsData, "child[0].product_category", 'N/A')}</div>
                    </div>
                    <div className='product-properties'>
                        <div className='label'>Country of Origin: </div>
                        <div>{_get(productDetailsData, "child[0].country_of_manufacture", 'N/A')}</div>
                    </div></div>
                {_get(productDetailsData, 'taste_scale') && <Row style={{ marginTop: 20 }}>
                    <Col xs={12} md={12} className="pr-md-5">
                        <h1>Taste Scale</h1>
                        <Progress percent={booziness} strokeColor="#f63" showInfo={false} />
                        <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "1.2px", marginBottom: 10 }}><span style={{ color: "#f63" }}>LIGHT</span><span style={{ float: "right" }}>BOOZY</span></div>
                        <Progress percent={adventurousness} strokeColor="#f63" showInfo={false} />
                        <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "1.2px", marginBottom: 10 }}><span style={{ color: "#f63" }}>CLASSIC</span><span style={{ float: "right" }}>ADVENTUROUS</span></div>
                        <Progress percent={sweetness} strokeColor="#f63" showInfo={false} />
                        <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "1.2px", marginBottom: 10 }}><span style={{ color: "#f63" }}>DRY</span><span style={{ float: "right" }}>SWEET</span></div>
                    </Col>
                </Row>}
                {_get(productDetailsData, 'skill_scale') && <Row style={{ marginTop: 20 }}>
                    <Col xs={12} md={12} className="pr-md-5">
                        <h1 className="mt-5 mt-md-0">Skill Level</h1>
                        <Progress percent={difficulty} strokeColor="#f63" showInfo={false} />
                        <div style={{ fontSize: "12px", fontWeight: "600", letterSpacing: "1.2px", marginBottom: 10 }}><span style={{ color: "#f63" }}>EASY</span><span style={{ float: "right" }}>ADVANCED</span></div>
                        {_get(productDetailsData, "time", null) &&
                            <>
                                <h1 className="mt-5">Time</h1>
                                <div style={{ letterSpacing: "1.2px" }}>{_get(productDetailsData, "time", 3)} Minutes</div></>}

                    </Col>
                </Row>}
            </Col>

            <div className="d-flex flex-wrap justify-content-between justify-content-md-start flex-md-row pt-30" >

            </div>
        </>
        return <div style={{ overflow: 'hidden', width: '100%' }}>{commonContent}</div>
    }

    render() {
        const { isLoading } = this.state;

        // const productRecommendation = _get(this.props.productDetailsRecommendationData, 'recommendations', []);
        let Ingredients = []
        const { productDetailsData } = this.props;
        let sizeList = _get(productDetailsData, "child", null);
        // Build size options as simple data objects: { value, label }
        let sizeOptionsArr = [];
        if (!_isEmpty(sizeList)) {
            
            sizeList.forEach(size => {
                const bottleSize = _get(size, 'bottle_size');
                if (bottleSize && bottleSize !== '0') {
                    sizeOptionsArr.push({ value: String(bottleSize), label: String(bottleSize) });
                }
            });
        }
        let quantityArr = [];
        let qtyList = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];
        if (!_isEmpty(qtyList)) {
            qtyList.forEach((qty) => {
                quantityArr.push(<MenuItem value={qty}>{qty}</MenuItem>);
            });
        }
        let vendorArr = [];
        if (!_isEmpty(this.state.vendorList)) {
            this.state.vendorList.forEach(v => {
                vendorArr.push(<MenuItem value={_get(v, 'value')}>{_get(v, 'displayText')}</MenuItem>);
            });
        }
        let speedArr = [];
        if (!_isEmpty(this.state.speedDropdown)) {
            this.state.speedDropdown.forEach(v => {
                speedArr.push(<MenuItem value={_get(v, 'value')}>{deliveryMethods[`${_get(v, 'displayText')}`]}</MenuItem>);
            });
        }
        let productImages = [];
        if (!_isEmpty(productDetailsData.images)) {
            productDetailsData.images.forEach((image) => {
                productImages.push(
                    <div className=" d-flex justify-content-between flex-column align-items-center h-100 ">
                        <img src={image} className="img-responsive" alt="Product" />
                    </div>
                );
            });
        }

        let decriptionArray = [];
        let descriptionSplit = _get(productDetailsData, "description", "").split('\r\n');
        if (!_isEmpty(descriptionSplit)) {
            descriptionSplit.forEach((review) => {
                if (review !== null && review !== undefined && review !== "") {
                    decriptionArray.push(review);
                }
            });
        }

        let descriptionContent = decriptionArray.map((data, index) => (<React.Fragment>
            <li>{data}</li>
        </React.Fragment>));

        let imageArr = _reduce(_get(productDetailsData, 'image', []), (acc, im) => {
            if (im.hasOwnProperty('thumbnail')) {
                acc.push(_get(im, 'thumbnail'));
                // thumbnail = _get(im, 'thumbnail');
            } else if (im.hasOwnProperty('base_image')) {
                acc.push(_get(im, 'base_image'))
            } else if (im.hasOwnProperty('small_image')) {
                acc.push(_get(im, 'small_image'))
            } else if (im.hasOwnProperty('additional_images')) {
                // acc.push(_get(im, 'additional_images'));
                _map(_get(im, 'additional_images', []), a => {
                    acc.push(_get(a, 'additional_image'));
                })
            }
            return acc;

        }, []);

        // console.log(imageArr, 'image arr');
        let thumbImages = _map(imageArr, s => cleanEntityData({
            original: s,
            thumbnail: s
        }));

        return (

            <React.Fragment >

                <div className="page-content-container">
                    <Container fluid={true} className="productDetails" >
                        {isLoading ? <LoaderOverLay /> :
                            <>
                                <div ref={this.scrollToTopRef}></div> {/* Empty div to mark the top of the page */}
                                <Row className="no-gutters justify-content-lg-between secMinHeight">
                                    <Col xs={12} md={5} xl={6}>

                                        <div className="productImgSection proDetailSec">
                                            {/* <img src={_get(productDetailsData, 'child.0.image')} className={_get(productDetailsData, "stock_status", "") == "in stock" ? "imgProduct" : "imgProductOutOfStock"}></img> */}
                                            {/* <img src={thumbnail} className={_get(productDetailsData, "stock_status", "") == "in stock" ? "imgProduct" : "imgProductOutOfStock"}></img> */}
                                            <ImageGallery items={thumbImages} thumbnailPosition="left" showNav={false}
                                                showFullscreenButton={false}
                                                showPlayButton={false} />
                                        </div>
                                    </Col>

                                    <Col xs={12} md={7} xl={6} className="pl-md-5 py-4 py-md-0 d-flex">
                                        {this.renderContent(quantityArr, sizeOptionsArr, productDetailsData, Ingredients, descriptionContent, vendorArr, speedArr)}
                                    </Col>

                                </Row>
                                {/* {productRecommendation?.length > 0 && <Row className="no-gutters justify-content-lg-between secMinHeight">
                                    <div className="proName  mb-3 d-flex align-items-center" >
                                        Similar Items you may like
                                    </div>
                                    <div className="page-content-container">
                                        <TopCategoryComponent
                                            {...this.props}
                                            // productsperadd={_get(productDetailsData, "related_products", [])}
                                            // productsperadd={this.state.recommendedProducts}
                                            productsperadd={productRecommendation}
                                            updateProductId={this.updateProductId}
                                        />
                                    </div>
                                </Row>}</>} */}
                                {_get(productDetailsData, "related_products", [])?.length > 0 && <Row className="no-gutters justify-content-lg-between secMinHeight">
                                    <div className="proName  mb-3 d-flex align-items-center" >
                                        Similar Items you may like
                                    </div>
                                    <div className="page-content-container">
                                        <TopCategoryComponent
                                            {...this.props}
                                            productsperadd={_get(productDetailsData, "related_products", [])}
                                            updateProductId={this.updateProductId}
                                        />
                                    </div>
                                </Row>}</>}

                        {/* {related_products?.length > 0 && <Row className="no-gutters justify-content-lg-between secMinHeight">
                                    <div className="proName  mb-3 d-flex align-items-center" >
                                        Similar Items you may like
                                    </div>
                                    <div className="page-content-container">
                                        <TopCategoryComponent
                                            {...this.props}
                                            productsperadd={related_products}
                                        />
                                    </div>
                                </Row>}</>} */}
                    </Container>
                </div>
            </React.Fragment>

        );
    }
}

function mapStateToProps(state) {
    let productDetailsData = _get(state, 'productDetails.lookUpData');
    let productDetailsRecommendationData = _get(state, 'productDetailsRecommendation.lookUpData', {});
    let categoriesList = _get(state, 'categoriesList.lookUpData.data');
    let userSignInInfo = _get(state, 'userSignInInfo.lookUpData', []);
    let bottleSize = _get(state, 'bottleSize.lookUpData', {});
    let selectedBottleProductId = _get(state, 'bottleID.lookUpData', {});
    return { productDetailsData, categoriesList, userSignInInfo, bottleSize, selectedBottleProductId, productDetailsRecommendationData }
}
export default connect(mapStateToProps)(withStyles(styles)(ProductDetails));