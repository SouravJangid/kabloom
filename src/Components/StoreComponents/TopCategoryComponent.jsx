import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import { connect } from 'react-redux';
import Carousel from 'react-multi-carousel';
import "react-multi-carousel/lib/styles.css";
import {
    Card, CardImg, CardBody, Button
} from 'reactstrap';
import wineImage from '../../assets/images/White-Chalk-Hill-Sonoma-Coast-Chardonnay-2016.jpg';
import hotelImage from '../../assets/images/hotel_bar_demo.jpg';
import everestVodka from '../../assets/images/355799279717459570466615420087363375618.png'
import { map as _map, get as _get, find as _find, sortBy, isEmpty as _isEmpty, filter as _filter } from 'lodash';
import { commonActionCreater } from "../../Redux/Actions/commonAction";

import { ProductClick } from '../../Global/helper/react-ga';
import { cleanEntityData, deliveryMethods, productListingDeliveryMethods } from '../../Global/helper/commonUtil';

const styles = () => {
};
class TopCategoryComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            defaultQuantity: 1,
            productPrice: "",
            showReviews: false,
            slideIndex: 0,
            isLoading: true,
            responsive: {
                superLargeDesktop: {
                    // the naming can be any, depends on you.
                    breakpoint: { max: 4000, min: 1200 },
                    items: 4,
                    slidesToSlide: 4
                },
                desktop: {
                    breakpoint: { max: 1199, min: 768 },
                    items: 3,
                    slidesToSlide: 3
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
            topProductActiveIndex: []
        }
    }

    componentDidMount() {
        let data = [];
        _map(_get(this.props, 'productsperadd'), (parent) => {
            data.push({ childBottleIndex: 0 })
        })
        this.setState({ topProductActiveIndex: data });

    }

    redirectToPDP = (item, bottleSize, childId) => {
        const bottleSizeDetail = _find(_get(item, 'child'), ['bottle_size', bottleSize])
        const payload = cleanEntityData({
            productId: _get(item, 'id'),
            name: _get(item, 'name'),
            variant: bottleSize,
            price: _get(bottleSizeDetail, 'price') ? Number(_get(bottleSizeDetail, 'price')) : undefined,
        });
        ProductClick(payload);


        this.props.dispatch(commonActionCreater(bottleSize, "SET_BOTTLE_SIZE"));
        this.props.dispatch(commonActionCreater(childId, "SET_BOTTLE_ID"));
        let ProductID = _get(item, "id", null);
        this.props.history.push(`/store/${ProductID}`);
        // this.props.updateProductId(ProductID);
    }
    getleastPrice = (product) => {
        let maxNumber = 999999999999;
        let leastPrice = 0;
        let reduce = product?.child.map((x) => {
            maxNumber = Number(x.price) < maxNumber ? Number(x.price) : maxNumber
        });
        // console.log("calculating the least price", maxNumber)
        return maxNumber;
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

    render() {

        let renderTopProductChild = (data, parentIndex) => data && sortBy(data, [function (o) { return parseInt(o.bottle_size); }]).map((subItem, childIndex) => {
            return (<React.Fragment key={childIndex}>
                <Button className={_get(this.state, `topProductActiveIndex[${parentIndex}].childBottleIndex`, 0)
                    === childIndex ? 'active' : ''}
                    onClick={() => this.setBottleSizeIndex(parentIndex, childIndex)}
                    onMouseOver={() => this.setBottleSizeIndex(parentIndex, childIndex)}>
                    {subItem.bottle_size}
                </Button>
            </React.Fragment>)
        })

        let galleryItems = _map(sortBy(_get(this.props, 'productsperadd', []), [function (o) { return parseInt(o.bottle_size); }]), (it, parentIndex) => {
            let smallImage = '';
            
            const filteredChildItem = _filter(_get(it, 'child', []), (i) => {
                // _map(_get(i, 'image', []), im => {
                //     console.log('small image', im);
                //     if (im.hasOwnProperty('small_image')) {
                //         smallImage = _get(im, 'small_image');
                //     }
                // })
                
                

                if (_get(i, 'bottle_size') != '0') {
                    return i;
                }
            });

            // let imageObj = _get(it, 'image');
            // if (imageObj.hasOwnProperty('small_image')) {
            //     smallImage = _get(imageObj, 'small_image');
            // }

            
            _map(_get(it, 'image', []), im => {
                if (im.hasOwnProperty('small_image')) {
                    smallImage = _get(im, 'small_image');
                }
            })
            const item = {
                ...it,
                child: filteredChildItem,
                smallImage
            };
            // console.log(item.smallImage, 'check item');
            let mapSpeedButton = (data, parentIndex) => _map(data, (subItem, childIndex) => {
                // console.log(subItem, 'check sub');
                subItem = productListingDeliveryMethods[`${subItem}`];
                return (<React.Fragment key={childIndex}>
                    <span className='speed-type-name'>
                        {subItem}
                        {/* {deliveryMethods(subItem)} */}
                    </span>
                </React.Fragment>)
            })
            const productDeliveryType = item?.child?.reduce((acc, curr) => {
                const currentTypes = new Set(_get(curr, "speed_id", []).map(item => item.Type));
                return new Set([...acc, ...currentTypes]);
            }, new Set());
            const productDeliveryTypeArray = Array.from(productDeliveryType);
            // console.log(_get(item, 'smallImage'), 'checking small image')
            return (
                <React.Fragment key={parentIndex}>
                    <div onClick={() => this.redirectToPDP(item, _get(item, `child[${this.getActiveChildIndex(parentIndex)}].bottle_size`, ''), _get(item, `child[${this.getActiveChildIndex(parentIndex)}].id`, ''))} className="storeItemsList mb-5">
                        <div >
                            {/* <div style={{ backgroundImage: `url(${item.child[0]?.image})` }} className="listProductImg"> */}
                            <div style={{ backgroundImage: `url(${_get(item, 'smallImage', '')})`}} className="listProductImg">
                                {/* <div style={{ backgroundImage: `url(${everestVodka})` }} className="listProductImg"> */}
                            </div>                            
                            <div className="productName" title={_get(item, 'name')}>
                                {_get(item, 'name')}
                            </div>
                            {/* <div className="displaySize">

                                {_get(item, `child[${Math.abs(this.getActiveChildIndex(parentIndex))}].bottle_size`, '')}
                            </div> */}
                            {_get(item, `child[${this.getActiveChildIndex(parentIndex)}].price`) > 0 &&
                                <div className="dispalyPrice mb-2">
                                    <i>from</i> ${this.getleastPrice(item)}
                                </div>
                            }
                            <div className='speed-type mt-3'><LocalShippingOutlinedIcon className='mr-1' />{mapSpeedButton(productDeliveryTypeArray, parentIndex)}</div>

                            {/* {item && item.child && item.child.length ? <div className="availableSize">
                                
                                {_isEmpty(_get(item, 'child')) ? '' : _get(item, 'child').length === 1 ? `${_get(item, 'child').length} size available` : `${_get(item, 'child').length} sizes available`}
                            </div> : null} */}
                            
                        </div>
                    </div>
                </React.Fragment>
            );
        })

        return (
            <React.Fragment>
                <div className="productListCarousel">
                    <Carousel responsive={this.state.responsive} showDots={false} itemClass="">
                        {galleryItems}
                    </Carousel>

                </div>

            </React.Fragment>

        )
    };
};

function mapStateToProps(state) {

    return {}
}

export default connect(mapStateToProps)(withStyles(styles)(TopCategoryComponent));