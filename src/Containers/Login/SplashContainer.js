import { Button } from '@material-ui/core';
import React, { useState }  from 'react';
import PropTypes from 'prop-types';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import {map, set} from 'lodash';
import genericGetData from '../../Redux/Actions/genericGetData';
import {Container, Row, Col} from 'reactstrap'
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from 'react-responsive-carousel';
import ReactDOM from "react-dom";
import { Loader } from '../../Global/UIComponents/LoaderHoc';
import { isMobile, isTablet } from 'react-device-detect';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';

const styles = theme => ({   
});

class SplashContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            mobileImageData: [],
            deskTopImageData: [],
            slideIndex: 0,
            isLoading : false
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.setState({ isLoading: true});
        genericGetData({
            dispatch:this.props.dispatch,
            url:"/connect/index/banners?store_id=1",
            constants:{
            init:"SPLASH_BANNER_INIT",
            success:"SPLASH_BANNER_SUCCESS",
            error:"SPLASH_BANNER_ERROR" 
            },
            identifier:"SPLASH_BANNER",
            successCb:this.splashBannerSuccess,
            errorCb:this.splashBannerFetchError,
            dontShowMessage: true
        });
    }

    splashBannerSuccess= (data) => {
        this.setState({ mobileImageData: data[1] , deskTopImageData : data[0], isLoading: false});
    }
    splashBannerFetchError = (data) => {
        this.setState({ isLoading: false});
    }
    handleSlideChange = () => {
        this.setState({ slideIndex :  this.state.slideIndex + 1});
    }
    redirectToNext = () => {
        // this.fetchCategories();
    }

    fetchCategories = () => {
        const couriertype = localStorage.getItem("couriertype");
        genericGetData({
            dispatch:this.props.dispatch,
            url:"/connect/index/categorylist?store_id=1&courier_type="+couriertype,
            constants:{
            init:"CATEGORIES_LIST_INIT",
            success:"CATEGORIES_LIST_SUCCESS",
            error:"CATEGORIES_LIST_ERROR" 
            },
            identifier:"CATEGORIES_LIST",
            successCb:this.categoriesFetchSuccess,
            errorCb:this.categoriesFetchError,
            dontShowMessage: true
        })
    }
    
    categoriesFetchSuccess = (data) => {

        this.props.history.push('/category/ALL');
     }
    
    categoriesFetchError = () => { }

    handleIndicator = (event) => {
        this.setState({ slideIndex :  event});
    }

    render() {
        const { classes } = this.props;

        let renderSlide = this.state.mobileImageData.map((subdata,index) => {
            return(<React.Fragment key={index}>
               
                    <div className= "d-block d-lg-none splashSlides" style={{backgroundImage: `url(${subdata.imageurl})`}} >
                        <div className="captionTxt">
                        <span className="textGreen">BRING THE<br></br><b className="tBold">PARTY</b> HOME.</span>
                            <span className="textBlue mt-4 mt-xl-5">SERVES <b className="tBold">12</b> COCKTAILS<br></br>IN SECONDS!</span>
                            <span className="textRed mt-4 mt-xl-5">MADE WITH <b className="tBold">100%</b><br></br>REAL JUICE.</span>
                       
                        <Button variant="contained"  onClick={this.redirectToNext} color="primary" className="bottomActionbutton mt-5" type="submit">
                            <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> LET'S PARTY</Button>
                        </div>
                    </div>
               
            {/* <div className={isMobile ? "d-flex justify-content-center flex-column align-items-center h-100" 
                : " d-flex justify-content-center align-items-center h-100 "}>
                  <img src={subdata.imageurl}  className="img-responsive d-none d-md-block"  />
                  <img src={subdata.imageurl}  className="img-responsive d-block d-md-none"  />
                    <p className="legend">{subdata.text}</p>
                </div> */}
                       
            </React.Fragment>)
        })

        let renderDesktopSlide = this.state.deskTopImageData.map((subdata,index) => {
            return(<React.Fragment key={index}>
              
                <div className= "d-none d-lg-block splashSlides"  style={{backgroundImage: `url(${subdata.imageurl})`}}  >
                        <div className="captionTxt">
                            <span className="textGreen">BRING THE<br></br><b className="tBold">PARTY</b> HOME.</span>
                            <span className="textBlue mt-4 mt-xl-5">SERVES <b className="tBold">12</b> COCKTAILS<br></br>IN SECONDS!</span>
                            <span className="textRed mt-4 mt-xl-5">MADE WITH <b className="tBold">100%</b><br></br>REAL JUICE.</span>
                            <Button variant="contained"  onClick={this.redirectToNext} color="primary" className="bottomActionbutton mt-5" type="submit">
                             <ArrowForwardIcon style={{ fontSize: 16 }} className="mr-2" /> LET'S PARTY</Button>
                        </div>
                </div>
              
            </React.Fragment>)
        })

        return ( 
            <React.Fragment>
             {this.state.isLoading && <Loader /> }
            {this.state.deskTopImageData.length > 0 && <div className="WhiteCurveBg">
                     <CssBaseline />               
                      <div className="IntroSlider" >                         
                        {this.state.mobileImageData.length > 0 && renderSlide}
                        {this.state.deskTopImageData.length > 0 && renderDesktopSlide}
                      
                      {/* {this.state.imageData.length > 0 && renderSlide}
                        <Carousel showThumbs={false} dynamicHeight={false} showStatus={false} showArrows={false}
                            selectedItem= {this.state.slideIndex} onChange={this.handleIndicator}  >
                                {this.state.imageData.length > 0 && renderSlide}
                        </Carousel>   */}
                    </div>                   
                </div>}
                {/* {this.state.imageData.length > 0 && 
                <Container className="container-custom">
                    <Row>
                        <Col className="text-center" style={{height:70}} >
                            <Button variant="text" color="secondary" className="txtButton" 
                                onClick={this.state.slideIndex == 2 ? this.redirectToNext: this.handleSlideChange}>
                                         {this.state.slideIndex == 2 ? ' SHOP NOW !!' : 'NEXT' }
                            </Button>
                        </Col>                        
                    </Row>
                 </Container>}        */}
         </React.Fragment>
        );
    }
}

SplashContainer.propTypes = {
    classes: PropTypes.object.isRequired,
};


function mapStateToProps(state) {
return {}
}
export default connect(mapStateToProps)(withStyles(styles)(SplashContainer));