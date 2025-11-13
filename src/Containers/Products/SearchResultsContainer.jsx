import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Container } from "reactstrap";
import Select from "antd/lib/select";
import { connect } from "react-redux";
import ProductsListing from "../../Components/StoreCategoryComponents/StoreCategoryComponent";
import { LoaderOverLay } from "../../Global/UIComponents/LoaderHoc";
import StoreCategoryPagination from "../../Components/StoreCategoryComponents/StorgeCategoryPagination";
import { isEmpty as _isEmpty, get as _get } from "lodash";
import genericGetData from "../../Redux/Actions/genericGetData";
import "../../assets/stylesheets/pagination.css";

class SearchResultsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      productList: [],
      filteredProducts: [],
      page: 1,
      limit: 20,
      totalPages: 1,
      isLoading: false,
      errorText: null,
      sortBy: "relevance",  
    };
  }

  componentDidMount() {
    this.fetchProducts(this.state.page, this.state.limit);
  }

  componentDidUpdate(prevProps) {
    if (this.props.location.search !== prevProps.location.search) {
      this.setState({ page: 1 }, () => {
        this.fetchProducts(1, this.state.limit);
      });
    }
  }

  getQueryParam = () => {
    try {
      const params = new URLSearchParams(this.props.location.search || "");
      return params.get("q") || "";
    } catch (e) {
      console.error("Failed to parse query params", e);
      return "";
    }
  };

  fetchProducts = (page, limit) => {
    const term = this.getQueryParam();
    if (!term) return;

    this.setState({ isLoading: true, errorText: null });

    const zipcode = localStorage.getItem("zipcode") || "";
    const loc_id = localStorage.getItem("vendor_location_id") || "";
    const couriertype = localStorage.getItem("couriertype") || "";

    const url = `/connect/index/search?q=${encodeURIComponent(
      term
    )}&store_id=1&zipcode=${encodeURIComponent(
      zipcode
    )}&loc_id=${encodeURIComponent(loc_id)}&courier_type=${encodeURIComponent(
      couriertype
    )}&page=${page}&limit=${limit}`;

    genericGetData({
      dispatch: this.props.dispatch,
      url,
      constants: {
        init: "SEARCH_RESULTS_INIT",
        success: "SEARCH_RESULTS_SUCCESS",
        error: "SEARCH_RESULTS_ERROR",
      },
      identifier: "SEARCH_RESULTS",
      successCb: (data) => {
        const productsArr = _get(data, "products", []);
        const paginationData = _get(data, "pagination", {});
        const totalPages = Number(paginationData?.total_page) || 1;

        this.setState(
          {
            productList: Array.isArray(productsArr) ? productsArr : [],
            totalPages,
            page,
            isLoading: false,
          },
          () => this.applySorting(this.state.sortBy)
        );
      },
      errorCb: () => {
        this.setState({
          errorText: "Failed to fetch search results.",
          isLoading: false,
        });
      },
      dontShowMessage: true,
    });
  };
  getLowestPrice = (product) => {
    const speedList = _get(product, "child[0].speed_id", []);
    if (!Array.isArray(speedList) || speedList.length === 0) return 0;

    const prices = speedList
      .map((s) => parseFloat(s.Price))
      .filter((p) => !isNaN(p));
    return prices.length > 0 ? Math.min(...prices) : 0;
  };


handleSortChange = (value) => {
  this.applySorting(value);
};

