import React from "react";
import Avatar from "@material-ui/core/Avatar";
import CssBaseline from "@material-ui/core/CssBaseline";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import withStyles from "@material-ui/core/styles/withStyles";
import { connect } from "react-redux";
import ProductTabs from "../../Components/ProductComponents/ProductTabs";
import {
  map as _map,
  findIndex as _findIndex,
  find as _find,
  get as _get,
  forEach as _forEach,
  isEmpty as _isEmpty,
  set as _set,
  reduce as _reduce,
  cloneDeep as _cloneDeep,
  orderBy as _orderBy,
  filter as _filter,
} from "lodash";
import ProductsListing from "../../Components/StoreCategoryComponents/StoreCategoryComponent";
import ProductDetails from "../../Components/ProductComponents/ProductDetails";
import genericGetData from "../../Redux/Actions/genericGetData";
import { genericPostData } from "../../Redux/Actions/genericPostData";
import {
  Container,
  Row,
  Col,
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Button,
} from "reactstrap";
import { Loader, LoaderOverLay } from "../../Global/UIComponents/LoaderHoc";
import SortIcon from "@material-ui/icons/Sort";
import CloseIcon from "@material-ui/icons/Close";
import ProductFilter from "../../Components/StoreCategoryComponents/StoreCategoryFilter";
import FilterListIcon from "@material-ui/icons/FilterList";
// import WithLoading from '../../Global/UIComponents/LoaderHoc';
import { cleanEntityData, formatPrice } from "../../Global/helper/commonUtil";
// import { updateParentFilter } from '../../Components/StoreCategoryComponents/StoreCategoryFilter';
import "../../assets/stylesheets/main.less";

import { data as productdatas } from "../../assets/data/productData";
import StoreCategoryPagination from "../../Components/StoreCategoryComponents/StorgeCategoryPagination";
import { Select } from "antd";

