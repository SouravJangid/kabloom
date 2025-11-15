// import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
// import LocationOnIcon from '@material-ui/icons/LocationOn';
// import StarHalfIcon from '@material-ui/icons/StarHalf';
// import StarBorderIcon from '@material-ui/icons/StarBorder';
// import StarIcon from '@material-ui/icons/Star';
// import LocalShippingIcon from '@material-ui/icons/LocalShipping';
// import NatureIcon from '@material-ui/icons/Nature';
// import ShareIcon from '@material-ui/icons/Share';
// import { connect } from 'react-redux';
// import {
//     map as _map,
//     get as _get,
//     isEmpty as _isEmpty,
//     find as _find,
//     reduce as _reduce,
//     filter as _filter,
//     uniqBy as _uniqBy
// } from 'lodash';
// import { Container, Row, Col, Button } from 'reactstrap';
// import ImageGallery from 'react-image-gallery';
// import "react-image-gallery/styles/css/image-gallery.css";
// import CircularProgress from '@material-ui/core/CircularProgress';
// import { isMobile } from 'react-device-detect';
// import '../../App.css';
// import genericGetData from "../../Redux/Actions/genericGetData";
// import { genericPostData } from "../../Redux/Actions/genericPostData";
// import { LoaderOverLay } from '../../Global/UIComponents/LoaderHoc';
// import { cleanEntityData } from '../../Global/helper/commonUtil';
// import QuantitySelector from './QuantitySelector';
// import ZipcodeInput from './ZipcodeInput';
// import showMessage from '../../Redux/Actions/toastAction';
// import { APPLICATION_BFF_URL } from '../../Redux/urlConstants';
// import { ProductView, PageView, ProductAddedtoCart } from '../../Global/helper/react-ga';
// import ManufacturerInfo from './ManufacturerInfo';
// import ProductCard from './ProductCard';
// import ReviewsComponent from './ReviewsComponent';
// import './ProductDetails.scss';

// const ZIPCODE_LENGTH = 5;

// const ProductDetails = ({
//     dispatch,
//     productDetailsData = {},
//     userSignInInfo = [],
//     match,
//     history,
// }) => {
//     const [state, setState] = useState({
//         isLoading: true,
//         defaultQuantity: 1,
//         price: '',
//         productID: '',
//         size: '',
//         selectedSpeed: '',
//         speedDropdown: [],
//         productDetailMap: {},
//         vendorData: {},
//         zipcode: localStorage.getItem('zipcode') || '',
//         zipcodeLoading: false,
//         zipcodeVerified: false,
//         zipCodeMessage: '',
//         addToCartLoading: false,
//         productPrice: '',
//         //
//         deliveryOptions: {
//             local: false,
//             next_day: false,
//             farm_direct: false,
//             serviceable_zipcode: false
//         },
//         deliveryLoading: false,
//     });

//     const prevProductIdRef = useRef();
//     const galleryRef = useRef(null);
//     const [isShareClicked, setIsShareClicked] = useState(false);
//     const [showCopiedLabel, setShowCopiedLabel] = useState(false);
//     const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

//     // ====================== VARIANTS LOGIC ======================
//     const children = useMemo(() => {
//         const products = _get(productDetailsData, 'variation_family.products', []);
//         return Array.isArray(products) ? products : [];
//     }, [productDetailsData]);

//     const colorOptions = useMemo(() => _uniqBy(
//         children.map(child => ({
//             name: _get(child, 'color_theme', 'Unknown'),
//             id: child.id,
//             image: _get(child, 'image[0].small_image', ''),
//         })), 'name'), [children]);

//     const [selectedColor, setSelectedColor] = useState('');
//     const [selectedSize, setSelectedSize] = useState('');
//     const [selectedStyle, setSelectedStyle] = useState('');

//     const filteredByColor = useMemo(() =>
//         selectedColor ? _filter(children, c => _get(c, 'color_theme') === selectedColor) : children,
//         [children, selectedColor]
//     );

//     const sizeOptions = useMemo(() => _uniqBy(
//         filteredByColor.map(c => ({ name: _get(c, 'size', 'N/A'), id: c.id })), 'name'),
//         [filteredByColor]
//     );

//     const filteredBySize = useMemo(() =>
//         selectedSize ? _filter(filteredByColor, c => String(_get(c, 'size')) === String(selectedSize)) : filteredByColor,
//         [filteredByColor, selectedSize]
//     );

//     const styleOptions = useMemo(() => _uniqBy(
//         filteredBySize.map(c => ({ name: _get(c, 'style', 'N/A'), id: c.id })), 'name'),
//         [filteredBySize]
//     );

//     const selectedChild = useMemo(() => {
//         return _find(children, c =>
//             _get(c, 'color_theme') === selectedColor &&
//             String(_get(c, 'size')) === String(selectedSize) &&
//             _get(c, 'style') === selectedStyle
//         ) || filteredBySize[0] || filteredByColor[0] || children[0] || {};
//     }, [children, selectedColor, selectedSize, selectedStyle, filteredBySize, filteredByColor]);

//     // Auto-select first variant
//     useEffect(() => {
//         if (children.length && !selectedColor) {
//             const first = children[0];
//             setSelectedColor(_get(first, 'color_theme'));
//             setSelectedSize(_get(first, 'size'));
//             setSelectedStyle(_get(first, 'style'));
//         }
//     }, [children, selectedColor]);

//     useEffect(() => {
//         if (selectedColor && filteredByColor.length) {
//             const first = filteredByColor[0];
//             setSelectedSize(_get(first, 'size'));
//             setSelectedStyle(_get(first, 'style'));
//         }
//     }, [selectedColor, filteredByColor]);

//     useEffect(() => {
//         if (selectedSize && filteredBySize.length) {
//             const first = filteredBySize[0];
//             setSelectedStyle(_get(first, 'style'));
//         }
//     }, [selectedSize, filteredBySize]);

//     // ====================== PRICE & SPEED ======================
//     const pickDefaultSpeed = (speeds = []) => {
//         const active = Array.isArray(speeds) ? speeds.filter(s => s.active) : [];
//         const nextDay = active.find(s => s.Type?.toLowerCase() === 'next day');
//         const sameDay = active.find(s => s.Type?.toLowerCase() === 'same day');
//         return nextDay || sameDay || active[0] || {};
//     };

//     useEffect(() => {
//         const speedObj = pickDefaultSpeed(_get(selectedChild, 'speed_id', []));
//         const basePrice = _get(speedObj, 'Price', _get(selectedChild, 'price', 0));
//         const total = (state.defaultQuantity * parseFloat(basePrice || 0)).toFixed(2);

//         setState(prev => ({
//             ...prev,
//             size: _get(selectedChild, 'size'),
//             productID: _get(selectedChild, 'id'),
//             price: basePrice,
//             productPrice: total,
//             selectedSpeed: _get(speedObj, 'Type', ''),
//             speedDropdown: _map(_get(selectedChild, 'speed_id', []), s => ({
//                 value: _get(s, 'Type'),
//                 price: _get(s, 'Price'),
//                 active: _get(s, 'active', true),
//                 vendorId: _get(s, 'Vendor_id'),
//                 vendorName: _get(s, 'Vendor_name'),
//             })),
//             vendorData: {
//                 id: _get(speedObj, 'Vendor_id'),
//                 name: _get(speedObj, 'Vendor_name')
//             },
//         }));
//     }, [selectedChild, state.defaultQuantity]);

//     // ====================== SHARE ======================
//     const handleShare = useCallback(() => {
//         const productUrl = `${window.location.origin}/store/${match.params.productID}`;
//         setIsShareClicked(true);
//         setTimeout(() => setIsShareClicked(false), 300);
//         setShowCopiedLabel(true);
//         setTimeout(() => setShowCopiedLabel(false), 2000);
//         navigator.clipboard.writeText(productUrl).catch(() => {
//             const ta = document.createElement('textarea');
//             ta.value = productUrl;
//             document.body.appendChild(ta);
//             ta.select();
//             document.execCommand('copy');
//             document.body.removeChild(ta);
//         });
//     }, [match.params.productID]);

//     // ====================== FETCH PRODUCT ======================
//     const fetchProduct = useCallback((productId) => {
//         const loc_id = localStorage.getItem('vendor_location_id') || '';
//         const dineinTime = localStorage.getItem('dineinTime') || '';
//         const zipcode = localStorage.getItem('zipcode') || '';
//         const couriertype = localStorage.getItem('couriertype') || '';

