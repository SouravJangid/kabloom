import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import {
  Card, CardImg, CardBody
} from 'reactstrap';
import hotelImage from '../../assets/images/store-top-banner.jpg';
import {get as _get, map as _map, find as _find} from 'lodash';

import { PromotionEvent } from '../../Global/helper/react-ga';
import { cleanEntityData } from '../../Global/helper/commonUtil';
import ImageGallery from 'react-image-gallery';

const styles = () => {

};
class RecentActivityComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 0,
            itemsInSlide: 1,
            responsive: { 0: { items: 1 } },
            galleryItems: this.galleryItems(),
            // stagePadding: { paddingLeft: 30, paddingRight: 30 }
        }
    }

    componentDidMount() {
    }

    galleryItems() {
        return _get(this.props,'banners',[])
          .map((item, i) => {
            console.log(this.props.banners, 'banner 1'); // Check the content of banners
            return (
              <Card  style={{cursor: 'pointer' }} onClick={() => this.handleSotreOnClick(item)} key={i}>
                <CardImg top width="100%"  src={item.imageurl} alt="Hotel Image" />
                      {/* <CardBody style={{ color: 'black'}}>
                          <div >
                              BINNY'S
                          </div>
                          <div >
                             LOGAN SQ. - 2.5 MI
                          </div>                      
                      </CardBody> */}
                  </Card>
            );
        })
    };
    handleSotreOnClick = (item) => {
        
        // const payload = cleanEntityData({
        //     productId: _get(item, 'id'),
        //     name: _get(item, 'name'),
        //     creative: _get(item, 'creative'),
        //     position: _get(item, 'position')

        // });
        // // console.log(payload);
        // PromotionEvent(payload);


        
        // Redirect to a new page
        const { history } = this.props;
        const redirectionCategory = process.env.REACT_APP_HOME_REDIRECTION_CATEGORY;
        
        history.push("/store/category/Valentine's%20Collection/Valentine's%20Collection/"+redirectionCategory); // Redirect to "/new-page"
        // https://kabloom.com/store/category/Valentine's%20Collection/Valentine's%20Collection/1017
        
    };
    handleImageClick = () => {
        const index = this.gallery.getCurrentIndex(); // Gets current image index
        const currentImage = this.thumbImages[index]; // Assuming passed via props
        
        // const categoryDetail = _find(this.props.categories, ['category_id', _get(currentImage, 'link')]);
        
        // const categoryName = _get(categoryDetail, 'category_name', '');
        // this.props.history.push(`/store/category/${categoryName}/${categoryName}/`+_get(currentImage, 'link'));

        // console.log('link', `/store/category/${_get(currentImage, 'link')}`)

        this.props.history.push(`/store/category/${_get(currentImage, 'link')}`);
      
        // You can now open a modal, navigate, etc.
      };
    thumbImages = _map(_get(this.props,'banners',[]), s => cleanEntityData({
        original: s.imageurl,
        thumbnail: s.imageurl,
        link: s.link
    }));

    render() {
        const { classes } = this.props;
        const { currentIndex, galleryItems, responsive } = this.state
        
        return (
            <React.Fragment>
                {/* <div>
                    <AliceCarousel
                    items={galleryItems}
                    slideToIndex={currentIndex}
                    responsive={responsive}
                    dotsDisabled={true}
                    // mouseTrackingEnabled={true}
                    buttonsDisabled={false}
                    onInitialized={this.handleOnInitialChange}
                    onSlideChanged={this.handleOnSlideChange}
                    keysControlDisabled={true}
                    // stagePadding={stagePadding}
                    showSlideInfo={false}
                    infinite={true}
                    disableButtonsControls={false}
                    disableDotsControls={false}
                    // playButtonEnabled={true}
                    // onResized={this.handleOnSlideChange}
                    />
                    
                    
                </div> */}
                <div>
                <ImageGallery ref={(gallery) => { this.gallery = gallery; }} items={this.thumbImages} 
                                                    showNav={false}
                                                    showFullscreenButton={false}
                                                    showPlayButton={false}
                                                    showThumbnails={false}
                                                    autoPlay={true}
                                                    showBullets={true}
                                                    onClick={this.handleImageClick}
                                                     />
                </div>

            </React.Fragment>
            
        )
    };
};

function mapStateToProps(state) {
    let categories = _get(state, 'categoriesList.lookUpData.data', []);
    
    return {categories}
}

export default connect(mapStateToProps)(withStyles(styles)(RecentActivityComponent));