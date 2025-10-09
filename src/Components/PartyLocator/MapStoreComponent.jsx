
import React from 'react';

import { connect } from 'react-redux';
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'
import {
  Card, CardImg, CardBody
} from 'reactstrap';
import hotelImage from '../../assets/images/hotel_bar_demo.jpg';








class MapStoreComponent extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentIndex: 7,
            itemsInSlide: 1,
            responsive: { 0: { items: 5 } },
            galleryItems: this.galleryItems(),
            stagePadding: { paddingLeft: 30, paddingRight: 30 }
        }
        
    }
     
    galleryItems() {
      return Array(50)
        .fill()
        .map((item, i) => {
          return (
            <Card  style={{ marginRight: 10, cursor: 'pointer' }} onClick={() => this.handleSotreOnClick(i)}>
              <CardImg top width="100%" src={hotelImage} alt="Hotel Image" />
                    <CardBody style={{ color: 'black'}}>
                        <div >
                            BINNY'S
                        </div>
                        <div >
                           LOGAN SQ. - 2.5 MI
                        </div>                      
                    </CardBody>
                </Card>
          );
        })
    }
     
    
    handleSotreOnClick = (id) => {
      console.log(id);
      this.setState({
        selectedStoreId: id
      })
    };
      handleOnSlideChange = (event) => {
        const { itemsInSlide, item } = event
        this.setState({ itemsInSlide, currentIndex: item })
        // this.setState({ currentIndex: 2});
      }

      handleOnInitialChange = (event) => {
        // const { itemsInSlide, item } = event
        // this.setState({ itemsInSlide, currentIndex: item })
        this.setState({ currentIndex: 2});
      }

      slidePrevPage = () => {
        const currentIndex = this.state.currentIndex - this.state.itemsInSlide
        this.setState({ currentIndex })
      }
     
      slideNextPage = () => {
        const {
          itemsInSlide,
          galleryItems: { length },
        } = this.state
        let currentIndex = this.state.currentIndex + itemsInSlide;
        if (currentIndex > length ) currentIndex = length
     
        this.setState({ currentIndex })
      }

    
    
    
      

    render() {
        const { currentIndex, galleryItems, responsive,stagePadding } = this.state

        
        return (
            <React.Fragment>
                <div>
                    <AliceCarousel
                    items={galleryItems}
                    slideToIndex={currentIndex}
                    responsive={responsive}
                    dotsDisabled={true}
                    mouseTrackingEnabled={true}
                    buttonsDisabled={true}
                    onInitialized={this.handleOnInitialChange}
                    onSlideChanged={this.handleOnSlideChange}
                    stagePadding={stagePadding}
                    showSlideInfo={true}
                    // playButtonEnabled={true}
                    // onResized={this.handleOnSlideChange}
                    />
                    {/* <button onClick={this.slidePrevPage}>Prev Page</button>
                    <button onClick={this.slideNextPage}>Next Page</button> */}
                    
                </div>
                             
            </React.Fragment>
        );
    }
}



function mapStateToProps(state) {
    return {
    };
}
export default connect(mapStateToProps)(MapStoreComponent);