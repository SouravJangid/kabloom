import React, { useState } from "react";
import { connect } from "react-redux";
import { withStyles } from "@material-ui/core/styles";
import { Button, Badge, Snackbar } from "@material-ui/core";
// import Logo from '../../../src/assets/images/drinksbucket-logo.png';
import Logo from "../../../src/assets/images/kabloom-logo.png";
import topNavbranding from "../../../src/assets/images/854.jpg";
import { Container, Row, Col } from "reactstrap";
import {
  get as _get,
  map as _map,
  _forEach,
  _set,
  isEmpty as _isEmpty,
} from "lodash";
import InboxOutlinedIcon from "@material-ui/icons/InboxOutlined";
import { logoutActionCreator } from "../../Redux/Actions/logoutAction";
import ShoppingCartOutlinedIcon from "@material-ui/icons/ShoppingCartOutlined";
import PermIdentityOutlinedIcon from "@material-ui/icons/PermIdentityOutlined";
import ArrowForwardIosIcon from "@material-ui/icons/ArrowForwardIos";
import SearchOutlinedIcon from "@material-ui/icons/SearchOutlined";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import ChangeAddressDialogue from "./ChangeAddressDialogue";
import genericGetData from "../../Redux/Actions/genericGetData";
import MegaMenu from "./megaMenu";
import { Loader, LoaderOverLay } from "../UIComponents/LoaderHoc";
import SearchProductsContainer from "../../Containers/Products/SearchProductsContainer";
// import { updateParentFilter } from '../../Components/StoreCategoryComponents/StoreCategoryFilter';
import {
  setProductList,
  updateParentFilter,
} from "../../Containers/StoreCategory/StoreCategoryContainer";

class HeaderBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showUserMenuOption: false,
      setIsOpen: false,
      showDialogueBox: false,
      showChangeButtonBox: false,
      isOpen: false,

      categoryMenuList: [],
      isShowtoggle: false,
      isshowHoverToggle: false,
      isPinCodeChanged: false,
      openSnackbar: false,
    };
  }

  handleToggle = () => {
    this.setState({
      isShowtoggle: !this.state.isShowtoggle,
    });
  };

  handleHoverToggleEnter = (id) => {
    this.setState({
      [`isshowHoverToggle${id}`]: true,
    });
  };
  handleHoverToggleOut = (id) => {
    this.setState({
      [`isshowHoverToggle${id}`]: false,
    });
  };

  showUserMenu = () => {
    this.props.showUserMenu();
  };

  handleSettingClick = () => {
    this.props.history.push("/setting/user");
  };

  handleOrderClick = () => {
    this.props.history.push("/setting/order");
  };

  handleSignInClick = () => {
    this.props.history.push("/signIn");
  };
  handleCreateAccountClick = () => {
    this.props.history.push("/createAccount");
  };
  handleLogout = async () => {
    await this.props.dispatch(logoutActionCreator());
    this.props.history.push("");
    window.location.reload();
  };

  handleSearchAction = () => {
    this.props.history.push("/search");
  };

  queryChangeHandler = (value) => {
    console.log("value", value);
  };

  toggle = () => {
    this.setState({ isOpen: !this.state.isOpen });
  };
  showPinCodeChangeMessage = (value) => {
    this.setState({ isPinCodeChanged: value });
  };
  handleDialogue = () => {
    this.setState({
      showDialogueBox: !this.state.showDialogueBox,
    });
  };

  handleChangeBoxToggle = () => {
    this.setState({ showChangeButtonBox: !this.state.showChangeButtonBox });
  };

  onMouseEnter = ({ category, child }) => {
    // this.setState({dropdownOpen: true});
    // console.log('on mouse enter');

    this.setState({
      [`isshowHoverToggle${category}`]: _isEmpty(child) ? false : true,
    });
    // let dropdownsAvailable = this.state.dropdownOpen;
    // _forEach(dropdownsAvailable, (value, key) => {
    //     if (category === key ) {
    //         let currenDropdownOpen = dropdownsAvailable;
    //         _set(currenDropdownOpen, key, true);
    //         this.setState({
    //             dropdownOpen: currenDropdownOpen
    //         })
    //     }
    // })
  };

  onMouseLeave = ({ category }) => {
    // console.log('on mouse leave');
    this.setState({
      [`isshowHoverToggle${category}`]: false,
    });
    // this.setState({dropdownOpen: false});
    // _forEach(this.state.dropdownOpen, (value, key) => {
    //     if (category === key ) {
    //         let currenDropdownOpen = this.state.dropdownOpen;
    //         _set(currenDropdownOpen, key, false);
    //         this.setState({
    //             dropdownOpen: currenDropdownOpen
    //         })
    //     }
    // })
  };
  dropdownToggle = ({ category, event }) => {
    // console.log('event', event, event.target);

    this.setState({
      [`isshowHoverToggle${category}`]: !_get(
        this.state,
        `isshowHoverToggle${category}`
      ),
    });

    // this.setState({ dropdownOpen: !this.state.dropdownOpen })
    // _forEach(this.state.dropdownOpen, (value, key) => {
    //     if (category === key ) {
    //         let currenDropdownOpen = this.state.dropdownOpen;
    //         _set(currenDropdownOpen, key, false);
    //         this.setState({
    //             dropdownOpen: currenDropdownOpen
    //         })
    //     }
    // })
  };

  categoriesFetchSuccess = (data) => {
    if (_get(data, "code") === 1) {
      let cData = {};
      _map(_get(data, "data"), (d) => {
        cData[`isshowHoverToggle${_get(d, "category_name")}`] = false;
      });
      this.setState({
        categoryMenuList: _get(data, "data"),
        ...cData,
      });
    } else {
      console.log("invalid code", data);
    }
    this.setState({ isLoading: false });
  };

  categoriesFetchError = (err) => {
    this.setState({ isLoading: false });

    console.log("category error", err);
  };

  componentDidMount() {
    // this.setState({ isLoading: true });
    const couriertype = localStorage.getItem("couriertype");
    genericGetData({
      dispatch: this.props.dispatch,
      url: "/connect/index/categorylist?store_id=1&courier_type=" + couriertype,
      constants: {
        init: "CATEGORIES_LIST_INIT",
        success: "CATEGORIES_LIST_SUCCESS",
        error: "CATEGORIES_LIST_ERROR",
      },
      identifier: "CATEGORIES_LIST",
      successCb: this.categoriesFetchSuccess,
      errorCb: this.categoriesFetchError,
      dontShowMessage: true,
    });
  }

  productsListFetchSuccess = (data, prevData, categoryName) => {
    this.setState({ isLoading: false });

    // console.log('history push');
    // this.props.history.push(`/store/category/${_get(prevData, 'category_name')}/${_get(prevData, 'category_id')}`);
    this.props.history.push(
      `/store/category/${categoryName}/${_get(
        prevData,
        "category_name"
      )}/${_get(prevData, "category_id")}`
    );
    updateParentFilter(data);
    setProductList(data);
    // console.log('checking1');
    this.handleToggle();
  };

  productsListFetchError = (err) => {
    console.log("err", err);
    this.setState({ isLoading: false });
  };

  handleCategoryClick = ({ data, allData, categoryName, event }) => {
    // console.log(data, allData, categoryName, event, 'check 1');
    this.setState({ isLoading: true });

    const zipcode = localStorage.getItem("zipcode");
    const prevData = data;

    // const location = localStorage.getItem("location");
    const locTime = localStorage.getItem("dineinTime");
    const retailer = localStorage.getItem("vendor_location_id");
    const couriertype = localStorage.getItem("couriertype");
    let urlparam = "";
    // if (!_isEmpty(zipcode) && !_isEmpty(location)) {
    //     urlparam = `/connect/index/category?catid=${_get(data, 'category_id')}&store_id=1&zipcode=${zipcode}&location=${location}&dineinTime=${locTime}&retailer=${retailer}`;
    // } else if (!_isEmpty(zipcode)){
    //     urlparam = `/connect/index/category?catid=${_get(data, 'category_id')}&store_id=1&zipcode=${zipcode}&dineinTime=${locTime}&retailer=${retailer}`;
    // } else if (!_isEmpty(location)) {
    //     urlparam = `/connect/index/category?catid=${_get(data, 'category_id')}&store_id=1&location=${location}&dineinTime=${locTime}&retailer=${retailer}`;
    // }

    if (!_isEmpty(zipcode)) {
      if (data?.category_name === "Shop All") {
        urlparam = `/connect/index/category?catid=${_get(
          allData,
          "category_id"
        )}&store_id=1&zipcode=${zipcode}&loc_id=${retailer}&courier_type=${couriertype}&page=1&limit=20`;
      } else {
        urlparam = `/connect/index/category?catid=${_get(
          data,
          "category_id"
        )}&store_id=1&zipcode=${zipcode}&loc_id=${retailer}&courier_type=${couriertype}&page=1&limit=20`;
      }
    } else {
      if (data?.category_name === "Shop All") {
        urlparam = `/connect/index/category?catid=${_get(
          allData,
          "category_id"
        )}&store_id=1&zipcode=&loc_id=${retailer}&courier_type=${couriertype}&page=1&limit=20`;
      } else {
        urlparam = `/connect/index/category?catid=${_get(
          data,
          "category_id"
        )}&store_id=1&zipcode=&loc_id=${retailer}&courier_type=${couriertype}&page=1&limit=20`;
      }
    }
    genericGetData({
      dispatch: this.props.dispatch,
      // url:`/connect/index/category?catid=${_get(data, 'category_id')}&store_id=1&zipcode=${zipcode}`,
      url: urlparam,
      constants: {
        init: "PRODUCTS_LIST_INIT",
        success: "PRODUCTS_LIST_SUCCESS",
        error: "PRODUCTS_LIST_ERROR",
      },
      identifier: "PRODUCTS_LIST",
      successCb: (data) =>
        this.productsListFetchSuccess(data, prevData, categoryName),
      errorCb: this.productsListFetchError,
      dontShowMessage: true,
    });
    this.setState({
      [`isshowHoverToggle${categoryName}`]: !_get(
        this.state,
        `isshowHoverToggle${categoryName}`
      ),
    });
    event.stopPropagation();
  };

  handleMenuToggle = ({ categoryName, event, child }) => {
    // console.log('toggle', categoryName, event);
    if (_isEmpty(child)) {
      this.handleToggle();
      // this.setState({
      //     [`isshowHoverToggle${categoryName}`]: !_get(this.state, `isshowHoverToggle${categoryName}`)
      // });
    }

    // event.stopPropagation();
  };

  handleHomeIconClick = () => {
    this.props.history.push("/store");
  };

  handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    this.setState({ openSnackbar: false });
  };
  updateSnackBarState = () => {
    this.setState({ openSnackbar: !this.state.openSnackbar });
  };

  render() {
    const { classes } = this.props;
    const { isLoading } = this.state;
    // if (isLoading) {
    //     return <LoaderOverLay />
    // }

    let categoryMenu = _map(_get(this.state, "categoryMenuList"), (c) => {
      return (
        <React.Fragment key={c.category_id.toString()}>
          <MegaMenu
            category={c}
            onMouseEnter={this.onMouseEnter}
            onMouseLeave={this.onMouseLeave}
            states={this.state}
            dropdownToggle={this.dropdownToggle}
            handleCategoryClick={this.handleCategoryClick}
            handleMenuToggle={this.handleMenuToggle}
            history={this.props.history}
          />
        </React.Fragment>
      );
    });

    return (
      <React.Fragment>
        <Container fluid={true} className="topHeader d-flex align-items-center">
          <Container className="container-content-header">
            <Row className="justify-content-end justify-content-lg-between align-items-center py-2 px-3 flex-grow-1 h-100">
              <div>{this.state.isLoading && <LoaderOverLay />}</div>
              <Col xs={5} className="d-none d-lg-block pl-0">
                {/* <Button className="addCircleIcon icons mr-4">+</Button> */}
                {/* <Button onClick={() => this.props.history.push("/category/ALL")}
                                 className="homeIcons icons mr-4"></Button>  */}
                <div
                  className="d-flex headerShippingAddress"
                  onMouseEnter={this.handleChangeBoxToggle}
                  onMouseLeave={this.handleChangeBoxToggle}
                >
                  <div
                    className="d-flex cursor-pointer mw-300"
                    onClick={this.handleDialogue}
                    style={
                      this.state.showChangeButtonBox
                        ? { backgroundColor: "#f0f3fc", borderRadius: 4 }
                        : {}
                    }
                  >
                    <InboxOutlinedIcon
                      style={{ fontSize: 42 }}
                    ></InboxOutlinedIcon>
                    <div className="d-flex align-items-center flex-grow-1 mx-2">
                      <div className="smallTxt d-flex flex-grow-1 flex-column pr-3">
                        <div className="addressTxt">
                          {this.props.shippingAddress === "" ||
                            !this.props.shippingAddress
                            ? "Select Location"
                            : `SHOPPING AT - ${this.props.shippingAddress}`}
                        </div>
                      </div>

                      <span style={{ color: "firebrick", fontSize: 13 }}>
                        Change
                      </span>
                    </div>
                  </div>
                </div>
                {this.state.isPinCodeChanged && (
                  <Snackbar
                    open={true}
                    autoHideDuration={6000}
                    onClose={() => { }}
                    message="Pin Code Changed"
                  />
                )}
              </Col>
              <Col
                xs={2}
                className="d-flex justify-content-center align-items-center"
              >
                <img
                  src={Logo}
                  className="img-responsive logo"
                  onClick={this.handleHomeIconClick}
                  style={{ cursor: "pointer" }}
                ></img>
              </Col>
              <Col
                xs={5}
                className="d-flex justify-content-end align-items-center headerLeftNav  pr-1"
              >
                <Col
                  md={10}
                  lg={8}
                  className="topSearch pr-0 d-none d-md-block"
                >
                  {/* <input
                    type="text"
                    aria-invalid="false"
                    autoComplete="off"
                    id="SearchField"
                    name="q"
                    placeholder="Search your choice"
                    value=""
                    onChange={() => this.queryChangeHandler(this.value)}
                  ></input> */}
                  <div className="d-none d-lg-block my-2 px-3">
                    <SearchProductsContainer closeNavbar={() => { if (this.state.isShowtoggle) this.setState({ isShowtoggle: false }); }} />
                  </div>
                </Col>
                <div className="position-relative ml-3 ml-md-4 ml-lg-5">
                  <Button
                    className="userIcons icons"
                    onClick={this.showUserMenu}
                  >
                    <PermIdentityOutlinedIcon className="iconSize"></PermIdentityOutlinedIcon>
                    <ExpandMoreIcon
                      style={{ fontSize: 20, width: 13 }}
                    ></ExpandMoreIcon>
                  </Button>
                  {this.props.showUserMenuOption ? (
                    <div className="drop-option">
                      <span className="user">
                        Hey ,{" "}
                        {this.props.userName ? this.props.userName : "Guest"}
                      </span>
                      {this.props.userName && (
                        <span
                          className="settings"
                          onClick={() => this.handleOrderClick()}
                        >
                          My Orders
                        </span>
                      )}
                      {this.props.userName && (
                        <span
                          className="settings"
                          onClick={() => this.handleSettingClick()}
                        >
                          My Account
                        </span>
                      )}
                      {!this.props.userName && (
                        <span
                          className="signIn"
                          onClick={() => this.handleSignInClick()}
                        >
                          Sign-in
                        </span>
                      )}
                      {!this.props.userName && (
                        <span
                          className="addAccount"
                          onClick={() => this.handleCreateAccountClick()}
                        >
                          Create Account
                        </span>
                      )}
                      {this.props.userName && (
                        <span
                          className="logOut"
                          onClick={() => this.handleLogout()}
                        >
                          Logout
                        </span>
                      )}
                    </div>
                  ) : null}
                </div>

                <Badge
                  badgeContent={this.props.total_items_count}
                  color="primary"
                >
                  <Button
                    onClick={() => this.props.history.push("/cart")}
                    className="icons ml-3 ml-md-4 ml-lg-5"
                  >
                    <ShoppingCartOutlinedIcon className="iconSize"></ShoppingCartOutlinedIcon>
                  </Button>
                </Badge>
              </Col>
            </Row>

            <Row className="justify-content-between align-items-center flex-grow-1 topNav">
              <Col className="navItems px-0">
                <div className="navbar">
                  <div
                    className={`navbar-toggler ${this.state.isShowtoggle ? "show" : ""
                      }`}
                    onClick={this.handleToggle}
                  >
                    <span className="navbar-toggler-icon"></span>
                  </div>
                  <div className="navbarCollapse">
                    <div
                      className="d-block d-lg-none headerShippingAddress"
                      onMouseEnter={this.handleChangeBoxToggle}
                      onMouseLeave={this.handleChangeBoxToggle}
                    >
                      <div className="d-flex" onClick={this.handleDialogue}>
                        <InboxOutlinedIcon
                          style={{ fontSize: 42 }}
                        ></InboxOutlinedIcon>
                        <div className="d-flex align-items-center flex-grow-1 mx-2">
                          <div className="smallTxt d-flex flex-grow-1 flex-column pr-3">
                            <div className="addressTxt">
                              SHOPPING AT - {this.props.shippingAddress}
                            </div>
                          </div>
                          <span>
                            <ArrowForwardIosIcon
                              style={{ color: "#000", fontSize: 13 }}
                            />
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Category Menu */}
                    <ul className="navbarNav">{categoryMenu}</ul>
                  </div>
                </div>
              </Col>
            </Row>
            <Row>
              <div
                className={`d-none d-md-block d-lg-none my-2 px-3 d-block`}
                style={{ width: "100%", display: "flex", justifyContent: "center", alignItems: "center" }}
              >
                <SearchProductsContainer style={{ width: "100%" }} />
              </div>
            </Row>
            {this.state.showDialogueBox && (
              <ChangeAddressDialogue
                handleDialogue={this.handleDialogue}
                changeValue={this.showPinCodeChangeMessage}
                history={this.props.history}
                location={this.props.location}
                showDialogueBox={this.state.showDialogueBox}
                updateSnackBarState={this.updateSnackBarState}
                categoryHeader={true}
              />
            )}
          </Container>
        </Container>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => {
  let total_items_count = _get(
    state,
    "cart.lookUpData[0].total_items_count",
    0
  );
  let userName = _get(
    state,
    "userSignInInfo.lookUpData[0].result.cust_name",
    ""
  );
  // let shippingAddress = _get(state, "zipCodeLocator.lookUpData.data[0].street1",'');
  let shippingAddress = localStorage.getItem("zipcode");
  return {
    total_items_count,
    userName,
    shippingAddress,
  };
};

export default connect(mapStateToProps)(HeaderBar);
