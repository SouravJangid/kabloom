
import React from 'react';
import {Container, Row, Col} from 'reactstrap';
import { connect } from 'react-redux';


class ContactUs extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    componentDidMount() {
        window.scrollTo(0, 0);
    }


    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>          
            
            <Container className="peripheralContent">
            <div className="row my-5">
          <div className="col-md-12">    
                    <div style={{ marginTop: "50px", display: "flex", flexDirection: "row", justifyContent: "center" }} className="col-md-12 mb-4"><h1>CONTACT US</h1></div>
                    <div className="col-md-12" style={{ textAlign: "justify", textJustify: "inter-word" }}>
                        <div style={{ marginTop: "30px", display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <p>
                            Welcome to Kabloom's Customer Service page
                        </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <p>
                            How may we help you?
                        </p>
                        </div>
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" }}>
                            <p>
                            Create an account to track orders, tickets and edit your profile.
                        </p>
                        </div>
                    </div>
                    <div style={{ marginTop: "50px", display: "flex", flexDirection: "row", justifyContent: "center" }} className="col-md-12 mb-4"><h2>FOR GENERAL INQUIRIES AND CUSTOMER CARE ASSISTANCE</h2></div>
                    <div className="col-md-12">
                        <div style={{ display: "flex", flexDirection: "row", justifyContent: "center" , wordBreak:"break-word"}}>
                            <div className='d-flex flex-column align-items-center'>
                                <p>
                                    We are available Mon - Fri, 9am - 5pm EST
                                </p>
                            
                                <p>
                                    1-800-Kabloom , (1-800-522-5666)
                                </p>
                                <p>
                                    customerservice@kabloomcorp.com
                                </p>
                            </div>
                            
                            
                        </div>
                    </div>
                    {/* <div style={{ marginTop: "50px", display: "flex", flexDirection: "row", justifyContent: "center", wordBreak:"break-word" }} className="col-md-12 mb-4">
                        <h2>CUSTOMER CARE AGENTS ARE AVAILABLE FROM 9AM-7PM, MONDAY-FRIDAY</h2></div> */}
                </div>
                </div>
                </Container>
            </React.Fragment>
        );
    }
}

function mapStateToProps(state) {
    return { }
}
export default connect(mapStateToProps)(ContactUs);