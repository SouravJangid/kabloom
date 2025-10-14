import React from "react";
import { withRouter } from "react-router-dom"
import { Container, Row, Col } from 'reactstrap'
import { Button } from 'reactstrap';
import cartEmptyImg from '../../assets/images/emptycart.png'
const CartEmptyComponent = (props) => {
    return (

        <Container fluid={true} >
            <Row className="no-gutters  secMinHeightwt">
                <Col xs={12} className="d-flex p-xl-5 p-md-4 py-4 flex-column justify-content-center align-items-center">
                    <div className="emptyCart">
                        <img src={cartEmptyImg} alt="CartImage" className="img-fluid" ></img>                       
                        </div>
                    <div>Hey fill me, i am Empty</div>
                    <Button variant="contained" color="primary" className="mt-4 bottomActionbutton cartActionBtn" onClick={() => props.history.push("/store")}>
                        Start Shopping
                    </Button>

                </Col>
            </Row>
        </Container>
    )
}

export default withRouter(CartEmptyComponent);