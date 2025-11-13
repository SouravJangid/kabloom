import React, { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import StarHalfIcon from '@material-ui/icons/StarHalf';
import StarBorderIcon from '@material-ui/icons/StarBorder';
import StarIcon from '@material-ui/icons/Star';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import NatureIcon from '@material-ui/icons/Nature';
import ShareIcon from '@material-ui/icons/Share';
import { connect } from 'react-redux';
import { map as _map, get as _get, isEmpty as _isEmpty, find as _find, reduce as _reduce } from 'lodash';
import { Container, Row, Col, Button } from 'reactstrap';
import ImageGallery from 'react-image-gallery';
import "react-image-gallery/styles/css/image-gallery.css";
import 'antd/dist/antd.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { isMobile } from 'react-device-detect';
import '../../App.css';

import genericGetData from "../../Redux/Actions/genericGetData";
import { genericPostData } from "../../Redux/Actions/genericPostData";
import { LoaderOverLay } from '../../Global/UIComponents/LoaderHoc';
import { commonActionCreater } from "../../Redux/Actions/commonAction";
import { cleanEntityData, deliveryMethods } from '../../Global/helper/commonUtil';
import QuantitySelector from './QuantitySelector';
import ZipcodeInput from './ZipcodeInput';
import showMessage from '../../Redux/Actions/toastAction';
import { APPLICATION_BFF_URL } from '../../Redux/urlConstants';
import { ProductView, PageView, ProductAddedtoCart } from '../../Global/helper/react-ga';
import FrequentlyBought from './FrequentlyBought';
import ManufacturerInfo from './ManufacturerInfo';
import ProductCard from './ProductCard';
import ReviewsComponent from './ReviewsComponent';
import './ProductDetails.scss';
import data from './data/productData.json'; // ← MUST EXIST & VALID JSON

const ZIPCODE_LENGTH = 5;

const ProductDetails = ({
    dispatch,
    productDetailsData = {},
    userSignInInfo = [],
    match,
    history,
}) => {
    const [state, setState] = useState({
        isLoading: true,
        defaultQuantity: 1,
        price: '',
        productID: '',
        size: '',
        selectedSpeed: '',
        speedDropdown: [],
        productDetailMap: {},
        vendorData: {},
        zipcode: localStorage.getItem('zipcode') || '',
        zipcodeLoading: false,
        zipcodeVerified: false,
        zipCodeMessage: '',
        addToCartLoading: false,
        productPrice: '',
    });

    const prevProductIdRef = useRef();
    const galleryRef = useRef(null);
    const [isShareClicked, setIsShareClicked] = useState(false);
    const [showCopiedLabel, setShowCopiedLabel] = useState(false);
    const [timeLeft, setTimeLeft] = useState({ hours: 1, minutes: 10, seconds: 0 });
    const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);

    // SAFE: Use _get to avoid crash if data.json is missing/malformed
    const rating = Number(_get(data, 'rating', 4.5)) || 4.5;
    const totalRatings = Number(_get(data, 'totalRatings', 0)) || 0;
    const boughtCount = String(_get(data, 'boughtCount', 0)) || 0;

    const [selectedStyle, setSelectedStyle] = useState('');
    const extractColorFromParent = (parentName = '') => {
        const match = parentName.match(/(Yellow|Orange|White|Purple|Red|Pink|Assorted)/i);
        return match ? match[0].toLowerCase() : '';
    };
    const [selectedSize, setSelectedSize] = useState(12);

    // SAFE: Ensure children is always an array
    const children = Array.isArray(_get(productDetailsData, 'variation_family', []))
        ? _get(productDetailsData, 'variation_family', [])
        : [];

    const fullStars = Math.floor(rating);
    const hasHalf = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalf ? 1 : 0);

    const pickDefaultSpeed = (speeds = []) => {
        const active = Array.isArray(speeds) ? speeds.filter(s => s.active) : [];
        const nextDay = active.find(s => s.Type?.toLowerCase() === 'next day');
        const sameDay = active.find(s => s.Type?.toLowerCase() === 'same day');
        return nextDay || sameDay || active[0] || {};
    };

    const parentName = _get(productDetailsData, 'name', '');
    const parentColor = extractColorFromParent(parentName);

    const defaultChild = useMemo(() => {
        if (!parentColor || children.length === 0) return children[0] || {};
        const matched = children.find(c =>
            _get(c, 'color_theme', '').toLowerCase() === parentColor.toLowerCase()
        );
        return matched || children[0] || {};
    }, [children, parentColor]);

    const defaultColorId = _get(defaultChild, 'id');
    const [selectedColorId, setSelectedColorId] = useState(defaultColorId);

    const selectedChild = useMemo(() => {
        if (!selectedColorId) return defaultChild || {};
        const found = _find(children, { id: selectedColorId });
        return found || defaultChild || {};
    }, [selectedColorId, defaultChild, children]);

    const updateFooterButton = useCallback(() => {
        dispatch(
            commonActionCreater(
                {
                    product_id: match.params.productID,
                    qty: state.defaultQuantity,
                    api_token: localStorage.getItem('Token'),
                    cart_id: localStorage.getItem('cart_id'),
                },
                'PRODUCT_DETAILS_FOOTER'
            )
        );
    }, [dispatch, match.params.productID, state.defaultQuantity]);

    const handleShare = useCallback(() => {
        const productUrl = `${window.location.origin}/store/${match.params.productID}`;
        setIsShareClicked(true);
        setTimeout(() => setIsShareClicked(false), 300);
        setShowCopiedLabel(true);
        const hideTimer = setTimeout(() => setShowCopiedLabel(false), 2000);

        navigator.clipboard.writeText(productUrl).catch(() => {
            const ta = document.createElement('textarea');
            ta.value = productUrl;
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            document.body.removeChild(ta);
        });

        return () => clearTimeout(hideTimer);
    }, [match.params.productID]);

    const fetchProduct = useCallback((productId) => {
        const loc_id = localStorage.getItem('vendor_location_id');
        const dineinTime = localStorage.getItem('dineinTime');
        const zipcode = localStorage.getItem('zipcode') || '';
        const couriertype = localStorage.getItem('couriertype') || '';

        setState(prev => ({ ...prev, isLoading: true }));

        genericGetData({
            dispatch,
            url: `/connect/index/product?prodid=${productId}&store_id=1&loc_id=${loc_id}&dineinTime=${dineinTime}&zipCode=${zipcode}&courier_type=${couriertype}`,
            constants: {
                init: "PRODUCT_DETAILS_LIST_INIT",
                success: "PRODUCT_DETAILS_LIST_SUCCESS",
                error: "PRODUCT_DETAILS_LIST_ERROR",
            },
            identifier: "PRODUCT_DETAILS_LIST",
            successCb: (data) => {
                const map = {};
                _get(data, 'variation_family', []).forEach(c => {
                    const size = String(_get(c, 'bottle_size', '')).toLowerCase();
                    _get(c, 'speed_id', []).forEach(s => {
                        const speed = String(_get(s, 'Type', '')).toLowerCase();
                        const key = `${size}_${speed}`;
                        map[key] = {
                            price: _get(s, 'Price', _get(c, 'price')),
                            vendorId: _get(s, 'Vendor_id'),
                            vendorName: _get(s, 'Vendor_name'),
                            locId: _get(s, 'Loc_id'),
                            active: _get(s, 'active', true),
                        };
                    });
                });

                const child = defaultChild || {};
                const speedObj = pickDefaultSpeed(_get(child, 'speed_id', []));
                const basePrice = _get(speedObj, 'price', _get(child, 'price', 0));
                const total = (1 * parseFloat(basePrice || 0)).toFixed(2);

                setState(prev => ({
                    ...prev,
                    isLoading: false,
                    productDetailMap: map,
                    size: _get(child, 'bottle_size'),
                    productID: _get(child, 'id'),
                    price: basePrice,
                    productPrice: total,
                    selectedSpeed: _get(speedObj, 'Type', ''),
                    speedDropdown: _map(_get(child, 'speed_id', []), s => ({
                        value: _get(s, 'Type'),
                        price: _get(s, 'Price'),
                        active: _get(s, 'active', true),
                        vendorId: _get(s, 'Vendor_id'),
                        vendorName: _get(s, 'Vendor_name'),
                    })),
                    vendorData: {
                        id: _get(speedObj, 'Vendor_id'),
                        name: _get(speedObj, 'Vendor_name')
                    },
                }));
                setSelectedColorId(_get(child, 'id'));
                setSelectedSize(_get(child, 'bottle_size'));
                setSelectedStyle(_get(child, 'style'));

                ProductView(cleanEntityData({
                    productId,
                    name: _get(child, 'name'),
                    price: basePrice
                }));
                PageView();
            },
            errorCb: () => setState(prev => ({ ...prev, isLoading: false })),
            dontShowMessage: true,
        });
    }, [dispatch, defaultChild]);

    useEffect(() => {
        if (children.length > 0 && !selectedColorId) {
            const child = defaultChild || {};
            setSelectedColorId(_get(child, 'id'));
            setSelectedSize(_get(child, 'bottle_size'));
            setSelectedStyle(_get(child, 'style'));
        }
    }, [children, defaultChild, selectedColorId]);

    useEffect(() => {
        const handleResize = () => setIsLargeScreen(window.innerWidth >= 992);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    useEffect(() => {
        const currentId = match.params.productID;
        if (prevProductIdRef.current !== currentId && currentId) {
            prevProductIdRef.current = currentId;
            fetchProduct(currentId);
        }
    }, [match.params.productID, fetchProduct]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) seconds--;
                else if (minutes > 0) { minutes--; seconds = 59; }
                else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
                else { clearInterval(timer); return prev; }
                return { hours, minutes, seconds };
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const savedZip = localStorage.getItem('zipcode');
        if (savedZip && savedZip.length === ZIPCODE_LENGTH) {
            setState(prev => ({
                ...prev,
                zipcode: savedZip,
                zipcodeVerified: true,
                zipCodeMessage: '',
            }));
        }
    }, []);

    const formatTime = (num) => String(num).padStart(2, '0');

    const onQuantityChange = useCallback((qty) => {
        setState(prev => {
            const basePrice = prev.productDetailMap[`${prev.size?.toLowerCase()}_${prev.selectedSpeed?.toLowerCase()}`]?.price || 0;
            const total = (qty * parseFloat(basePrice || 0)).toFixed(2);
            return { ...prev, defaultQuantity: qty, productPrice: total };
        });
        updateFooterButton();
    }, [updateFooterButton]);

    const onSpeedChange = useCallback((speedType) => {
        const speedObj = _find(_get(selectedChild, 'speed_id', []), { Type: speedType });
        if (!speedObj) return;
        const basePrice = _get(speedObj, 'Price', _get(selectedChild, 'price', 0));
        const total = (state.defaultQuantity * parseFloat(basePrice || 0)).toFixed(2);
        const mapKey = `${_get(selectedChild, 'bottle_size', '').toLowerCase()}_${speedType.toLowerCase()}`;
        const newMap = {
            ...state.productDetailMap,
            [mapKey]: {
                price: basePrice,
                vendorId: _get(speedObj, 'Vendor_id'),
                vendorName: _get(speedObj, 'Vendor_name'),
                locId: _get(speedObj, 'Loc_id'),
                active: _get(speedObj, 'active', true),
            },
        };

        setState(prev => ({
            ...prev,
            selectedSpeed: speedType,
            price: basePrice,
            productPrice: total,
            productDetailMap: newMap,
            vendorData: {
                id: _get(speedObj, 'Vendor_id'),
                name: _get(speedObj, 'Vendor_name'),
            },
        }));
    }, [selectedChild, state.defaultQuantity, state.productDetailMap]);

    const onColorChange = useCallback((childId) => {
        const child = _find(children, { id: childId });
        if (!child) return;

        const speedObj = pickDefaultSpeed(_get(child, 'speed_id', []));
        const basePrice = _get(speedObj, 'price', _get(child, 'price', 0));
        const total = (state.defaultQuantity * parseFloat(basePrice || 0)).toFixed(2);

        setState(prev => ({
            ...prev,
            size: _get(child, 'bottle_size'),
            productID: _get(child, 'id'),
            price: basePrice,
            productPrice: total,
            selectedSpeed: _get(speedObj, 'Type', ''),
            speedDropdown: _map(_get(child, 'speed_id', []), s => ({
                value: _get(s, 'Type'),
                price: _get(s, 'Price'),
                active: _get(s, 'active', true),
                vendorId: _get(s, 'Vendor_id'),
                vendorName: _get(s, 'Vendor_name'),
            })),
            vendorData: {
                id: _get(speedObj, 'Vendor_id'),
                name: _get(speedObj, 'Vendor_name')
            },
        }));

        onSpeedChange(_get(speedObj, 'Type', ''));
        setSelectedColorId(childId);
        setSelectedSize(_get(child, 'bottle_size'));
        setSelectedStyle(_get(child, 'style'));
    }, [children, onSpeedChange, state.defaultQuantity]);

    const onZipLookup = useCallback((zip) => {
        if (!zip || zip.length !== ZIPCODE_LENGTH) {
            dispatch(showMessage({ text: `Enter a ${ZIPCODE_LENGTH}-digit zipcode`, isSuccess: false }));
            return;
        }

        setState(prev => ({ ...prev, zipcodeLoading: true, zipcodeVerified: false, zipCodeMessage: '' }));
        const productID = match.params.productID;
        const loc_id = localStorage.getItem('vendor_location_id');
        const dineinTime = localStorage.getItem('dineinTime');
        const couriertype = localStorage.getItem('couriertype') || '';

        fetch(`${APPLICATION_BFF_URL}/connect/index/product?prodid=${productID}&store_id=1&loc_id=${loc_id}&dineinTime=${dineinTime}&zipCode=${zip}&courier_type=${couriertype}`)
            .then(r => r.json())
            .then(data => {
                setState(prev => ({ ...prev, zipcodeLoading: false }));
                if (data?.errorCode === 1) {
                    setState(prev => ({ ...prev, zipcodeVerified: false, zipCodeMessage: data?.message || 'Invalid zipcode' }));
                    return;
                }
                localStorage.setItem('zipcode', zip);
                setState(prev => ({ ...prev, zipcode: zip, zipcodeVerified: true, zipCodeMessage: '' }));

                const map = {};
                _get(data, 'variation_family', []).forEach(c => {
                    const size = String(_get(c, 'bottle_size', '')).toLowerCase();
                    _get(c, 'speed_id', []).forEach(s => {
                        const speed = String(_get(s, 'Type', '')).toLowerCase();
                        const key = `${size}_${speed}`;
                        map[key] = {
                            price: _get(s, 'Price', _get(c, 'price')),
                            vendorId: _get(s, 'Vendor_id'),
                            vendorName: _get(s, 'Vendor_name'),
                            locId: _get(s, 'Loc_id'),
                            active: _get(s, 'active', true),
                        };
                    });
                });
                const firstChild = _get(data, 'child[0]', {});
                const firstSize = _get(firstChild, 'bottle_size');
                const speeds = _map(_get(firstChild, 'speed_id', []), s => ({
                    value: _get(s, 'Type'),
                    price: _get(s, 'Price'),
                    active: _get(s, 'active', true),
                    vendorId: _get(s, 'Vendor_id'),
                    vendorName: _get(s, 'Vendor_name'),
                }));
                const activeSpeeds = speeds.filter(s => s.active);
                const courierOption = activeSpeeds.find(s => s.value?.toLowerCase() === 'courier');
                const defaultSpeedObj = courierOption || activeSpeeds[0] || {};
                const basePrice = _get(defaultSpeedObj, 'price', 0);
                const total = (state.defaultQuantity * parseFloat(basePrice || 0)).toFixed(2);

                setState(prev => ({
                    ...prev,
                    productDetailMap: map,
                    size: firstSize,
                    productID: _get(firstChild, 'id'),
                    price: basePrice,
                    productPrice: total,
                    selectedSpeed: _get(defaultSpeedObj, 'value', ''),
                    speedDropdown: speeds,
                    vendorData: { id: _get(defaultSpeedObj, 'vendorId'), name: _get(defaultSpeedObj, 'vendorName') },
                }));
                dispatch({ type: 'PRODUCT_DETAILS_LIST_SUCCESS', data, receivedAt: Date.now() });
            })
            .catch(() => setState(prev => ({ ...prev, zipcodeLoading: false })));
    }, [dispatch, match.params.productID, state.defaultQuantity]);

    const onAddToCart = useCallback(() => {
        if (!localStorage.getItem('zipcode')) {
            dispatch(showMessage({ text: 'Please verify zipcode first', isSuccess: false }));
            return;
        }

        const locId = state.productDetailMap[`${state.size?.toLowerCase()}_${state.selectedSpeed?.toLowerCase()}`]?.locId;

        const req = {
            product_id: selectedChild.id,
            qty: state.defaultQuantity,
            api_token: localStorage.getItem('Token'),
            cart_id: localStorage.getItem('cart_id'),
            zipcode: localStorage.getItem('zipcode'),
            loc_id: locId,
            wallet: 0,
            speed_id: state.selectedSpeed,
        };

        setState(prev => ({ ...prev, addToCartLoading: true }));
        genericPostData({
            dispatch,
            reqObj: req,
            url: `/api/cart/addtocart`,
            constants: { init: 'ADD_TO_CART_INIT', success: 'ADD_TO_CART_SUCCESS', error: 'ADD_TO_CART_ERROR' },
            identifier: 'ADD_TO_CART',
            successCb: ([{ code, message, cart_id, total_products_in_cart }]) => {
                setState(prev => ({ ...prev, addToCartLoading: false }));
                if (code === 1) {
                    ProductAddedtoCart(
                        cleanEntityData({
                            productId: match.params.productID,
                            name: _get(productDetailsData, 'name'),
                            price: _get(productDetailsData, 'price'),
                            quantity: state.defaultQuantity,
                        })
                    );
                    localStorage.setItem('cart_id', cart_id);
                    localStorage.setItem('total_products_in_cart', total_products_in_cart);
                    if (_isEmpty(_get(userSignInInfo, '[0].result.api_token', ''))) {
                        history.push('/guest/register');
                    } else {
                        history.push('/cart');
                    }
                } else {
                    dispatch(showMessage({ text: message, isSuccess: false }));
                }
            },
            errorCb: () => setState(prev => ({ ...prev, addToCartLoading: false })),
            dontShowMessage: true,
        });
    }, [dispatch, history, match.params.productID, productDetailsData, selectedChild.id, state.defaultQuantity, state.productDetailMap, state.selectedSpeed, state.size, userSignInInfo]);

    const imageArr = useMemo(() => {
        return _reduce(_get(selectedChild, 'image', []), (acc, im) => {
            if (im && im.hasOwnProperty('small_image')) acc.push(_get(im, 'small_image', ''));
            else if (im && im.hasOwnProperty('additional_images')) {
                _map(_get(im, 'additional_images', []), a => acc.push(_get(a, 'additional_image', '')));
            }
            return acc;
        }, []);
    }, [selectedChild]);

    const galleryItems = useMemo(() => {
        return _map(imageArr, (url, i) => {
            if (!url) return null;
            let thumbnail = url;
            const separator = url.includes('?') ? '&' : '?';
            thumbnail = `${url}${separator}width=100&height=100&quality=80`;
            return {
                original: url,
                thumbnail,
                originalAlt: `Product image ${i + 1}`,
                thumbnailAlt: `Thumbnail ${i + 1}`,
            };
        }).filter(Boolean);
    }, [imageArr]);

    const handleSlide = useCallback((index) => {
        // No-op
    }, []);

    const renderCustomItem = (item) => (
        <div className="image-gallery-image">
            <img
                src={item.original || ''}
                alt={item.originalAlt}
                loading="lazy"
                style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
            />
        </div>
    );

    const safeGet = (obj, path) => {
        const value = _get(obj, path, null);
        return value === null || value === undefined || value === "" ? "N/A" : value;
    };

    const inStock = _get(selectedChild, 'stock_availability', '').toLowerCase() === 'in stock';
    const zipVerified = state.zipcodeVerified && !!localStorage.getItem('zipcode');

    // DEBUG: Remove in production
    console.log('productDetailsData:', productDetailsData);
    console.log('children:', children);
    console.log('selectedChild:', selectedChild);
    console.log('galleryItems:', galleryItems);

    if (state.isLoading) return <LoaderOverLay />;

    // Fallback if no product
    if (_isEmpty(productDetailsData) && !state.isLoading) {
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Product not found</div>;
    }

    return (
        <div className="page-content-container">
            <Container fluid className="productDetails">
                <Row className="no-gutters justify-content-lg-between secMinHeight w-100 main-conainer">
                    <Col
                        lg="4"
                        className={`pdp-image-galary ${isLargeScreen ? 'sticky-left' : ''}`}
                    >
                        <div className="proName top">
                            {safeGet(selectedChild, 'name')}
                        </div>
                        <div className="productImgSection proDetailSec">
                            <ImageGallery
                                key={selectedColorId}
                                ref={galleryRef}
                                items={galleryItems}
                                thumbnailPosition="left"
                                showBullets={isMobile}
                                showNav={false}
                                showFullscreenButton={false}
                                showPlayButton={false}
                                lazyLoad={true}
                                infinite={false}
                                useBrowserFullscreen={true}
                                onSlide={handleSlide}
                                renderItem={renderCustomItem}
                                disableThumbnailScroll={false}
                            />
                            <Button
                                className={`shareBtn ${isShareClicked ? 'clicked' : ''}`}
                                onClick={handleShare}
                                title="Copy product link"
                            >
                                <ShareIcon />
                                {showCopiedLabel && (
                                    <div className="share-copied-label">
                                        Link copied!
                                    </div>
                                )}
                            </Button>
                        </div>
                    </Col>

                    <Col className="pdp-info">
                        <div className="w-100">
                            <div className="proName mid">
                                {safeGet(selectedChild, 'name')}
                            </div>
                            <div className="rating-summary">
                                <div className="rating-stars">
                                    <span className="rating-value">{rating.toFixed(1)}</span>

                                    {[...Array(fullStars)].map((_, i) => (
                                        <StarIcon key={`full-${i}`} className="star full" />
                                    ))}
                                    {hasHalf && <StarHalfIcon className="star half" />}
                                    {[...Array(emptyStars)].map((_, i) => (
                                        <StarBorderIcon key={`empty-${i}`} className="star empty" />
                                    ))}

                                    <ExpandMoreIcon className="dropdown-icon" />
                                    <span className="rating-count">{totalRatings} ratings</span>
                                </div>

                                <div className="bought-info">
                                    <strong>{boughtCount} bought</strong> in past month
                                </div>
                            </div>
                            <div className="pdpFormSection">
                                <div className="price-section">
                                    <span className="main-price">
                                        {_get(selectedChild, "price") || state.price ? (
                                            <>
                                                <span className="currency">$</span>
                                                <span className="price-int">
                                                    {Math.floor(parseFloat(_get(selectedChild, "price") || state.price || 0))}
                                                    <sup className="price-dec">
                                                        {((parseFloat(_get(selectedChild, "price") || state.price || 0) % 1)
                                                            .toFixed(2)
                                                            .split(".")[1])}
                                                    </sup>
                                                </span>
                                                <span className="per-count">
                                                    (${parseFloat(_get(selectedChild, "price") || state.price || 0).toFixed(2)}/count)
                                                </span>
                                            </>
                                        ) : (
                                            <span className="price-na">N/A</span>
                                        )}
                                    </span>
                                </div>
                                <hr />
                                <div className="product-options">
                                    <div className="option-section">
                                        <h4>Color <span className="selected">{safeGet(selectedChild, 'color_theme')}</span></h4>
                                        <div className="option-grid">
                                            {children.map(child => (
                                                <div
                                                    key={child.id}
                                                    className={`option-card ${selectedColorId === child.id ? 'selected' : ''}`}
                                                    onClick={() => onColorChange(child.id)}
                                                >
                                                    <img src={_get(child, 'image[0].small_image', '')} alt={child.color_theme} className="option-img" />
                                                    <hr />
                                                    <p>{safeGet(child, 'color_theme')}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="option-section">
                                        <h4>
                                            Size <span className="selected">{safeGet(selectedChild, 'size')}</span>
                                        </h4>
                                        <div className="option-grid small">
                                            <div className="option-card selected">
                                                <p className="size-label">
                                                    {safeGet(selectedChild, 'size')}
                                                </p>
                                                <hr />
                                                <div className="size-info">
                                                    <div>${parseFloat(state.price || 0).toFixed(2)}</div>
                                                    <div>(${parseFloat(state.price || 0).toFixed(2)} / count)</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="option-section">
                                        <h4>
                                            Styles <span className="selected">{safeGet(selectedChild, 'style')}</span>
                                        </h4>
                                        {(() => {
                                            const isDisabled = false;
                                            const isSelected = true;

                                            return (
                                                <div className='option-grid'>
                                                    <div
                                                        className={`option-card ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                                                    >
                                                        <img
                                                            src={_get(selectedChild, 'image[0].small_image', '')}
                                                            alt="vash"
                                                            className="option-img"
                                                        />
                                                        <hr />
                                                        <div className="style-note">
                                                            <h3 className='h3' ><b>{safeGet(selectedChild, "style")}</b></h3>
                                                            <span>1 option from</span>
                                                            <span className="price">₹{safeGet(selectedChild, "price")}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                    </div>
                                    <div className="option-section">
                                        <h4>
                                            Delivery By{" "}
                                            <span className="selected">
                                                {state.selectedSpeed || "N/A"}
                                            </span>
                                        </h4>

                                        <div className="option-grid">
                                            {_get(selectedChild, "speed_id", []).map((option, index) => {
                                                const isSelected = option.Type === state.selectedSpeed;
                                                const isDisabled = !option.active;
                                                const type = option.Type?.toLowerCase() || "";

                                                const iconMap = {
                                                    "same day": <LocationOnIcon fontSize="large" />,
                                                    "next day": <LocalShippingIcon fontSize="large" />,
                                                    "farm direct": <NatureIcon fontSize="large" />,
                                                };
                                                const Icon = iconMap[type] || <LocationOnIcon fontSize="large" />;

                                                return (
                                                    <div
                                                        key={index}
                                                        className={`option-card ${isSelected ? "selected" : ""} ${isDisabled ? "disabled" : ""}`}
                                                        onClick={() => {
                                                            if (isDisabled) return;
                                                            onSpeedChange(option.Type);
                                                        }}
                                                    >
                                                        <div className="option-icon">{Icon}</div>
                                                        <p className="delivery-type">{safeGet(option, 'Type')}</p>
                                                        <span className="delivery-note">
                                                            {type === "same day"
                                                                ? "Nationwide fast delivery"
                                                                : type === "next day"
                                                                    ? "Hand delivery"
                                                                    : type === "farm direct"
                                                                        ? "Fresh from farm"
                                                                        : "N/A"}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="product-properties">
                                <div className="label">Brand:</div>
                                <div>{safeGet(selectedChild, "brand_name")}</div>
                            </div>
                            <div className="product-properties">
                                <div className="label">Product Type:</div>
                                <div>{safeGet(selectedChild, "product_type")}</div>
                            </div>
                            <div className="product-properties">
                                <div className="label">Product Category:</div>
                                <div>{safeGet(selectedChild, "product_category")}</div>
                            </div>
                            <div className="product-properties">
                                <div className="label">Country of Origin:</div>
                                <div>{safeGet(selectedChild, "country_of_origin")}</div>
                            </div>
                            <div className="product-properties">
                                <div className="label">Color:</div>
                                <div>{safeGet(selectedChild, "color_theme")}</div>
                            </div>
                            <div className="product-properties">
                                <div className="label">Number Of Items:</div>
                                <div>{safeGet(selectedChild, "flower_count")}</div>
                            </div>
                            <hr />
                            <h1 className="sectionTitle">About this item:</h1>
                            <div className="product-description">{safeGet(selectedChild, 'short_description')}</div>
                            <hr />
                        </div>
                    </Col>
                    <Col
                        lg="3"
                        className={`pdp-buy ${isLargeScreen ? 'sticky-right' : ''}`}
                    >
                        <div className="free-delivery-banner">
                            <div className="price-section">
                                <span className="main-price">
                                    {_get(selectedChild, "price") || state.price ? (
                                        <>
                                            <span className="currency">$</span>
                                            <span className="price-int">
                                                {Math.floor(parseFloat(_get(selectedChild, "price") || state.price || 0))}
                                                <sup className="price-dec">
                                                    {((parseFloat(_get(selectedChild, "price") || state.price || 0) % 1)
                                                        .toFixed(2)
                                                        .split(".")[1])}
                                                </sup>
                                            </span>
                                            <span className="per-count">
                                                (${parseFloat(_get(selectedChild, "price") || state.price || 0).toFixed(2)}/count)
                                            </span>
                                        </>
                                    ) : (
                                        <span className="price-na">N/A</span>
                                    )}
                                </span>
                            </div>
                            {/* <div className="free-delivery-today">
                                FREE Delivery
                                <strong>Monday,<br /> November 10</strong>
                            </div>
                            <div className="countdown-banner">
                                <div className="countdown-text">
                                    Get FREE Delivery <strong>Thursday, November <br /> 6</strong>. Order within{' '}
                                    {timeLeft.hours} Hr {formatTime(timeLeft.minutes)} Mins.
                                </div>
                            </div> */}
                            <div className="location">
                                <ZipcodeInput
                                    zipcode={state.zipcode}
                                    onCheck={onZipLookup}
                                    onZipChange={() => {
                                        setState(prev => ({
                                            ...prev,
                                            zipcodeVerified: false,
                                            zipCodeMessage: '',
                                        }));
                                    }}
                                    loading={state.zipcodeLoading}
                                    verified={state.zipcodeVerified}
                                    zipcodeLength={ZIPCODE_LENGTH}
                                    message={state.zipCodeMessage}
                                />
                            </div>
                            <div className="stock-status">{safeGet(selectedChild, 'stock_availability')}</div>
                            {!zipVerified && (
                                <div className="zip-required-message">
                                    Please enter and verify your zip code to buy.
                                </div>
                            )}
                            {zipVerified && (
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
                                            <CircularProgress size={12} className="circleprogress" />
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
            {/* <FrequentlyBought /> */}
            {/* <hr /> */}
            <ManufacturerInfo />
            <hr />
            <div className='prod-des'>
                <h3>Product Description</h3>
                <p>{safeGet(selectedChild, "description")}</p>
            </div>
            <hr />
            <ProductCard />
            <hr />
            <div className='prod-des'>
                <h3>Important information</h3>
                <h5>Legal Disclaimer</h5>
                <p>Statements regarding dietary supplements have not been evaluated by the FDA and are not intended to diagnose, treat, cure, or prevent any disease or health condition.</p>
            </div>
            <hr />
            <ReviewsComponent />
        </div>
    );
};

const mapStateToProps = state => ({
    productDetailsData: _get(state, 'productDetails.lookUpData', {}),
    userSignInInfo: _get(state, 'userSignInInfo.lookUpData', []),
});

export default connect(mapStateToProps)(ProductDetails);