//         setState(prev => ({ ...prev, isLoading: true }));
//         genericGetData({
//             dispatch,
//             url: `/connect/index/product?prodid=37529&store_id=1&loc_id=${loc_id}&dineinTime=${dineinTime}&zipCode=${zipcode}&courier_type=${couriertype}`,
//             constants: {
//                 init: "PRODUCT_DETAILS_LIST_INIT",
//                 success: "PRODUCT_DETAILS_LIST_SUCCESS",
//                 error: "PRODUCT_DETAILS_LIST_ERROR",
//             },
//             identifier: "PRODUCT_DETAILS_LIST",
//             successCb: () => {
//                 setState(prev => ({ ...prev, isLoading: false }));
//                 ProductView(cleanEntityData({
//                     productId,
//                     name: _get(selectedChild, 'name'),
//                     price: state.price
//                 }));
//                 PageView();
//             },
//             errorCb: () => setState(prev => ({ ...prev, isLoading: false })),
//             dontShowMessage: true,
//         });
//     }, [dispatch, selectedChild, state.price]);

//     useEffect(() => {
//         const currentId = match.params.productID;
//         if (prevProductIdRef.current !== currentId && currentId) {
//             prevProductIdRef.current = currentId;
//             fetchProduct(currentId);
//         }
//     }, [match.params.productID, fetchProduct]);

//     // ====================== ZIPCODE & DELIVERY CHECK ======================
//     const checkDeliveryOptions = useCallback((zipcode) => {
//         if (!zipcode || zipcode.length !== ZIPCODE_LENGTH) {
//             dispatch(showMessage({ text: `Enter a ${ZIPCODE_LENGTH}-digit zipcode`, isSuccess: false }));
//             return;
//         }

//         if (!selectedChild.id) {
//             setState(prev => ({ ...prev, zipCodeMessage: 'Product not loaded yet' }));
//             return;
//         }

//         const loc_id = localStorage.getItem('vendor_location_id') || '';
//         if (!loc_id) {
//             setState(prev => ({ ...prev, zipCodeMessage: 'Location not available' }));
//             return;
//         }

//         setState(prev => ({
//             ...prev,
//             deliveryLoading: true,
//             zipcodeVerified: false,
//             zipCodeMessage: '',
//         }));

//         const queryParams = new URLSearchParams({
//             product_id: selectedChild.id,
//             location_ids: loc_id,
//             zipcode,
//             store_id: '1',
//         }).toString();

//         genericPostData({
//             dispatch,
//             reqObj: {},
//             url: `/connect/index/checkDeliveryOptions?${queryParams}`,
//             constants: { init: 'CHECK_DELIVERY_INIT', success: 'CHECK_DELIVERY_SUCCESS', error: 'CHECK_DELIVERY_ERROR' },
//             identifier: 'CHECK_DELIVERY',
//             dontShowMessage: true,
//             successCb: (responseArray) => {
//                 const response = Array.isArray(responseArray) ? responseArray[0] : responseArray;
//                 const data = response?.data || {};
//                 const serviceable = !!data.serviceable_zipcode;

//                 setState(prev => ({
//                     ...prev,
//                     deliveryLoading: false,
//                     zipcodeVerified: serviceable,
//                     zipCodeMessage: serviceable ? '' : (response.message || 'Delivery not available'),
//                     deliveryOptions: {
//                         local: !!data.local,
//                         next_day: !!data.next_day,
//                         farm_direct: !!data.farm_direct,
//                         serviceable_zipcode: serviceable,
//                     },
//                     zipcode,
//                 }));

//                 if (serviceable) {
//                     localStorage.setItem('zipcode', zipcode);
//                 }
//             },
//             errorCb: (err) => {
//                 setState(prev => ({
//                     ...prev,
//                     deliveryLoading: false,
//                     zipcodeVerified: false,
//                     zipCodeMessage: err?.message || 'Network error',
//                 }));
//             },
//         });
//     }, [dispatch, selectedChild.id]); // ← Now safe



//     useEffect(() => {
//         const savedZip = localStorage.getItem('zipcode');
//         if (savedZip && savedZip.length === ZIPCODE_LENGTH && selectedChild.id && !state.zipcodeVerified) {

//             const timer = setTimeout(() => checkDeliveryOptions(savedZip), 300);
//             return () => clearTimeout(timer);
//         }
//     }, [selectedChild.id, state.zipcodeVerified, checkDeliveryOptions]);

//     // Save vendor_location_id
//     useEffect(() => {
//         const productLocId = _get(selectedChild, 'location_id');
//         const speedLocId = _get(pickDefaultSpeed(_get(selectedChild, 'speed_id', [])), 'Loc_id');
//         const finalLocId = speedLocId || productLocId;
//         if (finalLocId) localStorage.setItem('vendor_location_id', finalLocId);
//     }, [selectedChild]);

//     // ====================== HANDLERS ======================
//     const onQuantityChange = useCallback((qty) => {
//         const numQty = Number(qty) || 1;
//         setState(prev => ({
//             ...prev,
//             defaultQuantity: numQty,
//             productPrice: (numQty * parseFloat(prev.price || 0)).toFixed(2)
//         }));
//     }, []);
//     const onSpeedChange = useCallback((speedType) => {
//         const speedObj = _find(_get(selectedChild, 'speed_id', []), { Type: speedType });
//         if (!speedObj) return;
//         const basePrice = _get(speedObj, 'Price', _get(selectedChild, 'price', 0));
//         const total = (state.defaultQuantity * parseFloat(basePrice || 0)).toFixed(2);
//         setState(prev => ({
//             ...prev,
//             selectedSpeed: speedType,
//             price: basePrice,
//             productPrice: total,
//             vendorData: { id: _get(speedObj, 'Vendor_id'), name: _get(speedObj, 'Vendor_name') },
//         }));
//     }, [selectedChild, state.defaultQuantity]);

//     // const onAddToCart = useCallback(() => {
//     //     if (!state.zipcodeVerified) {
//     //         dispatch(showMessage({ text: 'Please verify zipcode first', isSuccess: false }));
//     //         return;
//     //     }

//     //     const mapKey = `${state.size?.toLowerCase()}_${state.selectedSpeed?.toLowerCase()}`;
//     //     const locId = state.vendorData.id ||
//     //         state.productDetailMap[mapKey]?.locId ||
//     //         localStorage.getItem('vendor_location_id') ||
//     //         '7224';

//     //     const req = {
//     //         product_id: selectedChild.id,
//     //         qty: Number(state.defaultQuantity),
//     //         api_token: localStorage.getItem('token') || '',
//     //         cart_id: localStorage.getItem('cart_id') || '',
//     //         zipcode: localStorage.getItem('zipcode'),
//     //         loc_id: locId,
//     //         wallet: 0,
//     //         speed_id: state.selectedSpeed,
//     //         store_id: 1
//     //     };

//     //     console.log('Add to Cart Request:', req); // ← Remove in prod

//     //     setState(prev => ({ ...prev, addToCartLoading: true }));

//     //     genericPostData({
//     //         dispatch,
//     //         reqObj: req,
//     //         url: `/api/cart/addtocart`,
//     //         constants: { init: 'ADD_TO_CART_INIT', success: 'ADD_TO_CART_SUCCESS', error: 'ADD_TO_CART_ERROR' },
//     //         identifier: 'ADD_TO_CART',
//     //         successCb: ([{ code, message, cart_id, total_products_in_cart }]) => {
//     //             setState(prev => ({ ...prev, addToCartLoading: false }));
//     //             if (code === 1) {
//     //                 ProductAddedtoCart(cleanEntityData({
//     //                     productId: match.params.productID,
//     //                     name: _get(selectedChild, 'name'),
//     //                     price: state.price,
//     //                     quantity: state.defaultQuantity,
//     //                 }));
//     //                 localStorage.setItem('cart_id', cart_id);
//     //                 localStorage.setItem('total_products_in_cart', total_products_in_cart);
//     //                 if (_isEmpty(_get(userSignInInfo, '[0].result.api_token', ''))) {
//     //                     history.push('/guest/register');
//     //                 } else {
//     //                     history.push('/cart');
//     //                 }
//     //             } else {
//     //                 dispatch(showMessage({ text: message, isSuccess: false }));
//     //             }
//     //         },
//     //         errorCb: () => setState(prev => ({ ...prev, addToCartLoading: false })),
//     //         dontShowMessage: true,
//     //     });
//     // }, [
//     //     dispatch, history, match.params.productID, selectedChild,
//     //     state.defaultQuantity, state.price, state.selectedSpeed, state.size,
//     //     state.zipcodeVerified, state.vendorData.id, state.productDetailMap,
//     //     userSignInInfo
//     // ]);
//     const onAddToCart = useCallback(() => {
//         if (!state.zipcodeVerified) {
//             dispatch(showMessage({ text: 'Please verify zipcode first', isSuccess: false }));
//             return;
//         }

