import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import { map as _map, get as _get } from "lodash";
import { Container } from "reactstrap";
import Autocomplete from "@material-ui/lab/Autocomplete";
import { TextField, IconButton, InputAdornment } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";
import CloseIcon from "@material-ui/icons/Close";
import { debounce } from "lodash";
import { commonActionCreater } from "../../Redux/Actions/commonAction";
import { withRouter } from "react-router-dom/cjs/react-router-dom.min";
import genericGetData from "../../Redux/Actions/genericGetData";

const styles = (theme) => ({
  searchPanel: {
    padding: "1rem 0",
    display: "flex",
    justifyContent: "center",
    width: "100%",
    maxWidth: "100%",
  },
  autocompleteInput: {
    width: "100%",
    maxWidth: "100%",
    "& .MuiOutlinedInput-root": {
      borderRadius: 30,
      backgroundColor: "#fff",
      padding: "0 15px",
      boxShadow: "none",
      "& fieldset": {
        borderColor: "#ddd",
      },
      "&:hover fieldset": {
        borderColor: "#aaa",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#000",
        borderWidth: 2,
      },
    },
    "& .MuiInputBase-input": {
      padding: "0 10px",
      backgroundColor: "#ebebeb00",
      caretColor: "transparent",
      "&:focus": {
        caretColor: "black",
      },
    },
  },

  optionItem: {
    display: "flex",
    alignItems: "center",
    "& img": {
      width: 40,
      height: 40,
      objectFit: "cover",
      marginRight: 10,
      borderRadius: 6,
    },
  },
  loadingText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#888",
  },
});

class SearchProductsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      options: [],
      limit: 20,
      isShowtoggle: false,
    };
  }
  handleKeyDown = (e) => {
    if (e.key === "Enter") {
      this.setState((prevState) => ({ isShowtoggle: !prevState.isShowtoggle }));
    }
  };

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  handleSearchProducts = (e) => {
    const value = e.target.value;
    if (value !== this.state.searchValue && value !== 0) {
      this.setState({ searchValue: value });
      let searchRequest = _get(e, "target.value", "");
      this.props.dispatch(
        commonActionCreater({}, "SEARCH_PRODUCTS_LIST_SUCCESS")
      );
      this.debouncedSearch(searchRequest);
    }
  };

  searchProductsFetchSuccess = (products) => {
    this.setState({ options: products });
  };

  searchProductsFetchError = () => {
    this.setState({ options: [] });
  };

  debouncedSearch = debounce((searchTerm) => {
    searchTerm = searchTerm.trim();
    if (searchTerm) {
      const zipcode = localStorage.getItem("zipcode");
      const locTime = localStorage.getItem("dineinTime");
      const loc_id = localStorage.getItem("vendor_location_id");
      const couriertype = localStorage.getItem("couriertype");
      let page = 1;

      genericGetData({
        dispatch: this.props.dispatch,
        url: `/connect/index/search?q=${searchTerm}`,
        constants: {
          init: "SEARCH_PRODUCTS_LIST_INIT",
          success: "SEARCH_PRODUCTS_LIST_SUCCESS",
          error: "SEARCH_PRODUCTS_LIST_ERROR",
        },
        identifier: "SEARCH_PRODUCTS_LIST",
        successCb: (data) => {
          const products = _get(data, "results", [])
            .slice(0, 2)
            .map((r) => ({
              displayText: _get(r, "name"),
              value: _get(r, "id"),
              image: _get(r, "image[0].small_image") || "",
            }));
          this.searchProductsFetchSuccess(products);
        },
        errorCb: this.searchProductsFetchError,
        dontShowMessage: true,
      });
    }
  }, 1000);

  handleSelectChange = (event, value) => {
    if (value) {
      this.props.history.push(`/store/${_get(value, "value")}`);
      if (this.props.closeNavbar) this.props.closeNavbar();
    }
  };

  handleSearchResultsRedirect = (searchTerm) => {
    if (searchTerm && this.props.history) {
      if (this.props.closeNavbar) this.props.closeNavbar();
      // give the navbar a moment to close visually before routing
      setTimeout(() => {
        this.props.history.push(
          `/search/results?q=${encodeURIComponent(searchTerm)}`
        );
      }, 80);
    }
  };

  handleSearchIconClick = (e) => {
    // prevent any default behaviour
    if (e && e.preventDefault) e.preventDefault();
    const value = (this.state.searchValue || "").trim();
    if (value) this.handleSearchResultsRedirect(value);
  };

  handleClearClick = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    this.setState({ searchValue: "", options: [] });
    // also clear redux search results if needed
    try {
      this.props.dispatch(
        commonActionCreater({}, "SEARCH_PRODUCTS_LIST_SUCCESS")
      );
    } catch (err) {
      // ignore if dispatch not available
    }
  };

  render() {
    const { classes } = this.props;

    const options = this.state.options.length
      ? this.state.options
      : _map(_get(this.props.productListingData, "results", []), (r) => ({
          displayText: _get(r, "name"),
          value: _get(r, "id"),
          image: _get(r, "image[0].small_image") || "",
        }));

    return (
      <React.Fragment>
        <CssBaseline />
        <Container
          fluid={true}
          className={classes.searchPanel}
          style={{ width: "100%", maxWidth: "100%", padding: 0 }}
        >
          <Autocomplete
            freeSolo
            options={options}
            getOptionLabel={(option) => option.displayText}
            filterOptions={(options) => options}
            inputValue={this.state.searchValue}
            onInputChange={(event, value) => {
              this.setState({ searchValue: value });
              this.handleSearchProducts(event);
            }}
            onChange={this.handleSelectChange}
            noOptionsText={
              this.state.searchValue ? "No matching products" : "Type to search"
            }
            renderOption={(option) => (
              <div className={classes.optionItem}>
                {option.image && (
                  <img src={option.image} alt={option.displayText} />
                )}
                <span>{option.displayText}</span>
              </div>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                className={classes.autocompleteInput}
                variant="outlined"
                placeholder="Search..."
                style={{ width: "100%", maxWidth: "100%" }}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <InputAdornment position="end">
                      {this.state.searchValue ? (
                        <IconButton
                          aria-label="clear"
                          onClick={this.handleClearClick}
                          edge="end"
                        >
                          <CloseIcon />
                        </IconButton>
                      ) : null}
                      <IconButton
                        aria-label="search"
                        onClick={(e) => {
                          this.handleSearchIconClick(e);
                          if (this.state.isShowtoggle)
                            this.setState({ isShowtoggle: false });
                        }}
                        edge="end"
                      >
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    const value = this.state.searchValue;
                    // ensure navbar closes then navigate
                    if (this.props.closeNavbar) this.props.closeNavbar();
                    setTimeout(
                      () => this.handleSearchResultsRedirect(value),
                      80
                    );
                    // this.setState({ searchValue: "", options: [] });
                    e.stopPropagation();
                  }
                }}
              />
            )}
            style={{ width: "100%" }}
          />
        </Container>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  let isLoading = _get(state, "searchProductsData.isFetching");
  let productListingData = _get(state, "searchProductsData.lookUpData", {});
  return { productListingData, isLoading };
}

export default connect(mapStateToProps)(
  withStyles(styles)(withRouter(SearchProductsContainer))
);