applySorting = (sortBy) => {
  const { productList } = this.state;
  let sorted = [...productList];

  switch (sortBy) {
    case "priceLowHigh":
      sorted.sort((a, b) => this.getLowestPrice(a) - this.getLowestPrice(b));
      break;
    case "priceHighLow":
      sorted.sort((a, b) => this.getLowestPrice(b) - this.getLowestPrice(a));
      break;
    case "nameAZ":
      sorted.sort((a, b) =>
        (a.name || "").localeCompare(b.name || "", undefined, {
          sensitivity: "base",
        })
      );
      break;
    case "nameZA":
      sorted.sort((a, b) =>
        (b.name || "").localeCompare(a.name || "", undefined, {
          sensitivity: "base",
        })
      );
      break;
    default:
      sorted = [...productList];
  }

  this.setState({ filteredProducts: sorted, sortBy });
};


  handlePageClick = (selected) => {
    const selectedPage = Number(selected) + 1;
    this.setState({ page: selectedPage }, () => {
      this.fetchProducts(selectedPage, this.state.limit);
    });
  };

  handlePageSizeChange = (value) => {
    const newLimit = parseInt(value, 10);
    this.setState({ limit: newLimit, page: 1 }, () => {
      this.fetchProducts(1, newLimit);
    });
  };

  render() {
    const {
      filteredProducts,
      page,
      limit,
      totalPages,
      isLoading,
      errorText
        } = this.state;
    const searchTerm = this.getQueryParam();

    return (
      <React.Fragment>
        <CssBaseline />
        <div className="page-content-container" style={{ padding: "10px 15px" }}>
          <Container fluid className="proCategoryList">
          <div
  className="d-flex justify-content-between align-items-center flex-wrap mb-3"
  style={{ gap: "10px" }}
>
  <h2 className="mb-0">Search Results for "{searchTerm}"</h2>

  <div
    className="d-flex align-items-center"
    style={{
      gap: "10px",
      flexShrink: 0,
      whiteSpace: "nowrap",
    }}
  >
      <Select
      value={this.state.sortBy}
      onChange={this.handleSortChange}
      style={{
        minWidth: "160px",
        fontSize: "14px",
        border: "none"
      }}
      options={[
        { value: "relevance", label: "Relevance" },
        { value: "nameAZ", label: "Name: A–Z" },
        { value: "nameZA", label: "Name: Z–A" },
        { value: "priceLowHigh", label: "Price: Low–High" },
        { value: "priceHighLow", label: "Price: High–Low" },
      ]}
    />
  </div>
</div>



            <div className="productCategoryList-wrapper">
              {_isEmpty(filteredProducts) && !isLoading ? (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    border: "1px solid grey",
                    marginLeft: "1%",
                    padding: "20px",
                  }}
                >
                  {errorText || "No products found."}
                </div>
              ) : (
                <div className="proListsection">
                  {isLoading && <LoaderOverLay />}

                  {!_isEmpty(filteredProducts) && (
                    <div
                      className="pagination-container"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent:
                          typeof window !== "undefined" &&
                          window.innerWidth >= 768
                            ? "flex-end"
                            : "center",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "nowrap",
                        margin: "14px 0",
                      }}
                    >
                      <Select
                        className="pageSize"
                        value={String(limit)}
                        placeholder="Select Page Size"
                        style={{
                          minWidth:
                            typeof window !== "undefined" &&
                            window.innerWidth < 520
                              ? 80
                              : 110,
                        }}
                        onChange={this.handlePageSizeChange}
                      >
                        <Select.Option value="10">10</Select.Option>
                        <Select.Option value="20">20</Select.Option>
                        <Select.Option value="50">50</Select.Option>
                      </Select>

                      <StoreCategoryPagination
                        forcePage={page - 1}
                        pageCount={totalPages}
                        handlePageClick={this.handlePageClick}
                        itemsPerPage={limit}
                      />
                    </div>
                  )}


                  <ProductsListing
                    {...this.props}
                    productListingAfterSort={filteredProducts}
                  />


                  {!_isEmpty(filteredProducts) && (
                    <div
                      className="mt-2 pagination-container"
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent:
                          typeof window !== "undefined" &&
                          window.innerWidth >= 768
                            ? "flex-end"
                            : "center",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "nowrap",
                        margin: "14px 0",
                      }}
                    >
                      <Select
                        className="pageSize"
                        value={String(limit)}
                        placeholder="Select Page Size"
                        style={{
                          minWidth:
                            typeof window !== "undefined" &&
                            window.innerWidth < 520
                              ? 80
                              : 110,
                        }}
                        onChange={this.handlePageSizeChange}
                      >
                        <Select.Option value="10">10</Select.Option>
                        <Select.Option value="20">20</Select.Option>
                        <Select.Option value="50">50</Select.Option>
                      </Select>

                      <StoreCategoryPagination
                        forcePage={page - 1}
                        pageCount={totalPages}
                        handlePageClick={this.handlePageClick}
                        itemsPerPage={limit}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

SearchResultsContainer.propTypes = {
  location: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

export default connect()(SearchResultsContainer);