//         const locId = state.vendorData.id || localStorage.getItem('vendor_location_id') || '';

//         const req = {
//             product_id: selectedChild.id,
//             qty: Number(state.defaultQuantity) || 1, // ← FIXED: Convert to number
//             api_token: localStorage.getItem('token') || '', // ← FIXED: lowercase 'token'
//             cart_id: localStorage.getItem('cart_id') || '',
//             zipcode: localStorage.getItem('zipcode'),
//             loc_id: locId,
//             wallet: 0,
//             speed_id: state.selectedSpeed,
//             store_id: 1 // ← Add store_id if backend expects it
//         };

//         console.log('Add to Cart Request:', req); // ← Remove in production

//         setState(prev => ({ ...prev, addToCartLoading: true }));

//         genericPostData({
//             dispatch,
//             reqObj: req,
//             url: `/api/cart/addtocart`,
//             constants: { init: 'ADD_TO_CART_INIT', success: 'ADD_TO_CART_SUCCESS', error: 'ADD_TO_CART_ERROR' },
//             identifier: 'ADD_TO_CART',
//             successCb: ([{ code, message, cart_id, total_products_in_cart }]) => {
//                 setState(prev => ({ ...prev, addToCartLoading: false }));
//                 if (code === 1) {
//                     ProductAddedtoCart(
//                         cleanEntityData({
//                             productId: match.params.productID,
//                             name: _get(selectedChild, 'name'),
//                             price: state.price,
//                             quantity: Number(state.defaultQuantity),
//                         })
//                     );
//                     localStorage.setItem('cart_id', cart_id);
//                     localStorage.setItem('total_products_in_cart', total_products_in_cart);

//                     if (_isEmpty(_get(userSignInInfo, '[0].result.api_token', ''))) {
//                         history.push('/guest/register');
//                     } else {
//                         history.push('/cart');
//                     }
//                 } else {
//                     dispatch(showMessage({ text: message, isSuccess: false }));
//                 }
//             },
//             errorCb: (err) => {
//                 setState(prev => ({ ...prev, addToCartLoading: false }));
//                 dispatch(showMessage({
//                     text: err?.message || 'Failed to add to cart',
//                     isSuccess: false
//                 }));
//             },
//             dontShowMessage: true,
//         });
//     }, [
//         dispatch,
//         history,
//         match.params.productID,
//         selectedChild,
//         state.defaultQuantity,
//         state.price,
//         state.selectedSpeed,
//         state.zipcodeVerified,
//         state.vendorData.id,
//         userSignInInfo
//     ]);

//     // ====================== GALLERY ======================
//     const imageArr = useMemo(() => _reduce(_get(selectedChild, 'image', []), (acc, im) => {
//         if (im?.small_image) acc.push(im.small_image);
//         else if (im?.additional_images) {
//             _map(im.additional_images, a => a?.additional_image && acc.push(a.additional_image));
//         }
//         return acc;
//     }, []), [selectedChild]);

//     const galleryItems = useMemo(() => _map(imageArr, (url, i) => {
//         if (!url) return null;
//         const separator = url.includes('?') ? '&' : '?';
//         const thumbnail = `${url}${separator}width=100&height=100&quality=80`;
//         return { original: url, thumbnail, originalAlt: `Product ${i + 1}`, thumbnailAlt: `Thumb ${i + 1}` };
//     }).filter(Boolean), [imageArr]);

//     const safeGet = (obj, path, fallback = 'N/A') => {
//         const v = _get(obj, path);
//         return v === null || v === undefined || v === '' ? fallback : v;
//     };

//     const inStock = _get(selectedChild, 'stock_availability', '').toLowerCase() === 'in stock';
//     const zipVerified = state.zipcodeVerified;

//     // ====================== RENDER ======================
//     if (state.isLoading) return <LoaderOverLay />;
//     if (_isEmpty(productDetailsData)) {
//         return <div style={{ padding: '2rem', textAlign: 'center' }}>Product not found</div>;
//     }

//     return (
//         <div className="page-content-container">
//             <Container fluid className="productDetails">
//                 <Row className="no-gutters justify-content-lg-between secMinHeight w-100 main-conainer">
//                     {/* IMAGE GALLERY */}
//                     <Col lg="4" className={`pdp-image-galary ${isLargeScreen ? 'sticky-left' : ''}`}>
//                         <div className="proName top">{safeGet(selectedChild, 'name')}</div>
//                         <div className="productImgSection proDetailSec">
//                             <ImageGallery
//                                 key={selectedChild.id}
//                                 ref={galleryRef}
//                                 items={galleryItems}
//                                 thumbnailPosition="left"
//                                 showBullets={isMobile}
//                                 showNav={false}
//                                 showFullscreenButton={false}
//                                 showPlayButton={false}
//                                 lazyLoad={true}
//                                 infinite={false}
//                                 useBrowserFullscreen={true}
//                                 renderItem={(item) => (
//                                     <div className="image-gallery-image">
//                                         <img src={item.original} alt={item.originalAlt} loading="lazy"
//                                             style={{ width: '100%', height: 'auto', objectFit: 'contain' }} />
//                                     </div>
//                                 )}
//                             />
//                             <Button className={`shareBtn ${isShareClicked ? 'clicked' : ''}`} onClick={handleShare}>
//                                 <ShareIcon />
//                                 {showCopiedLabel && <div className="share-copied-label">Link copied!</div>}
//                             </Button>
//                         </div>
//                     </Col>

//                     {/* PRODUCT INFO */}
//                     <Col className="pdp-info">
//                         <div className="w-100">
//                             <div className="proName mid">{safeGet(selectedChild, 'name')}</div>

//                             {/* RATING */}
//                             <div className="rating-summary">
//                                 <div className="rating-stars">
//                                     <span className="rating-value">
//                                         {(() => {
//                                             const r = parseFloat(_get(selectedChild, 'reviews.rating_summary', 0)) || 0;
//                                             return r > 0 ? (r / 20).toFixed(1) : '0.0';
//                                         })()}
//                                     </span>
//                                     {(() => {
//                                         const r = parseFloat(_get(selectedChild, 'reviews.rating_summary', 0)) || 0;
//                                         const full = Math.floor(r / 20);
//                                         return [...Array(full)].map((_, i) => <StarIcon key={i} className="star full" />);
//                                     })()}
//                                     {(() => {
//                                         const r = parseFloat(_get(selectedChild, 'reviews.rating_summary', 0)) || 0;
//                                         return r % 20 >= 10 ? <StarHalfIcon className="star half" /> : null;
//                                     })()}
//                                     {(() => {
//                                         const r = parseFloat(_get(selectedChild, 'reviews.rating_summary', 0)) || 0;
//                                         const full = Math.floor(r / 20);
//                                         const hasHalf = r % 20 >= 10;
//                                         const empty = 5 - full - (hasHalf ? 1 : 0);
//                                         return [...Array(empty)].map((_, i) => <StarBorderIcon key={i} className="star empty" />);
//                                     })()}
//                                     <ExpandMoreIcon className="dropdown-icon" />
//                                     <span className="rating-count">
//                                         {_get(selectedChild, 'reviews.review_count', '0 Reviews').replace(' Reviews', '')} ratings
//                                     </span>
//                                 </div>
//                                 <div className="bought-info"><strong>50 bought</strong> in past month</div>
//                             </div>

