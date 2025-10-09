import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
import { Button, Badge, Snackbar } from '@material-ui/core';
// import Logo from '../../../src/assets/images/drinksbucket-logo.png'
import Logo from '../../../src/assets/images/kabloom-logo.png';
import { Container, Row, Col } from 'reactstrap';
import _get from "lodash/get";
import InboxOutlinedIcon from '@material-ui/icons/InboxOutlined';
import { logoutActionCreator } from '../../Redux/Actions/logoutAction';
import ShoppingCartOutlinedIcon from '@material-ui/icons/ShoppingCartOutlined';
import PermIdentityOutlinedIcon from '@material-ui/icons/PermIdentityOutlined';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ChangeAddressDialogue from './ChangeAddressDialogue';
import PersonOutlineIcon from '@material-ui/icons/PersonOutline';
const styles = theme => ({

});

class WithoutCategoryHeaderBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showUserMenuOption: false,
            showDialogueBox: false,
            showChangeButtonBox: false,
            isPinCodeChanged: false,
            openSnackbar: false,
        }
    }

    showUserMenu = () => {
        this.props.showUserMenu();
    }
    handleSettingClick = () => {
        this.props.history.push("/setting/user");
    }

    handleOrderClick = () => {
        this.props.history.push("/setting/order");
    }

    handleSignInClick = () => {
        this.props.history.push("/signIn");
    }
    handleCreateAccountClick = () => {
        this.props.history.push("/createAccount");
    }
    handleLogout = () => {
        this.props.dispatch(logoutActionCreator());
        this.props.history.push("");
        window.location.reload();

    }
    showPinCodeChangeMessage = (value) => {
        this.setState({ isPinCodeChanged: value })
        if (value) {

            this.setState({ showDialogueBox: false })
        }
    }
    handleHomeIconClick = () => {
        this.props.history.push('/store');
    }
    handleDialogue = () => {

        this.setState({
            showDialogueBox: !this.state.showDialogueBox
        });
    }
    handleSearchAction = () => {
        this.props.history.push('/search')
    }
    handleChangeBoxToggle = () => {
        this.setState({ showChangeButtonBox: !this.state.showChangeButtonBox });
    }

    handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ openSnackbar: false });
    };
    updateSnackBarState = () => {
        this.setState({ openSnackbar: !this.state.openSnackbar });
    };

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <Container fluid={true} className="topHeader d-flex align-items-center">
                    <Container className="container-content-header">
                        <Row className="justify-content-end justify-content-md-between align-items-center border-bottom py-2 px-3 flex-grow-1 h-100">
                            <Col xs={5} className="d-none d-lg-block pl-0">
                                {/* <Button className="addCircleIcon icons mr-4">+</Button> */}
                                {/* <Button onClick={() => this.props.history.push("/category/ALL")}
                                 className="homeIcons icons mr-4"></Button>  */}
                                <div className="d-flex headerShippingAddress" onMouseEnter={this.handleChangeBoxToggle}
                                    onMouseLeave={this.handleChangeBoxToggle}
                                >
                                    <div className="d-flex cursor-pointer mw-300" onClick={this.handleDialogue} style={this.state.showChangeButtonBox ? { backgroundColor: '#f0f3fc', borderRadius: 4 } : {}}>
                                        <InboxOutlinedIcon style={{ fontSize: 42 }}></InboxOutlinedIcon>
                                        <div className="d-flex align-items-center flex-grow-1 mx-2" >
                                            <div className="smallTxt d-flex flex-grow-1 flex-column pr-3">

                                                <div className="addressTxt">  SHOPPING AT -  {this.props.shippingAddress}</div>
                                            </div>

                                            <span
                                                style={{ color: 'firebrick', fontSize: 13 }}>
                                                Change
                                            </span>

                                        </div>
                                    </div>
                                </div>
                                {/* { this.state.isPinCodeChanged && <Snackbar
                                      open={true}
                                      autoHideDuration={6000}
                                      onClose={() => { }}
                                      message="Pin Code Changed"
                                    
                                /> } */}
                                {this.state.isPinCodeChanged && <Snackbar
                                    open={this.state.openSnackbar}
                                    autoHideDuration={6000}
                                    onClose={this.handleSnackbarClose}
                                    message="Pin Code Changed"

                                />}
                            </Col>
                            <Col xs={7} md={2} className="d-flex justify-content-md-center justify-content-start align-items-center" >
                                <img src={Logo} onClick={this.handleHomeIconClick} className="img-responsive logo" style={{ cursor: 'pointer' }}></img>
                            </Col>
                            <Col xs={5} className="d-flex justify-content-end headerLeftNav">

                                <div className="position-relative ml-3 ml-md-5">
                                    <Button className="userIcons icons" onClick={this.showUserMenu}>
                                        <PermIdentityOutlinedIcon className="iconSize"></PermIdentityOutlinedIcon>
                                        <ExpandMoreIcon style={{ fontSize: 20, width: 13 }}></ExpandMoreIcon>
                                    </Button>
                                    {this.props.showUserMenuOption ?
                                        <div className="drop-option">
                                            <span className="user">Hey , {this.props.userName ? this.props.userName : 'Guest'}</span>
                                            {this.props.userName &&
                                                <span className="settings" onClick={() => this.handleOrderClick()}>My Orders</span>}
                                            {this.props.userName &&
                                                <span className="settings" onClick={() => this.handleSettingClick()}>My Account</span>}
                                            {!this.props.userName &&
                                                <span className="signIn" onClick={() => this.handleSignInClick()}>Sign-in</span>}
                                            {!this.props.userName &&
                                                <span className="addAccount" onClick={() => this.handleCreateAccountClick()}>Create Account</span>}
                                            {this.props.userName &&
                                                <span className="logOut" onClick={() => this.handleLogout()}>Logout</span>}
                                        </div>
                                        : null
                                    }
                                </div>

                                <Badge badgeContent={this.props.total_items_count} color="primary">
                                    <Button onClick={() => this.props.history.push("/cart")} className="icons ml-3 ml-md-5"><ShoppingCartOutlinedIcon className="iconSize"></ShoppingCartOutlinedIcon></Button>
                                </Badge>
                            </Col>
                        </Row>
                        {this.state.showDialogueBox &&
                            <ChangeAddressDialogue
                                handleDialogue={this.handleDialogue}
                                changeValue={this.showPinCodeChangeMessage}
                                history={this.props.history}
                                location={this.props.location}
                                showDialogueBox={this.state.showDialogueBox}
                                updateSnackBarState={this.updateSnackBarState}
                                categoryHeader={false}
                            />
                        }
                    </Container>
                </Container>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => {
    let total_items_count = _get(state, "cart.lookUpData[0].total_items_count", 0);
    let userName = _get(state, "userSignInInfo.lookUpData[0].result.cust_name", '');
    // let shippingAddress = _get(state, "zipCodeLocator.lookUpData.data[0].street1",'');
    let shippingAddress = localStorage.getItem('zipcode')
    return {
        total_items_count,
        userName,
        shippingAddress
    };
};

export default connect(mapStateToProps)(withStyles(styles)(WithoutCategoryHeaderBar));