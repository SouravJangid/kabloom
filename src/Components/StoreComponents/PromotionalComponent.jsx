import React from 'react';

import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';

import { map as _map, get as _get, findIndex} from 'lodash';
import { Container, Row, Col } from 'reactstrap'
import {
  Card, CardImg, CardBody
} from 'reactstrap';
import wineImage from '../../assets/images/wine-shop-banner.jpg';
import beerImage from '../../assets/images/beer-shop-now.jpg';


const styles = () => {

};
class  PromotionalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }

    componentDidMount() {

    }

    handleSotreOnClick = (id) => {
        // const index = findIndex(this.props.categoriesList, (o)=> {
        //     return o?.category_id == id
        // })
        // const categoryName = this.props.categoriesList[index].category_name;
        // // const categoryId = this.props.categoriesList[index].child[0].category_id;
        // this.props.history.push(`/store/category/${categoryName}/${categoryName}/${id}`)

        this.props.history.push(`/store/category/${id}`)


        // // Redirect to a new page
        // const { history } = this.props;
        // const redirectionCategory = process.env.REACT_APP_HOME_REDIRECTION_CATEGORY;

        
        
        // history.push("/store/category/Valentine's%20Collection/Valentine's%20Collection/"+redirectionCategory); // Redirect to "/new-page"
        // // https://kabloom.com/store/category/Valentine's%20Collection/Valentine's%20Collection/1017
    };

    render() {
        const { classes } = this.props;

        const promo = _map(_get(this.props,'ads[0]', []), (val, key) => {
            return (
                <React.Fragment key={key}>                   
                        <Col md={6}  style={{cursor: 'pointer' }} onClick={() => this.handleSotreOnClick(val.link)}>
                            <img  src={val.imageurl} alt="Hotel Image" className="img-fluid border" />
                        </Col>
                        {/* <Col md={6}  style={{cursor: 'pointer' }} onClick={() => this.handleSotreOnClick(val)}>
                            <img  src={val.imageurl} alt="Hotel Image" className="img-fluid border" />
                        </Col> */}
                    
                </React.Fragment>
            )
        })
        
        return (
            <React.Fragment>
                <Row >
                    {promo}
                    
                </Row>

            </React.Fragment>
            
        )
    };
};

function mapStateToProps(state) {
    let categoriesList = _get(state,'categoriesList.lookUpData.data');
    return {categoriesList}
}

export default connect(mapStateToProps)(withStyles(styles)(PromotionalComponent));