//                             <div className="pdpFormSection">
//                                 {/* PRICE */}
//                                 <div className="price-section">
//                                     <span className="main-price">
//                                         <span className="currency">$</span>
//                                         <span className="price-int">{Math.floor(parseFloat(state.price || 0))}</span>
//                                         <sup className="price-dec">{(parseFloat(state.price || 0) % 1).toFixed(2).split('.')[1]}</sup>
//                                         <span className="per-count">(${parseFloat(state.price || 0).toFixed(2)}/count)</span>
//                                     </span>
//                                 </div>
//                                 <hr />

//                                 {/* COLOR */}
//                                 <div className="option-section">
//                                     <h4>Color <span className="selected">{selectedColor}</span></h4>
//                                     <div className="option-grid">
//                                         {colorOptions.map(opt => (
//                                             <div
//                                                 key={opt.name}
//                                                 className={`option-card ${selectedColor === opt.name ? 'selected' : ''}`}
//                                                 onClick={() => setSelectedColor(opt.name)}
//                                             >
//                                                 <img src={opt.image} alt={opt.name} className="option-img" />
//                                                 <hr />
//                                                 <p>{opt.name}</p>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* SIZE */}
//                                 <div className="option-section">
//                                     <h4>Size <span className="selected">{selectedSize}</span></h4>
//                                     <div className="option-grid small">
//                                         {sizeOptions
//                                             .sort((a, b) => parseFloat(a.name) - parseFloat(b.name))
//                                             .map(opt => {
//                                                 const isSel = String(selectedSize) === String(opt.name);
//                                                 const childForSize = _find(children, c =>
//                                                     _get(c, 'color_theme') === selectedColor &&
//                                                     String(_get(c, 'size')) === String(opt.name)
//                                                 );
//                                                 const speedObj = pickDefaultSpeed(_get(childForSize, 'speed_id', []));
//                                                 const price = _get(speedObj, 'Price', _get(childForSize, 'price', 0));
//                                                 return (
//                                                     <div
//                                                         key={opt.name}
//                                                         className={`option-card size ${isSel ? 'selected' : ''}`}
//                                                         onClick={() => setSelectedSize(opt.name)}
//                                                     >
//                                                         <div className="size-label">{opt.name}</div>
//                                                         <hr />
//                                                         <div className="size-info">
//                                                             <div>${parseFloat(price || 0).toFixed(2)}</div>
//                                                             <div>(${parseFloat(price || 0).toFixed(2)} / count)</div>
//                                                         </div>
//                                                     </div>
//                                                 );
//                                             })}
//                                     </div>
//                                 </div>

//                                 {/* STYLE */}
//                                 <div className="option-section">
//                                     <h4>Style <span className="selected">{selectedStyle}</span></h4>
//                                     <div className="option-grid">
//                                         {styleOptions.map(opt => (
//                                             <div
//                                                 key={opt.name}
//                                                 className={`option-card ${selectedStyle === opt.name ? 'selected' : ''}`}
//                                                 onClick={() => setSelectedStyle(opt.name)}
//                                             >
//                                                 <img src={_get(selectedChild, 'image[0].small_image', '')} alt={opt.name} className="option-img" />
//                                                 <hr />
//                                                 <p>{opt.name}</p>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>

//                                 {/* DELIVERY OPTIONS */}
//                                 {state.zipcodeVerified && (
//                                     <div className="option-section">
//                                         <h4>Delivery Options</h4>
//                                         {state.deliveryLoading ? (
//                                             <div className="delivery-loading">
//                                                 <CircularProgress size={20} /> Checking...
//                                             </div>
//                                         ) : (
//                                             <div className="option-grid">
//                                                 {state.deliveryOptions.local && (
//                                                     <div className="option-card selected">
//                                                         <LocationOnIcon fontSize="large" className="option-icon" />
//                                                         <p className="delivery-type">Same Day</p>
//                                                         <span className="delivery-note">Nationwide fast delivery</span>
//                                                     </div>
//                                                 )}
//                                                 {state.deliveryOptions.next_day && (
//                                                     <div className="option-card selected">
//                                                         <LocalShippingIcon fontSize="large" className="option-icon" />
//                                                         <p className="delivery-type">Next Day</p>
//                                                         <span className="delivery-note">Hand delivery</span>
//                                                     </div>
//                                                 )}
//                                                 {state.deliveryOptions.farm_direct && (
//                                                     <div className="option-card selected">
//                                                         <NatureIcon fontSize="large" className="option-icon" />
//                                                         <p className="delivery-type">Farm Direct</p>
//                                                         <span className="delivery-note">Fresh from farm</span>
//                                                     </div>
//                                                 )}
//                                                 {!state.deliveryOptions.local && !state.deliveryOptions.next_day && !state.deliveryOptions.farm_direct && (
//                                                     <p className="no-delivery">Delivery not available</p>
//                                                 )}
//                                             </div>
//                                         )}
//                                     </div>
//                                 )}
//                             </div>

//                             {/* PRODUCT PROPERTIES */}
//                             <div className="product-properties"><div className="label">Brand:</div><div>{safeGet(selectedChild, "brand_name")}</div></div>
//                             <div className="product-properties"><div className="label">Color:</div><div>{selectedColor}</div></div>
//                             <div className="product-properties"><div className="label">Size:</div><div>{selectedSize}</div></div>
//                             <div className="product-properties"><div className="label">Style:</div><div>{selectedStyle}</div></div>
//                             <hr />
//                             <h1 className="sectionTitle">About this item:</h1>
//                             <div className="product-description">{safeGet(selectedChild, 'short_description')}</div>
//                             <hr />
//                         </div>
//                     </Col>

//                     {/* BUY BOX */}
//                     <Col lg="3" className={`pdp-buy ${isLargeScreen ? 'sticky-right' : ''}`}>
//                         <div className="free-delivery-banner">
//                             <div className="price-section">
//                                 <span className="main-price">
//                                     <span className="currency">$</span>
//                                     <span className="price-int">{Math.floor(parseFloat(state.price || 0))}</span>
//                                     <sup className="price-dec">{(parseFloat(state.price || 0) % 1).toFixed(2).split('.')[1]}</sup>
//                                     <span className="per-count">(${parseFloat(state.price || 0).toFixed(2)}/count)</span>
//                                 </span>
//                             </div>

//                             <div className="location">
//                                 <ZipcodeInput
//                                     zipcode={state.zipcode}
//                                     onCheck={checkDeliveryOptions}
//                                     onZipChange={() => setState(prev => ({
//                                         ...prev,
//                                         zipcodeVerified: false,
//                                         zipCodeMessage: '',
//                                         deliveryOptions: { local: false, next_day: false, farm_direct: false, serviceable_zipcode: false },
//                                         deliveryLoading: false,
//                                     }))}
//                                     loading={state.deliveryLoading}
//                                     verified={state.zipcodeVerified}
//                                     message={state.zipCodeMessage}
//                                     zipcodeLength={ZIPCODE_LENGTH}
//                                     disabled={!selectedChild.id}
//                                 />
//                             </div>

//                             <div className="stock-status">{safeGet(selectedChild, 'stock_availability')}</div>
//                             {!selectedChild.id ? (
//                                 <div className="text-center p-3">
//                                     <CircularProgress size={20} /> Loading product...
//                                 </div>
//                             ) : !zipVerified ? (
//                                 <div className="zip-required-message">Verify zip code to buy</div>
//                             ) : (
//                                 <>
//                                     <div className="quantity-selector">
//                                         <QuantitySelector value={state.defaultQuantity} onChange={onQuantityChange} disabled={!inStock} max={24} />
//                                     </div>
//                                     <Button
//                                         className="buy-now-btn"
//                                         disabled={!inStock || state.addToCartLoading}
//                                         onClick={onAddToCart}
//                                     >
//                                         {state.addToCartLoading ? <CircularProgress size={12} /> : inStock ? 'Buy Now' : 'OUT OF STOCK'}
//                                     </Button>
//                                 </>
//                             )}
//                         </div>
//                     </Col>
//                 </Row>
//             </Container>

//             <hr />
//             <ManufacturerInfo productData={selectedChild} />
//             <hr />
//             <div className='prod-des'>
//                 <h3>Product Description</h3>
//                 <p>{safeGet(selectedChild, "description")}</p>
//             </div>
//             <hr />
//             <ProductCard selectedChild={selectedChild} />
//             <hr />
//             <div className='prod-des'>
//                 <h3>Important information</h3>
//                 <h5>Legal Disclaimer</h5>
//                 <p>Statements regarding dietary supplements have not been evaluated by the FDA...</p>
//             </div>
//             <hr />
//             <ReviewsComponent selectedChild={selectedChild} />
//         </div>
//     );
// };