const styles = (theme) => ({
  main: {
    width: "auto",
    display: "block", // Fix IE 11 issue.
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
      width: 400,
      marginLeft: "auto",
      marginRight: "auto",
    },
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(
      3
    )}px`,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
});

// pure functions
export function setProductList(data) {
  this.setState({
    productList: _get(data, "products"),
  });
}

// pure functions
export function updateParentFilter(data) {
  const newSelectedFilter = {};
  let availableFilters = !_isEmpty(data.filters)
    ? this.makeFilter({ data: data.filters, selectedFilter: newSelectedFilter })
    : [];

  // filter option
  const catLabel = "type";

  const selectedcatId = this.props.match.params.categoryId;

  const selectedParent = _find(availableFilters, [
    "label",
    catLabel.toUpperCase(),
  ]);

  _set(newSelectedFilter, `type__${selectedcatId}`, true);

  const newFilterBody = [
    {
      parameter: _get(selectedParent, "parameter"),
      value: this.props.match.params.categoryId,
    },
  ];

  this.setState({
    parentFilters: availableFilters,
    selectedFilters: newSelectedFilter,
    filterBody: newFilterBody,
    expandedFilterPanel: { [`${_get(selectedParent, "label")}`]: true },
  });
}

class ProductsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tabValue: 0,
      selectedTab: "",
      isLoading: true,
      sortToggle: false,
      productList: [],
      parentFilters: [],
      initialParentFilters: [],
      parentFiltersBK: [],
      selectedFilters: {},
      selectedFiltersBK: {},
      filterBody: [],
      filterBodyBK: [],
      isMobileFilter: false,
      isMobileFilterSelectedFirstTime: false,
      expandedFilterPanel: {},
      page: 0,
      limit: 20,
    };
    setProductList = setProductList.bind(this);
    updateParentFilter = updateParentFilter.bind(this);
  }

  // pure function
  updateSelectedFilter = ({
    parentLabel,
    childLabel,
    childId,
    selectedFilter,
  }) => {
    // console.log(parentLabel, childLabel, childId, selectedFilter, 'check jatch')
    if (_isEmpty(selectedFilter)) {
      const catLabel = "type";
      const selectedCategory = this.props.match.params.categoryId;

      const response =
        parentLabel &&
        parentLabel.toLowerCase() === catLabel &&
        childId === selectedCategory
          ? true
          : false;

      return response;
    } else {
      const filterString = `${
        parentLabel && parentLabel.toLowerCase()
      }__${childId}`;

      const response = _get(
        this.state,
        `selectedFilters.${filterString}`,
        false
      );

      return response;
    }
  };

  generateChildrenFilter = (data, key, selectedFilter) => {
    // console.log('child filter called', data);
    const childDataFound = _map(data, (c) => {
      if (_get(c, "children", []).length == 0) {
        return {
          label: _get(c, "label"),
          value: _get(c, "value"),
          id: _get(c, "value"),
          selected: this.updateSelectedFilter({
            parentLabel: key,
            childLabel: _get(c, "label"),
            childId: _get(c, "value"),
            selectedFilter,
          }),
        };
      } else {
        return {
          label: _get(c, "label"),
          value: _get(c, "value"),
          id: _get(c, "value"),
          selected: this.updateSelectedFilter({
            parentLabel: key,
            childLabel: _get(c, "label"),
            childId: _get(c, "value"),
            selectedFilter,
          }),
          child: this.generateChildrenFilter(
            _get(c, "children"),
            key,
            selectedFilter
          ),
        };
      }
    });
    return childDataFound;
    // if (_get(data, 'child', []).length() == 0) {
    //     let childData =  {
    //             label: _get(c, 'label'),
    //             value: _get(c, 'value'),
    //             id: _get(c, 'value'),
    //             selected: this.updateSelectedFilter({ parentLabel: key, childLabel: _get(c, 'label'), childId: _get(c, 'value'), selectedFilter })

    //         };
    //     return childData;
    //     // modifiedChildOptions.push(childData);
    // } else {
    //     let childdata = {
    //         label: _get(c, 'label'),
    //         value: _get(c, 'value'),
    //         id: _get(c, 'value'),
    //         selected: this.updateSelectedFilter({ parentLabel: key, childLabel: _get(c, 'label'), childId: _get(c, 'value'), selectedFilter }),
    //         child: this.generateChildrenFilter(_get(data, 'child'), modifiedChildOptions)
    //     }

    // }
  };

  // pure function
  makeFilter = ({ data, selectedFilter }) => {
    let filterData = [];
    _forEach(data, (value, key) => {
      const childOptions = _get(value, "options") || _get(value, "optoions");
      // console.log(this.generateChildrenFilter(childOptions, key, selectedFilter), 'child modified');
      let parentFilter = cleanEntityData({
        label: key.toUpperCase(),
        value: _get(value, "id"),
        id: _get(value, "id"),
        // parameter: key === 'size' ? 'size' : key === 'price' ? 'price' : key === 'type' ? 'catid' : key === 'country' ? 'country' : null,
        parameter: _get(value, "parameter"),
        childrenFilter: this.generateChildrenFilter(
          childOptions,
          key,
          selectedFilter
        ),
        // childrenFilter: _map(childOptions, c => {
        //     return {
        //         label: _get(c, 'label'),
        //         value: _get(c, 'value'),
        //         id: _get(c, 'value'),
        //         selected: this.updateSelectedFilter({ parentLabel: key, childLabel: _get(c, 'label'), childId: _get(c, 'value'), selectedFilter })
        //     }
        // })
      });
      // const childOptions = _get(value, 'options') || _get(value, 'optoions') || value;
      // let childFilterOptions = [];
      // _forEach(childOptions, (c, k) => {
      //     console.log('child', k, c)
      //     const ddata =  {
      //         label: _get(_get(childOptions, k), 'label'),
      //         value: _get(_get(childOptions, k), 'value'),
      //         id: _get(_get(childOptions, k), 'value'),
      //         selected: this.updateSelectedFilter({ parentLabel: key, childLabel: _get(_get(childOptions, k), 'label'), childId: _get(_get(childOptions, k), 'value'), selectedFilter })
      //     }
      //     childFilterOptions.push(ddata);
      // });
      // let parentFilter = cleanEntityData({
      //     label: key.toUpperCase(),
      //     value: key,
      //     id: key,
      //     // parameter: key === 'size' ? 'size' : key === 'price' ? 'price' : key === 'type' ? 'catid' : key === 'country' ? 'country' : null,
      //     parameter: key,
      //     childrenFilter: childFilterOptions
      // });
      filterData.push(parentFilter);
    });
    // console.log('filter data', filterData)
    return filterData;
  };
  componentWillReceiveProps(nextProps) {
    if (
      nextProps.match.params.categoryId != this.props.match.params.categoryId &&
      nextProps.location.pathname !== "/store/search"
    ) {
      window.scrollTo(0, 0);
      const categoryID = nextProps.match.params.categoryId;
      this.setState({ page: 0, limit: 20 });
      this.fetchProducts(categoryID, 0, 20);
    }
    console.log("componentWillReceiveProps");
    if (
      nextProps.location.pathname == "/store/search" &&
      nextProps.globalProductSearch != this.props.globalProductSearch
    ) {
      this.setState({ page: 0, limit: 20 });
      this.productsListFetchSuccess(nextProps.searchProductApiData);
    }
    if (
      this.props.match.params.categoryId &&
      nextProps.location.pathname == "/store/search"
    ) {
      this.setState({ page: 0, limit: 20 });
      this.productsListFetchSuccess(nextProps.searchProductApiData);
    }
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    const categoryID = this.props.match.params.categoryId;
    console.log(this.props.location.pathname, "location");

    if (this.props.location.pathname == "/store/search") {
      console.log(this.props.location, "location");
      this.productsListFetchSuccess(this.props.searchProductApiData);
    } else {
      this.fetchProducts(categoryID, this.state.page, this.state.limit);
    }
  }

  // handleTabChange = (index, selectedTab) => {
  //     this.setState({ tabValue: index, isLoading: true });
  //     this.fetchProducts(selectedTab);
  // };

  fetchProducts = (categoryID, page, limit) => {
    const zipcode = localStorage.getItem("zipcode");
    // const location = localStorage.getItem("location");
    const locTime = localStorage.getItem("dineinTime");
    const retailer = localStorage.getItem("vendor_location_id");
    const couriertype = localStorage.getItem("couriertype");
    let urlparam = "";
    // if (!_isEmpty(zipcode) && !_isEmpty(location)) {
    //     urlparam = `/connect/index/category?catid=${categoryID}&store_id=1&zipcode=${zipcode}&location=${location}&dineinTime=${locTime}&retailer=${retailer}`;
    // } else if (!_isEmpty(zipcode)){
    //     urlparam = `/connect/index/category?catid=${categoryID}&store_id=1&zipcode=${zipcode}&dineinTime=${locTime}&retailer=${retailer}`;
    // } else if (!_isEmpty(location)) {
    //     urlparam = `/connect/index/category?catid=${categoryID}&store_id=1&location=${location}&dineinTime=${locTime}&retailer=${retailer}`;
    // }

    if (!_isEmpty(zipcode)) {
      urlparam = `/connect/index/category?catid=${categoryID}&store_id=1&zipcode=${zipcode}&loc_id=${retailer}&courier_type=${couriertype}&page=${
        page ? page + 1 : 1
      }&limit=${limit ? limit : 20}`;
    } else {
      urlparam = `/connect/index/category?catid=${categoryID}&store_id=1&zipocde=&loc_id=${retailer}&courier_type=${couriertype}&page=${
        page ? page + 1 : 1
      }&limit=${limit ? limit : 20}`;
    }
    genericGetData({
      dispatch: this.props.dispatch,
      url: urlparam,
      constants: {
        init: "PRODUCTS_LIST_INIT",
        success: "PRODUCTS_LIST_SUCCESS",
        error: "PRODUCTS_LIST_ERROR",
      },
      identifier: "PRODUCTS_LIST",
      successCb: this.productsListFetchSuccess,
      errorCb: this.productsListFetchError,
      dontShowMessage: true,
    });
  };
  fetchSearchProducts = (searchTerm, page, limit) => {
    if (searchTerm) {
      const zipcode = localStorage.getItem("zipcode");
      // const location = localStorage.getItem("location");
      const locTime = localStorage.getItem("dineinTime");
      const loc_id = localStorage.getItem("vendor_location_id");
      const couriertype = localStorage.getItem("couriertype");
      genericPostData({
        dispatch: this.props.dispatch,
        reqObj: { q: searchTerm },
        url: `/connect/index/search?q=${searchTerm}&store_id=1&zipcode=${zipcode}&loc_id=${loc_id}&courier_type=${couriertype}&page=${
          page ? page + 1 : 1
        }&limit=${limit ? limit : 20}`,
        constants: {
          init: "SEARCH_PRODUCTS_LIST_INIT",
          success: "SEARCH_PRODUCTS_LIST_SUCCESS",
          error: "SEARCH_PRODUCTS_LIST_ERROR",
        },
        identifier: "SEARCH_PRODUCTS_LIST",
        successCb: this.productsListFetchSuccess,
        errorCb: this.productsListFetchError,
        dontShowMessage: true,
      });
    }
  };

  productsListFetchSuccess = (data) => {
    // const productdata = productdatas; // it should be data
    let productdata = data;

    if (this.props.cartData && this.props.cartData.length >= 0) {
      const vendorObj = {};
      _map(_get(this.props, "cartData", []), (c) => {
        vendorObj[`${_get(c, "vendor_loc_id", null)}`] = _get(c, "vendor_name");
      });
      productdata = {
        ...data,
        filters: {
          ..._get(productdata, "filters"),
          vendor: {
            id: "vendorId1",
            parameter: "vendor",
            options: _map(vendorObj, (val, key) => {
              return {
                value: key,
                label: val,
              };
            }),
          },
        },
      };
    }
    // console.log(this.props.productListingData, 'products');

    this.setState({
      isLoading: false,
      productList: _get(this.props, "productListingData", []),
    });

    // filter option
    const catLabel = "type";
    const newSelectedFilter = {};
    let availableFilters = !_isEmpty(productdata.filters)
      ? this.makeFilter({
          data: productdata.filters,
          selectedFilter: newSelectedFilter,
        })
      : [];

    const selectedcatId = this.props.match.params.categoryId;

    const selectedParent = _find(availableFilters, [
      "label",
      catLabel.toUpperCase(),
    ]);
    // console.log(selectedParent, availableFilters, 'check 22');

    _set(newSelectedFilter, `type__${selectedcatId}`, true);
    // console.log(newSelectedFilter, 'new selected filter')
    this.setState({
      paginationData: productdata.pagination,
      parentFilters: availableFilters,
      initialParentFilters: availableFilters,
      selectedFilters: newSelectedFilter,
      // filterBody: [{ parameter: _get(selectedParent, 'parameter'), value: this.props.match.params.categoryId }],
      filterBody: [
        { parameter: "catid", value: this.props.match.params.categoryId },
      ],
      expandedFilterPanel: { [`${_get(selectedParent, "label")}`]: true },
    });

    // end
  };

  productsListFetchError = () => {};

  handleCheckboxChange = () => {
    this.setState({
      checkboxSelected: true,
    });
  };
  toggleSort = () => {
    this.setState({
      sortToggle: !this.state.sortToggle,
    });
  };

  sortData = (val) => {
    let sortedData = [];
    const productList =
      this.props.location.pathname == "/store/search"
        ? this.props.searchListingData
        : this.props.productListingData;
    if (val === "A" || val === "Z") {
      const sortData = productList.sort((a, b) => {
        var nameA = a.name.toLowerCase(),
          nameB = b.name.toLowerCase();
        if (nameA < nameB)
          //sort string ascending
          return -1;
        if (nameA > nameB) return 1;
        return 0; //default return value (no sorting)
      });
      sortedData = val === "A" ? sortData : sortData.reverse();
    } else if (val === "high") {
      const newProductList = _reduce(
        productList,
        (acc, val) => {
          const newList = {
            ...val,
            defaultPrice: !_isEmpty(_get(val, "child.0.price", ""))
              ? formatPrice(_get(val, "child.0.price"))
              : 0,
          };
          acc.push(newList);
          return acc;
        },
        []
      );
      sortedData = _orderBy(newProductList, ["defaultPrice"], ["desc"]);
    } else if (val === "low") {
      const newProductList = _reduce(
        productList,
        (acc, val) => {
          const newList = {
            ...val,
            defaultPrice: !_isEmpty(_get(val, "child.0.price", ""))
              ? formatPrice(_get(val, "child.0.price"))
              : 0,
          };
          acc.push(newList);
          return acc;
        },
        []
      );
      sortedData = _orderBy(newProductList, ["defaultPrice"], ["asc"]);
    }

    this.setState({ productList: [] }, () => {
      this.setState({ productList: sortedData });
    });
  };

  handleFilterChange = ({ data, pageNo = 1, limitNo = 20 }) => {
    // change in filter
    // console.log('called');
    // console.log(pageNo, limitNo, 'change');
    this.setState({ isLoading: true });
    const zipcode = localStorage.getItem("zipcode");
    const loc_id = localStorage.getItem("vendor_location_id");
    const page = pageNo ? pageNo : this.state.page ? this.state.page : 1;
    const limit = limitNo ? limitNo : this.state.limit ? this.state.limit : 20;

    const newData = {
      ...data,
      parent_category_id: this.props.match.params.categoryId,
      zipcode: zipcode ? zipcode : "",
      loc_id: loc_id ? loc_id : "",
      page: page,
      limit: limit,
    };
    genericPostData({
      dispatch: this.props.dispatch,
      reqObj: newData,
      url: "/connect/index/filters",
      constants: {
        init: "PRODUCTS_LIST_INIT",
        success: "PRODUCTS_LIST_SUCCESS",
        error: "PRODUCTS_LIST_ERROR",
      },
      identifier: "PRODUCTS_LIST",
      successCb: this.productsListFilterFetchSuccess,
      errorCb: this.productsListFilterFetchError,
      dontShowMessage: true,
    });
  };

  productsListFilterFetchSuccess = (data) => {
    if (_get(data, "filters")) {
      const selectedFilter = this.state.selectedFilters;

      // let availableFilters = !_isEmpty(data.filters) ? this.makeFilter({ data: productdatas.filters, selectedFilter}): [];

      this.setState({ isLoading: false, productList: [] }, () => {
        this.setState({
          productList: _get(data, "products", []),
          paginationData: _get(data, "pagination", {}),
        });
        // this.setState({ parentFilters: availableFilters});
        // console.log(this.state.parentFilters, 'parent filters check')
      });
    } else if (_get(data, "code") == -1) {
      // console.log('inside products');
      this.setState({ isLoading: false, productList: [] }, () => {
        this.setState({ productList: _get(data, "products", []) });
      });
    }
  };

  productsListFilterFetchError = () => {};

  newGeneratedChild = ({ data, childId, child }) => {
    // console.log(data, 'data inside')
    const data1 = _map(_get(data, "child", []), (c) => {
      if (_get(c, "child", []).length == 0) {
        if (_get(c, "id") == childId) {
          return {
            ...c,
            selected: !child.selected,
          };
        }
        return c;
      } else {
        if (_get(c, "id") == childId) {
          return {
            ...c,
            selected: !child.selected,
            child: this.newGeneratedChild({ data: c, childId, child }),
          };
        }
        return {
          ...c,
          child: this.newGeneratedChild({ data: c, childId, child }),
        };
      }
    });
    // console.log(data1, 'data1');
    return data1;
  };

  generateParentFilter = (data, childId, child) => {
    // console.log(data, 'prev parent filter', childId)
    const parentFilter = _map(data, (d) => {
      // console.log(_get(d, 'childrenFilter', []), 'children filter');
      const updatedBaseFilter = cleanEntityData({
        label: _get(d, "label"),
        id: _get(d, "id"),
        value: _get(d, "value"),
        parameter: _get(d, "parameter"),
      });
      const updatedFilter = {
        ...updatedBaseFilter,
        childrenFilter: _map(_get(d, "childrenFilter", []), (c) => {
          if (_get(c, "id") == childId) {
            return {
              ...c,
              selected: !child.selected,
            };
          } else if (_get(c, "child", []).length != 0) {
            return {
              ...c,
              child: this.newGeneratedChild({ data: c, childId, child }),
            };
          }
          // console.log(c, 'choosen c');
          return c;
        }),
      };
      // console.log(updatedFilter, ' updated filter')
      return updatedFilter;

      //     if (_get(d, 'child').length != 0) {
      //         pchildFilter = cleanEntityData({
      //             id: _get()
      //         })
      //     }
      //     pfilter = cleanEntityData({
      //         id: _get(d, 'id')
      //     })

      //     return {
      //         let parentFilter = cleanEntityData({
      //             label: key.toUpperCase(),
      //             value: _get(value, 'id'),
      //             id:_get(value, 'id'),
      //             // parameter: key === 'size' ? 'size' : key === 'price' ? 'price' : key === 'type' ? 'catid' : key === 'country' ? 'country' : null,
      //             parameter: _get(value, 'parameter'),
      //             childrenFilter: this.generateChildrenFilter(childOptions, key, selectedFilter)
      //             // childrenFilter: _map(childOptions, c => {
      //             //     return {
      //             //         label: _get(c, 'label'),
      //             //         value: _get(c, 'value'),
      //             //         id: _get(c, 'value'),
      //             //         selected: this.updateSelectedFilter({ parentLabel: key, childLabel: _get(c, 'label'), childId: _get(c, 'value'), selectedFilter })
      //             //     }
      //             // })
      //         });
      //     }
    });
    return parentFilter;
  };

  handleChange = ({ parentIndex, childIndex, child, categoryName }) => {
    // console.log(parentIndex, childIndex, child,categoryName, 'check working' );

    console.log(this.state.parentFilters, "check 12", child);
    // state backup in case of mobile view
    if (this.state.isMobileFilterSelectedFirstTime) {
      const initialParFltr = _cloneDeep(this.state.parentFilters);
      const initialselFltr = { ...this.state.selectedFilters };
      const initialFltrBdy = _cloneDeep(this.state.filterBody);

      this.setState({
        parentFiltersBK: initialParFltr,
        selectedFiltersBK: initialselFltr,
        filterBodyBK: initialFltrBdy,
        isMobileFilterSelectedFirstTime: false,
        isLoading: true,
      });
    }

    this.setState({ isLoading: true, isMobileFilterSelectedFirstTime: false });

    const childSelectedFlag = child.selected;

    // const newParentFilters = this.state.parentFilters;

    // _set(newParentFilters,`${parentIndex}.childrenFilter.${childIndex}.selected`, !child.selected);

    // making change in logic of new parent filter

    const childId = _get(child, "id");
    let newParentFilters = this.generateParentFilter(
      this.state.parentFilters,
      childId,
      child
    );
    // console.log(newParentFilters, 'new parent filters');

    // updating the selected filters
    const selectedParents = _get(
      this.state.parentFilters,
      `${parentIndex}`,
      {}
    );
    // const selectedChild = _get(selectedParents, `childrenFilter.${childIndex}`, {});
    const selectedChild = child;

    let filterBodyUpdated = this.state.filterBody;

    if (childId != this.props.match.params.categoryId) {
      const selectedFilterBodyShopAllIndex = _findIndex(this.state.filterBody, {
        parameter: _get(selectedParents, "parameter"),
        value: this.props.match.params.categoryId,
      });
      if (selectedFilterBodyShopAllIndex != -1) {
        filterBodyUpdated.splice(selectedFilterBodyShopAllIndex, 1);
      }
    }

    // console.log(filterBodyUpdated, 'pare000')
    const newSelectedFilters = this.state.selectedFilters;
    _set(
      newSelectedFilters,
      `${
        _get(selectedParents, "label") &&
        _get(selectedParents, "label").toLowerCase()
      }__${_get(selectedChild, "id")}`,
      !childSelectedFlag
    );
    // console.log(this.state.filterBody, 'pare00');
    const selectedFilterBodyIndex = _findIndex(this.state.filterBody, {
      parameter: _get(selectedParents, "parameter"),
      value: _get(selectedChild, "value"),
    });
    // console.log(selectedFilterBodyIndex, this.state.filterBody, 'pare0')
    const payload = cleanEntityData({
      parameter: _get(selectedParents, "parameter"),
      value: _get(selectedChild, "value"),
    });

    if (selectedFilterBodyIndex === -1) {
      if (childId == this.props.match.params.categoryId) {
        filterBodyUpdated = [payload];
      } else {
        filterBodyUpdated.push(payload);
      }
    } else {
      filterBodyUpdated.splice(selectedFilterBodyIndex, 1);
    }

    // updating states
    // console.log(newSelectedFilters, 'filters');

    // find filter catid selected with more than one length

    // console.log(filterBodyUpdated, 'filter body updated');

    const categoryFiltered = _filter(filterBodyUpdated, (f) => {
      if (_get(f, "parameter", "") == "catid") {
        return f;
      }
    });
    // console.log(categoryFiltered, 'pare11', categoryFiltered);
    if (categoryFiltered.length >= 1) {
      newParentFilters = _map(newParentFilters, (np) => {
        // console.log(childId, 'pare');

        if (_get(np, "parameter", "") == "catid") {
          if (childId == this.props.match.params.categoryId) {
            // console.log('pare1');
            return {
              ...np,
              childrenFilter: _map(_get(np, "childrenFilter", []), (cf) => {
                if (_get(cf, "label") == "Shop All") {
                  return {
                    ...cf,
                    selected: true,
                  };
                }
                return {
                  ...cf,
                  selected: false,
                };
              }),
            };
          }
          // console.log('pare2')
          return {
            ...np,
            childrenFilter: _map(_get(np, "childrenFilter", []), (cf) => {
              if (_get(cf, "label") == "Shop All") {
                return {
                  ...cf,
                  selected: false,
                };
              }
              return cf;
            }),
          };
        }
        return np;
      });
    }

    // console.log(newParentFilters, 'parent filters updated');
    this.setState(
      { parentFilters: [], selectedFilters: {}, filterBody: [] },
      () => {
        this.setState({
          parentFilters: newParentFilters,
          selectedFilters: newSelectedFilters,
          filterBody: filterBodyUpdated,
          page: 0,
        });
      }
    );

    // this.setState({
    //     parentFilters: this.state.parentFilters,
    //     selectedFilters: newSelectedFilters,
    //     filterBody: filterBodyUpdated,

    // });

    if (!this.state.isMobileFilter) {
      // creating body for filter api
      let filterAPIBody = _reduce(
        filterBodyUpdated,
        (acc, val) => {
          if (acc[`${_get(val, "parameter")}`]) {
            acc[`${_get(val, "parameter")}`].push(_get(val, "value"));
          } else {
            acc[`${_get(val, "parameter")}`] = [_get(val, "value")];
          }
          return acc;
        },
        {}
      );
      let newCatgoryFilter = _get(filterAPIBody, "catid");

      // console.log(newCatgoryFilter, 'pare12')
      // if (_get(filterAPIBody, 'catid').length >= 1) {
      //     newCatgoryFilter = _filter(_get(filterAPIBody, 'catid'), c => {
      //         if (c != this.props.match.params.categoryId) {
      //             return c;
      //         }
      //     })
      // }

      filterAPIBody = {
        ...filterAPIBody,
        catid: newCatgoryFilter,
      };
      let initial;
      this.handleFilterChange({ data: filterAPIBody });
    }
  };

  handleFilterClear = () => {
    // if (this.state.isMobileFilter) {
    //     if (!this.state.isMobileFilterSelectedFirstTime){

    //         const parFltrs = this.state.parentFiltersBK;
    //         // const fltrBdy = this.state.filterBodyBK;
    //         // const slecFltr = this.state.selectedFiltersBK;
    //         this.setState({
    //             parentFilters: [],
    //             filterBody: this.state.filterBodyBK,
    //             selectedFilters: this.state.selectedFiltersBK,
    //             isMobileFilterSelectedFirstTime: true
    //         }, () => {
    //             this.setState({
    //                 parentFilters: parFltrs,
    //                 parentFiltersBK: [],
    //                 filterBodyBK: [],
    //                 selectedFiltersBK: {}
    //             });
    //         });
    //     }

    // } else {

    // creating body for filter api

    let filterBodyUpdated = [];
    const filterAPIBody = _reduce(
      this.state.filterBody,
      (acc, val) => {
        if (
          _get(val, "parameter") === "catid" &&
          _get(val, "value") === this.props.match.params.categoryId
        ) {
          acc[`${_get(val, "parameter")}`] = [_get(val, "value")];
          filterBodyUpdated.push({
            parameter: _get(val, "parameter"),
            value: _get(val, "value"),
          });
        }
        return acc;
      },
      {}
    );

    const newSelectedFilters = !_isEmpty(filterBodyUpdated)
      ? { [`type__${_get(filterBodyUpdated, "0.value")}`]: true }
      : {};
    this.setState({
      selectedFilters: newSelectedFilters,
      filterBody: filterBodyUpdated,
      parentFilters: this.state.initialParentFilters,
    });
    this.handleFilterChange({ data: filterAPIBody });
    // }
  };

  handleMobilefilterIconClick = () => {
    const filterIconState = !this.state.isMobileFilter;
    this.setState({
      isMobileFilter: filterIconState,
      isMobileFilterSelectedFirstTime: true,
    });
  };

  handleShowHideMobileFilter() {
    if (this.state.isMobileFilter) {
      return "catFiltersection show";
    } else {
      return "catFiltersection";
    }
  }

  handlePaginationFilter = ({ page, limit }) => {
    // creating body for filter api
    let filterAPIBody = _reduce(
      this.state.filterBody,
      (acc, val) => {
        if (acc[`${_get(val, "parameter")}`]) {
          acc[`${_get(val, "parameter")}`].push(_get(val, "value"));
        } else {
          acc[`${_get(val, "parameter")}`] = [_get(val, "value")];
        }
        return acc;
      },
      {}
    );

    let newCatgoryFilter = _get(filterAPIBody, "catid");
    if (_get(filterAPIBody, "catid").length > 1) {
      newCatgoryFilter = _filter(_get(filterAPIBody, "catid"), (c) => {
        if (c != this.props.match.params.categoryId) {
          return c;
        }
      });
    }

    filterAPIBody = {
      ...filterAPIBody,
      catid: newCatgoryFilter,
    };

    this.handleFilterChange({
      data: filterAPIBody,
      pageNo: page + 1,
      limitNo: limit,
    });
    // this.setState({
    //     isMobileFilter: !this.state.isMobileFilter,
    //     isMobileFilterSelectedFirstTime: false,
    //     parentFiltersBK: [],
    //     selectedFiltersBK: {},
    //     filterBodyBK: [],
    //     isLoading: true
    // });
  };

  handleFilterApply = () => {
    // creating body for filter api
    const filterAPIBody = _reduce(
      this.state.filterBody,
      (acc, val) => {
        if (acc[`${_get(val, "parameter")}`]) {
          acc[`${_get(val, "parameter")}`].push(_get(val, "value"));
        } else {
          acc[`${_get(val, "parameter")}`] = [_get(val, "value")];
        }
        return acc;
      },
      {}
    );
    this.handleFilterChange({ data: filterAPIBody });
    this.setState({
      isMobileFilter: !this.state.isMobileFilter,
      isMobileFilterSelectedFirstTime: false,
      parentFiltersBK: [],
      selectedFiltersBK: {},
      filterBodyBK: [],
      isLoading: true,
    });
  };

  handleFilterCancel = () => {
    if (!this.state.isMobileFilterSelectedFirstTime) {
      const parFltrs = _cloneDeep(this.state.parentFiltersBK);
      // const fltrBdy = this.state.filterBodyBK;
      // const slecFltr = this.state.selectedFiltersBK;
      this.setState(
        {
          parentFilters: [],
          filterBody: this.state.filterBodyBK,
          selectedFilters: this.state.selectedFiltersBK,
          isMobileFilterSelectedFirstTime: false,
        },
        () => {
          this.setState({
            parentFilters: parFltrs,
            parentFiltersBK: [],
            filterBodyBK: [],
            selectedFiltersBK: {},
          });
        }
      );
    }
    this.setState({
      isMobileFilter: !this.state.isMobileFilter,
    });
  };

  openedFilterPanel = (label) => (event, isExpanded) => {
    const avlblExpandedFilterPanel = _cloneDeep(this.state.expandedFilterPanel);
    _set(avlblExpandedFilterPanel, label, isExpanded);

    this.setState({
      expandedFilterPanel: avlblExpandedFilterPanel,
    });
  };

  handlePageClick = (page) => {
    // console.log("current page>>>", page, this.state.filterBody)
    this.setState({ page });
    if (this.props.location.pathname == "/store/search") {
      this.fetchSearchProducts(
        this.props.globalProductSearch,
        page,
        this.state.limit
      );
    } else if (!_isEmpty(this.state.filterBody)) {
      this.handlePaginationFilter({ page, limit: this.state.limit });
    } else {
      this.fetchProducts(
        this.props.match.params.categoryId,
        page,
        this.state.limit
      );
    }
  };
  handlePageSizeChange = (value) => {
    console.log("current limit>>>", value);
    this.setState({ page: 0, limit: value });
    if (this.props.location.pathname == "/store/search") {
      this.fetchSearchProducts(this.props.globalProductSearch, 0, value);
    } else {
      this.fetchProducts(this.props.match.params.categoryId, 0, value);
    }
  };

  render() {
    const { classes } = this.props;
    const { isLoading } = this.state;
    console.log(this.state.productList, "products");

    let errorText = null;
    if (_get(this.props.productApiData, "code", 1) == -1) {
      errorText = _get(
        this.props.productApiData,
        "message",
        "This category contains no products"
      );
    }

    return (
      <React.Fragment>
        <CssBaseline />
        {/* <div className="breadCrumb">
                    <ul>                        
                        <li><a href="#">Home</a></li>
                        <li>Wine</li>
                    </ul>
                </div> */}
        <div className="page-content-container">
          <Container fluid={true} className="proCategoryList">
            <div className="titleandFilterbar">
              {/* <h1>{_get(this.props,'match.params.categoryType','')}</h1> */}
              <h1>{_get(this.props, "match.params.categoryName", "")}</h1>

              <div className="d-flex align-items-center">
                {errorText == null ? (
                  <div className="mr-2">
                    <ButtonDropdown
                      left
                      isOpen={this.state.sortToggle}
                      toggle={this.toggleSort}
                    >
                      <DropdownToggle className="rounded-0" outline>
                        Sort by
                        <SortIcon
                          className="ml-2"
                          style={{ fontSize: 15 }}
                        ></SortIcon>
                      </DropdownToggle>
                      <DropdownMenu>
                        {/* <DropdownItem><div onClick={() => this.sortData('Popular')}>Popular</div></DropdownItem>
                                        <DropdownItem><div onClick={() => this.sortData('Low')}>Price-Low to High</div></DropdownItem>
                                        <DropdownItem><div onClick={() => this.sortData('High')}>Price- High to Low</div></DropdownItem> */}
                        <DropdownItem>
                          <div onClick={() => this.sortData("A")}>
                            Name- A to Z
                          </div>
                        </DropdownItem>
                        <DropdownItem>
                          <div onClick={() => this.sortData("Z")}>
                            Name- Z to A
                          </div>
                        </DropdownItem>
                        <DropdownItem>
                          <div onClick={() => this.sortData("high")}>
                            Price- High to Low
                          </div>
                        </DropdownItem>
                        <DropdownItem>
                          <div onClick={() => this.sortData("low")}>
                            Price- Low to High
                          </div>
                        </DropdownItem>
                      </DropdownMenu>
                    </ButtonDropdown>
                  </div>
                ) : null}

                <div
                  className="filterIcon d-md-none"
                  onClick={() => this.handleMobilefilterIconClick()}
                >
                  Filter
                  <FilterListIcon
                    className="ml-2"
                    style={{ fontSize: 15 }}
                  ></FilterListIcon>
                </div>
              </div>
            </div>
            <div className="productCategoryList-wrapper">
              <div className={this.handleShowHideMobileFilter()}>
                <div className="filterInneritems">
                  <div className="filterTilte d-flex align-items-center">
                    <div className="d-flex align-items-center">
                      <CloseIcon
                        className="closeFilterbtn d-md-none"
                        onClick={this.handleFilterCancel}
                      ></CloseIcon>
                      <div className="filterTilte">Filter</div>
                    </div>
                    <div className="clearAll " onClick={this.handleFilterClear}>
                      Clear All
                    </div>
                  </div>
                  <div className="filterWrapper">
                    <ProductFilter
                      {...this.props}
                      parentFilters={this.state.parentFilters}
                      handleChange={this.handleChange}
                      openedFilterPanel={this.openedFilterPanel}
                      expandedFilterPanel={this.state.expandedFilterPanel}
                    />
                  </div>
                  {this.state.isMobileFilter ? (
                    <div className="filterActionbtn">
                      <Button
                        variant="contained"
                        color="secondary"
                        className="mr-4 rounded-0"
                        onClick={this.handleFilterCancel}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        className="rounded-0 applyBtnfilter"
                        onClick={this.handleFilterApply}
                      >
                        Apply
                      </Button>
                    </div>
                  ) : null}
                </div>
              </div>
              {!_isEmpty(this.state.productList) ? (
                <div className="proListsection">
                  {isLoading ||
                  (this.props.isLoadingFromGlobalSearch &&
                    this.props.location.pathname == "/store/search") ? (
                    <LoaderOverLay />
                  ) : (
                    this.state.productList &&
                    this.state.productList.length > 0 && (
                      <>
                        <div className="pagination-container">
                          <Select
                            className="pageSize"
                            value={this.state.limit}
                            placeholder="Select Page Size"
                            style={{ marginRight: "10px", minWidth: "100px" }}
                            onChange={this.handlePageSizeChange}
                          >
                            <Select.Option value="10">10</Select.Option>
                            <Select.Option value="20">20</Select.Option>
                            <Select.Option value="50">50</Select.Option>
                          </Select>
                          <StoreCategoryPagination
                            forcePage={this.state.page}
                            pageCount={this.state.paginationData?.total_page}
                            handlePageClick={this.handlePageClick}
                            itemsPerPage={4}
                          />
                        </div>

                        <ProductsListing
                          tabValue={this.state.tabValue}
                          {...this.props}
                          productListingAfterSort={this.state.productList}
                        />
                        <div>
                          <div
                            style={
                              !this.props.productisLoading
                                ? { display: "none" }
                                : null
                            }
                          >
                            {" "}
                            <LoaderOverLay />
                          </div>
                          <div className="mt-2 pagination-container">
                            <Select
                              className="pageSize"
                              value={this.state.limit}
                              placeholder="Select Page Size"
                              style={{ marginRight: "10px", minWidth: "100px" }}
                              onChange={this.handlePageSizeChange}
                            >
                              <Select.Option value="10">10</Select.Option>
                              <Select.Option value="20">20</Select.Option>
                              <Select.Option value="50">50</Select.Option>
                            </Select>
                            <StoreCategoryPagination
                              forcePage={this.state.page}
                              pageCount={this.state.paginationData?.total_page}
                              handlePageClick={this.handlePageClick}
                              itemsPerPage={4}
                            />
                          </div>
                        </div>
                      </>
                    )
                  )}
                </div>
              ) : (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    borderStyle: "solid",
                    borderWidth: "1px",
                    borderColor: "grey",
                    marginLeft: "1%",
                  }}
                >
                  {isLoading ? <LoaderOverLay /> : null}
                  {errorText}
                </div>
              )}
            </div>
          </Container>
        </div>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state) {
  let isLoadingFromGlobalSearch = _get(state, "searchProductsData.isFetching");
  let categoriesList = _get(state, "categoriesList.lookUpData.data");
  let productListingData = _get(state, "productList.lookUpData.products", {});
  let productApiData = _get(state, "productList.lookUpData", {});
  let searchListingData = _get(
    state,
    "searchProductsData.lookUpData.products",
    {}
  );
  let searchProductApiData = _get(state, "searchProductsData.lookUpData", {});
  let globalProductSearch = _get(state, "globalProductSearch.lookUpData", "");

  let productisLoading = _get(state, "productList.isFetching");
  let cartData = _get(state, "cart.lookUpData.0.result");
  return {
    isLoadingFromGlobalSearch,
    categoriesList,
    productListingData,
    productisLoading,
    productApiData,
    searchProductApiData,
    searchListingData,
    globalProductSearch,
    cartData,
  };
}

export default connect(mapStateToProps)(withStyles(styles)(ProductsContainer));
