import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import { isArray as _isArray, map as _map, findIndex as _findIndex, get as _get, isEmpty as _isEmpty } from 'lodash';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button
} from 'reactstrap';
import ProductDetails from "../ProductComponents/ProductDetails"

const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
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
    
   });

class ProductsListing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showProductDetailsPage: false,
            prodId: ""
        }
    }

    fetchProductDetails = (ProductID) => {
        let categoryName = _get(this.props, `categoriesList[${this.props.tabValue}].category_name`, null)
        this.props.history.push(`/category/${categoryName}/product/${ProductID}`)
    }

    productDetailsFetchSuccess = () => {
    }

    productDetailsFetchError = () => {

    }

    render() {
        const { productListingData, classes } = this.props;
        let ProductList = []
        _isArray(productListingData) && productListingData.map((product, index)=>{
            ProductList.push(
                <Card onClick={()=>this.fetchProductDetails(product.id)} key={index}>
                    <div className="prodcutMinDetails">
                        <CardImg src={product.image} alt="Card image cap" />
                        <CardBody>
                        <CardTitle className=" textBlack text-center text-uppercase">{product.name}</CardTitle>
                        </CardBody>
                    </div>
                </Card>
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
    let productListingData = _get(state,'productList.lookUpData');
    return {productListingData}
    }
export default connect(mapStateToProps)(withStyles(styles)(ProductsListing));