// const mapStateToProps = state => ({
//     productDetailsData: _get(state, 'productDetails.lookUpData', {}),
//     userSignInInfo: _get(state, 'userSignInInfo.lookUpData', []),
// });

// export default connect(mapStateToProps)(ProductDetails);
/*  ProductDetails.jsx  */
import React, {
    useState,
    useEffect,
    useCallback,
    useRef,
    useMemo,
} from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import NatureIcon from '@material-ui/icons/Nature';
import ShareIcon from '@material-ui/icons/Share';
import { connect } from 'react-redux';
import {
    map as _map,
    get as _get,
    isEmpty as _isEmpty,
    reduce as _reduce,
    find as _find,
    filter as _filter,
    uniqBy as _uniqBy,
} from 'lodash';
import { Container, Row, Col, Button } from 'reactstrap';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import CircularProgress from '@material-ui/core/CircularProgress';
import { isMobile } from 'react-device-detect';
import '../../App.css';
import genericGetData from "../../Redux/Actions/genericGetData";
import { genericPostData } from "../../Redux/Actions/genericPostData";
import { LoaderOverLay } from '../../Global/UIComponents/LoaderHoc';
import { cleanEntityData } from '../../Global/helper/commonUtil';
import QuantitySelector from './QuantitySelector';
import ZipcodeInput from './ZipcodeInput';
import showMessage from '../../Redux/Actions/toastAction';
import { ProductView, PageView, ProductAddedtoCart } from '../../Global/helper/react-ga';
import ManufacturerInfo from './ManufacturerInfo';
import ProductCard from './ProductCard';
import ReviewsComponent from './ReviewsComponent';
import './ProductDetails.scss';

const ZIPCODE_LENGTH = 5;

