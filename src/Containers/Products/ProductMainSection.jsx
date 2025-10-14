import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { map as _map, findIndex as _findIndex, get as _get } from 'lodash';
import genericGetData from "../../Redux/Actions/genericGetData";
import { isEmpty as _isEmpty } from 'lodash';
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
import WithLoading from '../../Global/UIComponents/LoaderHoc';
import proImg from '../../assets/images/party-can.png';
import proImg1 from '../../assets/images/party-can-product-01.png'
const styles = theme => ({
});

class ProductsContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    componentDidMount(){
        window.scrollTo(0, 0);
        // this.fetchTabs();
    }

fetchTabs = () => {
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

categoriesFetchSuccess = (data) => { }

categoriesFetchError = () => { }

redirectToCategories = (category) => {
    this.props.history.push(`/category/${category.category_name}`)
}

redirectToCansPage = () => {
    this.props.history.push('/category/ALL')
}
    

    render() {
        const { categoriesList, classes } = this.props;
        let CategoryList = []
        !_isEmpty(categoriesList) && categoriesList.map((category, index)=>{
            CategoryList.push(        

                <Card onClick={()=>this.redirectToCategories(category)}>
                <div className="prodcutMinDetails">
                    <CardImg src={proImg1} alt="Card image cap" />
                    <CardBody>
                    <CardTitle className=" text-white text-center text-uppercase">{category.category_name}</CardTitle>
                    </CardBody>
                </div>
                </Card>
            )
        })
        return (
            <React.Fragment>
                <CssBaseline />
                <div style={{height: "350px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
                    <div class="block-title p-5">SHOP</div>
                    <div onClick={this.redirectToCansPage} className="d-flex justify-content-center mt-4 mb-4">
                        <img src={proImg} alt="Smileyface" height="250" width="100"></img></div>
                    
                    </div>
                {this.props.categoriesList && this.props.categoriesList.length > 0 && 
                <div className="productsList">
                    {CategoryList}
                </div> }
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    let categoriesList = _get(state,'categoriesList.lookUpData.data');
    let isLoading = _get(state, 'categoriesList.isFetching')
    return {categoriesList, isLoading}
    }
export default connect(mapStateToProps)(withStyles(styles)(WithLoading(ProductsContainer)));