/* ------------------------------------------------------------------ */
const ProductDetails = ({
    dispatch,
    productDetailsData = {},
    userSignInInfo = [],
    match,
    history,
}) => {
    /* -------------------------- STATE -------------------------- */
    const [state, setState] = useState({
        isLoading: true,
        defaultQuantity: 1,
        price: '',
        productID: '',
        size: '',
        selectedSpeed: '',
        speedDropdown: [],
        vendorData: {},
        zipcode: localStorage.getItem('zipcode') || '',
        zipcodeLoading: false,
        zipcodeVerified: false,
        zipCodeMessage: '',
        addToCartLoading: false,
        productPrice: '',
        deliveryOptions: {
            local: false,
            next_day: false,
            farm_direct: false,
            serviceable_zipcode: false,
        },
        deliveryLoading: false,
    });

    const prevProductIdRef = useRef();
    const galleryRef = useRef(null);
    const [isShareClicked, setIsShareClicked] = useState(false);
    const [showCopiedLabel, setShowCopiedLabel] = useState(false);
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

    /* ----------------------- VARIANT LOGIC ----------------------- */
    const children = useMemo(() => {
        const prods = _get(productDetailsData, 'variation_family.products', []);
        return Array.isArray(prods) ? prods : [];
    }, [productDetailsData]);

    const colorOptions = useMemo(
        () =>
            _uniqBy(
                children.map(c => ({
                    name: _get(c, 'color_theme', 'Unknown'),
                    id: c.id,
                    image: _get(c, 'image[0].small_image', ''),
                })),
                'name'
            ),
        [children]
    );

    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [selectedStyle, setSelectedStyle] = useState('');

    const filteredByColor = useMemo(
        () =>
            selectedColor
                ? _filter(children, c => _get(c, 'color_theme') === selectedColor)
                : children,
        [children, selectedColor]
    );

    const sizeOptions = useMemo(
        () =>
            _uniqBy(
                filteredByColor.map(c => ({
                    name: _get(c, 'size', 'N/A'),
                    id: c.id,
                })),
                'name'
            ),
        [filteredByColor]
    );

    const filteredBySize = useMemo(
        () =>
            selectedSize
                ? _filter(
                    filteredByColor,
                    c => String(_get(c, 'size')) === String(selectedSize)
                )
                : filteredByColor,
        [filteredByColor, selectedSize]
    );

    const styleOptions = useMemo(
        () =>
            _uniqBy(
                filteredBySize.map(c => ({
                    name: _get(c, 'style', 'N/A'),
                    id: c.id,
                })),
                'name'
            ),
        [filteredBySize]
    );

    const selectedChild = useMemo(() => {
        return (
            _find(
                children,
                c =>
                    _get(c, 'color_theme') === selectedColor &&
                    String(_get(c, 'size')) === String(selectedSize) &&
                    _get(c, 'style') === selectedStyle
            ) ||
            filteredBySize[0] ||
            filteredByColor[0] ||
            children[0] ||
            {}
        );
    }, [
        children,
        selectedColor,
        selectedSize,
        selectedStyle,
        filteredBySize,
        filteredByColor,
    ]);

    /* ---- Auto-select first variant when data arrives ---- */
    useEffect(() => {
        if (children.length && !selectedColor) {
            const first = children[0];
            setSelectedColor(_get(first, 'color_theme'));
            setSelectedSize(_get(first, 'size'));
            setSelectedStyle(_get(first, 'style'));
        }
    }, [children, selectedColor]);

    useEffect(() => {
        if (selectedColor && filteredByColor.length && !selectedSize) {
            const first = filteredByColor[0];
            setSelectedSize(_get(first, 'size'));
            setSelectedStyle(_get(first, 'style'));
        }
    }, [selectedColor, filteredByColor, selectedSize]);

    useEffect(() => {
        if (selectedSize && filteredBySize.length && !selectedStyle) {
            const first = filteredBySize[0];
            setSelectedStyle(_get(first, 'style'));
        }
    }, [selectedSize, filteredBySize, selectedStyle]);

    /* ----------------------- PRICE & SPEED ----------------------- */
    const pickDefaultSpeed = useCallback((speeds = []) => {
        const active = Array.isArray(speeds) ? speeds.filter(s => s.active) : [];
        const nextDay = active.find(s => s.Type?.toLowerCase() === 'next day');
        const sameDay = active.find(s => s.Type?.toLowerCase() === 'same day');
        return nextDay || sameDay || active[0] || {};
    }, []);

    useEffect(() => {
        const speedObj = pickDefaultSpeed(_get(selectedChild, 'speed_id', []));
        const basePrice = _get(speedObj, 'Price', _get(selectedChild, 'price', 0));
        const total = (state.defaultQuantity * parseFloat(basePrice || 0)).toFixed(2);

        setState(prev => ({
            ...prev,
            size: _get(selectedChild, 'size'),
            productID: _get(selectedChild, 'id'),
            price: basePrice,
            productPrice: total,
            selectedSpeed: _get(speedObj, 'Type', ''),
            speedDropdown: _map(_get(selectedChild, 'speed_id', []), s => ({
                value: _get(s, 'Type'),
                price: _get(s, 'Price'),
                active: _get(s, 'active', true),
                vendorId: _get(s, 'Vendor_id'),
                vendorName: _get(s, 'Vendor_name'),
            })),
            vendorData: {
                id: _get(speedObj, 'Vendor_id'),
                name: _get(speedObj, 'Vendor_name'),
            },
        }));
    }, [selectedChild, state.defaultQuantity, pickDefaultSpeed]);

    /* -------------------------- SHARE -------------------------- */
    const handleShare = useCallback(() => {
        const productUrl = `${window.location.origin}/store/${match.params.productID}`;
        setIsShareClicked(true);
        setTimeout(() => setIsShareClicked(false), 300);
        setShowCopiedLabel(true);
        setTimeout(() => setShowCopiedLabel(false), 2000);

        navigator.clipboard
            .writeText(productUrl)
            .catch(() => {
                const ta = document.createElement('textarea');
                ta.value = productUrl;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            });
    }, [match.params.productID]);

    /* ---------------------- FETCH PRODUCT ---------------------- */
    const fetchProduct = useCallback(
        productId => {
            const loc_id = localStorage.getItem('vendor_location_id') || '';
            const dineinTime = localStorage.getItem('dineinTime') || '';
            const zipcode = localStorage.getItem('zipcode') || '';
            const couriertype = localStorage.getItem('couriertype') || '';

            setState(prev => ({ ...prev, isLoading: true }));
            genericGetData({
                dispatch,
                url: `/connect/index/product?prodid=37529&store_id=1&loc_id=${loc_id}&dineinTime=${dineinTime}&zipCode=${zipcode}&courier_type=${couriertype}`,
                constants: {
                    init: 'PRODUCT_DETAILS_LIST_INIT',
                    success: 'PRODUCT_DETAILS_LIST_SUCCESS',
                    error: 'PRODUCT_DETAILS_LIST_ERROR',
                },
                identifier: 'PRODUCT_DETAILS_LIST',
                successCb: () => {
                    setState(prev => ({ ...prev, isLoading: false }));
                    ProductView(
                        cleanEntityData({
                            productId,
                            name: _get(selectedChild, 'name'),
                            price: state.price,
                        })
                    );
                    PageView();
                },
                errorCb: () => setState(prev => ({ ...prev, isLoading: false })),
                dontShowMessage: true,
            });
        },
        [dispatch, selectedChild, state.price]
    );

    useEffect(() => {
        const currentId = match.params.productID;
        if (prevProductIdRef.current !== currentId && currentId) {
            prevProductIdRef.current = currentId;
            fetchProduct(currentId);
        }
    }, [match.params.productID, fetchProduct]);

    /* ------------------- ZIPCODE & DELIVERY ------------------- */
    const checkDeliveryOptions = useCallback(
        zipcode => {
            if (!zipcode || zipcode.length !== ZIPCODE_LENGTH) {
                dispatch(
                    showMessage({ text: `Enter a ${ZIPCODE_LENGTH}-digit zipcode`, isSuccess: false })
                );
                return;
            }

            if (!selectedChild.id) {
                setState(prev => ({ ...prev, zipCodeMessage: 'Product not loaded yet' }));
                return;
            }

            const loc_id = localStorage.getItem('vendor_location_id') || '';
            if (!loc_id) {
                setState(prev => ({ ...prev, zipCodeMessage: 'Location not available' }));
                return;
            }

            setState(prev => ({
                ...prev,
                deliveryLoading: true,
                zipcodeVerified: false,
                zipCodeMessage: '',
            }));

            const query = new URLSearchParams({
                product_id: selectedChild.id,
                location_ids: loc_id,
                zipcode,
                store_id: '1',
            }).toString();

            genericPostData({
                dispatch,
                reqObj: {},
                url: `/connect/index/checkDeliveryOptions?${query}`,
                constants: {
                    init: 'CHECK_DELIVERY_INIT',
                    success: 'CHECK_DELIVERY_SUCCESS',
                    error: 'CHECK_DELIVERY_ERROR',
                },
                identifier: 'CHECK_DELIVERY',
                dontShowMessage: true,
                successCb: responseArray => {
                    const response = Array.isArray(responseArray) ? responseArray[0] : responseArray;
                    const data = response?.data || {};
                    const serviceable = !!data.serviceable_zipcode;

                    setState(prev => ({
                        ...prev,
                        deliveryLoading: false,
                        zipcodeVerified: serviceable,
                        zipCodeMessage: serviceable ? '' : response.message || 'Delivery not available',
                        deliveryOptions: {
                            local: !!data.local,
                            next_day: !!data.next_day,
                            farm_direct: !!data.farm_direct,
                            serviceable_zipcode: serviceable,
                        },
                        zipcode,
                    }));

                    if (serviceable) localStorage.setItem('zipcode', zipcode);
                },
                errorCb: err => {
                    setState(prev => ({
                        ...prev,
                        deliveryLoading: false,
                        zipcodeVerified: false,
                        zipCodeMessage: err?.message || 'Network error',
                    }));
                },
            });
        },
        [dispatch, selectedChild.id]
    );

    // Auto-verify saved zip once product is ready
    useEffect(() => {
        const saved = localStorage.getItem('zipcode');
        if (
            saved &&
            saved.length === ZIPCODE_LENGTH &&
            selectedChild.id &&
            !state.zipcodeVerified
        ) {
            const timer = setTimeout(() => checkDeliveryOptions(saved), 300);
            return () => clearTimeout(timer);
        }
    }, [selectedChild.id, state.zipcodeVerified, checkDeliveryOptions]);

    // Persist vendor_location_id for the selected speed
    useEffect(() => {
        const productLocId = _get(selectedChild, 'location_id');
        const speedLocId = _get(pickDefaultSpeed(_get(selectedChild, 'speed_id', [])), 'Loc_id');
        const finalLocId = speedLocId || productLocId;
        if (finalLocId) localStorage.setItem('vendor_location_id', finalLocId);
    }, [selectedChild, pickDefaultSpeed]);

    /* -------------------------- HANDLERS -------------------------- */
    const onQuantityChange = useCallback(qty => {
        const num = Number(qty) || 1;
        setState(prev => ({
            ...prev,
            defaultQuantity: num,
            productPrice: (num * parseFloat(prev.price || 0)).toFixed(2),
        }));
    }, []);

    const onSpeedChange = useCallback(
        speedType => {
            const speedObj = _find(_get(selectedChild, 'speed_id', []), { Type: speedType });
            if (!speedObj) return;
            const basePrice = _get(speedObj, 'Price', _get(selectedChild, 'price', 0));
            const total = (state.defaultQuantity * parseFloat(basePrice || 0)).toFixed(2);
            setState(prev => ({
                ...prev,
                selectedSpeed: speedType,
                price: basePrice,
                productPrice: total,
                vendorData: { id: _get(speedObj, 'Vendor_id'), name: _get(speedObj, 'Vendor_name') },
            }));
        },
        [selectedChild, state.defaultQuantity]
    );

    // const onAddToCart = useCallback(() => {
    //     if (!state.zipcodeVerified) {
    //         dispatch(showMessage({ text: 'Please verify zipcode first', isSuccess: false }));
    //         return;
    //     }

    //     const locId = state.vendorData.id || localStorage.getItem('vendor_location_id') || '';

    //     const req = {
    //         product_id: selectedChild.id,
    //         qty: Number(state.defaultQuantity) || 1,
    //         api_token: localStorage.getItem('token') || '',
    //         cart_id: localStorage.getItem('cart_id') || '',
    //         zipcode: localStorage.getItem('zipcode'),
    //         loc_id: locId,
    //         wallet: 0,
    //         speed_id: state.selectedSpeed,
    //         store_id: 1,
    //     };

    //     setState(prev => ({ ...prev, addToCartLoading: true }));

    //     genericPostData({
    //         dispatch,
    //         reqObj: req,
    //         url: `/api/cart/addtocart`,
    //         constants: {
    //             init: 'ADD_TO_CART_INIT',
    //             success: 'ADD_TO_CART_SUCCESS',
    //             error: 'ADD_TO_CART_ERROR',
    //         },
    //         identifier: 'ADD_TO_CART',
    //         successCb: ([{ code, message, cart_id, total_products_in_cart }]) => {
    //             setState(prev => ({ ...prev, addToCartLoading: false }));
    //             if (code === 1) {
    //                 ProductAddedtoCart(
    //                     cleanEntityData({
    //                         productId: match.params.productID,
    //                         name: _get(selectedChild, 'name'),
    //                         price: state.price,
    //                         quantity: Number(state.defaultQuantity),
    //                     })
    //                 );
    //                 localStorage.setItem('cart_id', cart_id);
    //                 localStorage.setItem('total_products_in_cart', total_products_in_cart);

    //                 const token = _get(userSignInInfo, '[0].result.api_token', '');
    //                 if (_isEmpty(token)) history.push('/guest/register');
    //                 else history.push('/cart');
    //             } else {
    //                 dispatch(showMessage({ text: message, isSuccess: false }));
    //             }
    //         },
    //         errorCb: err => {
    //             setState(prev => ({ ...prev, addToCartLoading: false }));
    //             dispatch(
    //                 showMessage({
    //                     text: err?.message || 'Failed to add to cart',
    //                     isSuccess: false,
    //                 })
    //             );
    //         },
    //         dontShowMessage: true,
    //     });
    // }, [
    //     dispatch,
    //     history,
    //     match.params.productID,
    //     selectedChild,
    //     state.defaultQuantity,
    //     state.price,
    //     state.selectedSpeed,
    //     state.zipcodeVerified,
    //     state.vendorData.id,
    //     userSignInInfo,
    // ]);


    /* -------------------------- ADD TO CART -------------------------- */
    const onAddToCart = useCallback(() => {
        if (!state.zipcodeVerified) {
            dispatch(showMessage({ text: 'Please verify zipcode first', isSuccess: false }));
            return;
        }

        const locId = state.vendorData.id || localStorage.getItem('vendor_location_id') || '';

        /* ---- PAYLOAD THAT THE BACKEND EXPECTS ---- */
        const req = {
            product_id: selectedChild.id,
            quantity: Number(state.defaultQuantity) || 1,   // <-- quantity, NOT qty
            api_token: localStorage.getItem('token') || '',
            cart_id: localStorage.getItem('cart_id') || '',
            zipcode: localStorage.getItem('zipcode') || '',
            loc_id: locId,
            wallet: 0,
            speed_id: state.selectedSpeed,
            store_id: 1,
            // OPTIONAL – some BFF versions also read these:
            size: _get(selectedChild, 'size', ''),
            color: selectedColor,
            style: _get(selectedChild, 'style', ''),
        };

        console.log('Add-to-Cart payload →', req); // <-- keep for debugging, remove in prod

        setState(prev => ({ ...prev, addToCartLoading: true }));

        genericPostData({
            dispatch,
            reqObj: req,
            url: `/api/cart/addtocart`,
            constants: {
                init: 'ADD_TO_CART_INIT',
                success: 'ADD_TO_CART_SUCCESS',
                error: 'ADD_TO_CART_ERROR',
            },
            identifier: 'ADD_TO_CART',
            successCb: ([{ code, message, cart_id, total_products_in_cart }]) => {
                setState(prev => ({ ...prev, addToCartLoading: false }));
                if (code === 1) {
                    ProductAddedtoCart(
                        cleanEntityData({
                            productId: match.params.productID,
                            name: _get(selectedChild, 'name'),
                            price: state.price,
                            quantity: Number(state.defaultQuantity),
                        })
                    );
                    localStorage.setItem('cart_id', cart_id);
                    localStorage.setItem('total_products_in_cart', total_products_in_cart);

                    const token = _get(userSignInInfo, '[0].result.api_token', '');
                    if (_isEmpty(token)) history.push('/guest/register');
                    else history.push('/cart');
                } else {
                    dispatch(showMessage({ text: message, isSuccess: false }));
                }
            },
            errorCb: err => {
                setState(prev => ({ ...prev, addToCartLoading: false }));
                dispatch(
                    showMessage({
                        text: err?.message || 'Failed to add to cart',
                        isSuccess: false,
                    })
                );
            },
            dontShowMessage: true,
        });
    }, [
        dispatch,
        history,
        match.params.productID,
        selectedChild,
        state.defaultQuantity,
        state.price,
        state.selectedSpeed,
        state.zipcodeVerified,
        state.vendorData.id,
        userSignInInfo,
        selectedColor,
    ]);
    /* -------------------------- GALLERY -------------------------- */
    const imageArr = useMemo(() => _reduce(_get(selectedChild, 'image', []), (acc, im) => {
        if (im?.small_image) acc.push(im.small_image);
        else if (im?.additional_images) {
            _map(im.additional_images, a => a?.additional_image && acc.push(a.additional_image));
        }
        return acc;
    }, []), [selectedChild]);

    const galleryItems = useMemo(
        () =>
            _map(imageArr, (url, i) => {
                if (!url) return null;
                const sep = url.includes('?') ? '&' : '?';
                const thumbnail = `${url}${sep}width=100&height=100&quality=80`;
                return {
                    original: url,
                    thumbnail,
                    originalAlt: `Product ${i + 1}`,
                    thumbnailAlt: `Thumb ${i + 1}`,
                };
            }).filter(Boolean),
        [imageArr]
    );

    const safeGet = (obj, path, fallback = 'N/A') => {
        const v = _get(obj, path);
        return v == null || v === '' ? fallback : v;
    };

    const inStock = _get(selectedChild, 'stock_availability', '')
        .toLowerCase()
        .includes('in stock');
    const zipVerified = state.zipcodeVerified;

    /* -------------------------- RENDER -------------------------- */
    if (state.isLoading) return <LoaderOverLay />;
    if (_isEmpty(productDetailsData))
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                Product not found
            </div>
        );

    return (
        <div className="page-content-container">
            <Container fluid className="productDetails">
                <Row className="no-gutters justify-content-lg-between secMinHeight w-100 main-conainer">
                    {/* IMAGE GALLERY */}
                    <Col
                        lg="4"
                        className={`pdp-image-galary ${isLargeScreen ? 'sticky-left' : ''}`}
                    >
                        <div className="proName top">{safeGet(selectedChild, 'name')}</div>
                        <div className="productImgSection proDetailSec">
                            <ImageGallery
                                key={selectedChild.id}
                                ref={galleryRef}
                                items={galleryItems}
                                thumbnailPosition="left"
                                showBullets={isMobile}
                                showNav={false}
                                showFullscreenButton={false}
                                showPlayButton={false}
                                lazyLoad
                                infinite={false}
                                useBrowserFullscreen
                                renderItem={item => (
                                    <div className="image-gallery-image">
                                        <img
                                            src={item.original}
                                            alt={item.originalAlt}
                                            loading="lazy"
                                            style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                                        />
                                    </div>
                                )}
                            />
                            <Button
                                className={`shareBtn ${isShareClicked ? 'clicked' : ''}`}
                                onClick={handleShare}
                            >
                                <ShareIcon />
                                {showCopiedLabel && (
                                    <div className="share-copied-label">Link copied!</div>
                                )}
                            </Button>
                        </div>
                    </Col>

                    {/* PRODUCT INFO */}
                    <Col className="pdp-info">
                        <div className="w-100">
                            <div className="proName mid">{safeGet(selectedChild, 'name')}</div>

                            {/* RATING */}
                            <div className="rating-summary">
                                <div className="rating-stars">
                                    <span className="rating-value">
                                        {(() => {
                                            const r = parseFloat(_get(selectedChild, 'reviews.rating_summary', 0)) || 0;
                                            return r > 0 ? (r / 20).toFixed(1) : '0.0';
                                        })()}
                                    </span>
                                    {(() => {
                                        const r = parseFloat(_get(selectedChild, 'reviews.rating_summary', 0)) || 0;
                                        const full = Math.floor(r / 20);
                                        return [...Array(full)].map((_, i) => (
                                            <StarIcon key={i} className="star full" />
                                        ));
                                    })()}
                                    {(() => {
                                        const r = parseFloat(_get(selectedChild, 'reviews.rating_summary', 0)) || 0;
                                        return r % 20 >= 10 ? <StarHalfIcon className="star half" /> : null;
                                    })()}
                                    {(() => {
                                        const r = parseFloat(_get(selectedChild, 'reviews.rating_summary', 0)) || 0;
                                        const full = Math.floor(r / 20);
                                        const hasHalf = r % 20 >= 10;
                                        const empty = 5 - full - (hasHalf ? 1 : 0);
                                        return [...Array(empty)].map((_, i) => (
                                            <StarBorderIcon key={i} className="star empty" />
                                        ));
                                    })()}
                                    <ExpandMoreIcon className="dropdown-icon" />
                                    <span className="rating-count">
                                        {_get(selectedChild, 'reviews.review_count', '0 Reviews').replace(
                                            ' Reviews',
                                            ''
                                        )}{' '}
                                        ratings
                                    </span>
                                </div>
                                <div className="bought-info">
                                    <strong>50 bought</strong> in past month
                                </div>
                            </div>

                            <div className="pdpFormSection">
                                {/* PRICE */}
                                <div className="price-section">
                                    <span className="main-price">
                                        <span className="currency">$</span>
                                        <span className="price-int">
                                            {Math.floor(parseFloat(state.price || 0))}
                                        </span>
                                        <sup className="price-dec">
                                            {(parseFloat(state.price || 0) % 1).toFixed(2).split('.')[1]}
                                        </sup>
                                        <span className="per-count">
                                            (${parseFloat(state.price || 0).toFixed(2)}/count)
                                        </span>
                                    </span>
                                </div>
                                <hr />

                                {/* COLOR */}
                                <div className="option-section">
                                    <h4>
                                        Color <span className="selected">{selectedColor}</span>
                                    </h4>
                                    <div className="option-grid">
                                        {colorOptions.map(opt => (
                                            <div
                                                key={opt.name}
                                                className={`option-card ${selectedColor === opt.name ? 'selected' : ''}`}
                                                onClick={() => setSelectedColor(opt.name)}
                                            >
                                                <img src={opt.image} alt={opt.name} className="option-img" />
                                                <hr />
                                                <p>{opt.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* SIZE */}
                                <div className="option-section">
                                    <h4>
                                        Size <span className="selected">{selectedSize}</span>
                                    </h4>
                                    <div className="option-grid small">
                                        {sizeOptions
                                            .sort((a, b) => parseFloat(a.name) - parseFloat(b.name))
                                            .map(opt => {
                                                const isSel = String(selectedSize) === String(opt.name);
                                                const childForSize = _find(
                                                    children,
                                                    c =>
                                                        _get(c, 'color_theme') === selectedColor &&
                                                        String(_get(c, 'size')) === String(opt.name)
                                                );
                                                const speedObj = pickDefaultSpeed(_get(childForSize, 'speed_id', []));
                                                const price = _get(speedObj, 'Price', _get(childForSize, 'price', 0));
                                                return (
                                                    <div
                                                        key={opt.name}
                                                        className={`option-card size ${isSel ? 'selected' : ''}`}
                                                        onClick={() => setSelectedSize(opt.name)}
                                                    >
                                                        <div className="size-label">{opt.name}</div>
                                                        <hr />
                                                        <div className="size-info">
                                                            <div>${parseFloat(price || 0).toFixed(2)}</div>
                                                            <div>(${parseFloat(price || 0).toFixed(2)} / count)</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                    </div>
                                </div>

                                {/* STYLE */}
                                <div className="option-section">
                                    <h4>
                                        Style <span className="selected">{selectedStyle}</span>
                                    </h4>
                                    <div className="option-grid">
                                        {styleOptions.map(opt => (
                                            <div
                                                key={opt.name}
                                                className={`option-card ${selectedStyle === opt.name ? 'selected' : ''}`}
                                                onClick={() => setSelectedStyle(opt.name)}
                                            >
                                                <img
                                                    src={_get(selectedChild, 'image[0].small_image', '')}
                                                    alt={opt.name}
                                                    className="option-img"
                                                />
                                                <hr />
                                                <p>{opt.name}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* DELIVERY OPTIONS */}
                                {state.zipcodeVerified && (
                                    <div className="option-section">
                                        <h4>Delivery Options</h4>
                                        {state.deliveryLoading ? (
                                            <div className="delivery-loading">
                                                <CircularProgress size={20} /> Checking...
                                            </div>
                                        ) : (
                                            <div className="option-grid">
                                                {state.deliveryOptions.local && (
                                                    <div className="option-card selected">
                                                        <LocationOnIcon fontSize="large" className="option-icon" />
                                                        <p className="delivery-type">Same Day</p>
                                                        <span className="delivery-note">Nationwide fast delivery</span>
                                                    </div>
                                                )}
                                                {state.deliveryOptions.next_day && (
                                                    <div className="option-card selected">
                                                        <LocalShippingIcon fontSize="large" className="option-icon" />
                                                        <p className="delivery-type">Next Day</p>
                                                        <span className="delivery-note">Hand delivery</span>
                                                    </div>
                                                )}
                                                {state.deliveryOptions.farm_direct && (
                                                    <div className="option-card selected">
                                                        <NatureIcon fontSize="large" className="option-icon" />
                                                        <p className="delivery-type">Farm Direct</p>
                                                        <span className="delivery-note">Fresh from farm</span>
                                                    </div>
                                                )}
                                                {!state.deliveryOptions.local &&
                                                    !state.deliveryOptions.next_day &&
                                                    !state.deliveryOptions.farm_direct && (
                                                        <p className="no-delivery">Delivery not available</p>
                                                    )}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* PRODUCT PROPERTIES */}
                            <div className="product-properties">
                                <div className="label">Brand:</div>
                                <div>{safeGet(selectedChild, 'brand_name')}</div>
                            </div>
                            <div className="product-properties">
                                <div className="label">Color:</div>
                                <div>{selectedColor}</div>
                            </div>
                            <div className="product-properties">
                                <div className="label">Size:</div>
                                <div>{selectedSize}</div>
                            </div>
                            <div className="product-properties">
                                <div className="label">Style:</div>
                                <div>{selectedStyle}</div>
                            </div>
                            <hr />
                            <h1 className="sectionTitle">About this item:</h1>
                            <div className="product-description">
                                {safeGet(selectedChild, 'short_description')}
                            </div>
                            <hr />
                        </div>
                    </Col>

                    {/* BUY BOX */}
                    <Col
                        lg="3"
                        className={`pdp-buy ${isLargeScreen ? 'sticky-right' : ''}`}
                    >
                        <div className="free-delivery-banner">
                            <div className="price-section">
                                <span className="main-price">
                                    <span className="currency">$</span>
                                    <span className="price-int">
                                        {Math.floor(parseFloat(state.price || 0))}
                                    </span>
                                    <sup className="price-dec">
                                        {(parseFloat(state.price || 0) % 1).toFixed(2).split('.')[1]}
                                    </sup>
                                    <span className="per-count">
                                        (${parseFloat(state.price || 0).toFixed(2)}/count)
                                    </span>
                                </span>
                            </div>

                            <div className="location">
                                <ZipcodeInput
                                    zipcode={state.zipcode}
                                    onCheck={checkDeliveryOptions}
                                    onZipChange={() =>
                                        setState(prev => ({
                                            ...prev,
                                            zipcodeVerified: false,
                                            zipCodeMessage: '',
                                            deliveryOptions: {
                                                local: false,
                                                next_day: false,
                                                farm_direct: false,
                                                serviceable_zipcode: false,
                                            },
                                            deliveryLoading: false,
                                        }))
                                    }
                                    loading={state.deliveryLoading}
                                    verified={state.zipcodeVerified}
                                    message={state.zipCodeMessage}
                                    zipcodeLength={ZIPCODE_LENGTH}
                                    disabled={!selectedChild.id}
                                />
                            </div>

                            <div className="stock-status">
                                {safeGet(selectedChild, 'stock_availability')}
                            </div>

                            {!selectedChild.id ? (
                                <div className="text-center p-3">
                                    <CircularProgress size={20} /> Loading product...
                                </div>
                            ) : !zipVerified ? (
                                <div className="zip-required-message">Verify zip code to buy</div>
                            ) : (
                                <>
                                    <div className="quantity-selector">
                                        <QuantitySelector
                                            value={state.defaultQuantity}
                                            onChange={onQuantityChange}
                                            disabled={!inStock}
                                            max={24}
                                        />
                                    </div>

                                    <Button
                                        className="buy-now-btn"
                                        disabled={!inStock || state.addToCartLoading}
                                        onClick={onAddToCart}
                                    >
                                        {state.addToCartLoading ? (
                                            <CircularProgress size={12} />
                                        ) : inStock ? (
                                            'Buy Now'
                                        ) : (
                                            'OUT OF STOCK'
                                        )}
                                    </Button>
                                </>
                            )}
                        </div>
                    </Col>
                </Row>
            </Container>

            <hr />
            <ManufacturerInfo productData={selectedChild} />
            <hr />
            <div className="prod-des">
                <h3>Product Description</h3>
                <p>{safeGet(selectedChild, 'description')}</p>
            </div>
            <hr />
            <ProductCard selectedChild={selectedChild} />
            <hr />
            <div className="prod-des">
                <h3>Important information</h3>
                <h5>Legal Disclaimer</h5>
                <p>
                    Statements regarding dietary supplements have not been evaluated by the FDA...
                </p>
            </div>
            <hr />
            <ReviewsComponent selectedChild={selectedChild} />
        </div>
    );
};

/* ------------------------------------------------------------------ */
const mapStateToProps = state => ({
    productDetailsData: _get(state, 'productDetails.lookUpData', {}),
    userSignInInfo: _get(state, 'userSignInInfo.lookUpData', []),
});

export default connect(mapStateToProps)(ProductDetails);