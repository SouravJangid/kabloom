import React from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import withStyles from '@material-ui/core/styles/withStyles';
import { connect } from 'react-redux';
import ProductTabs from '../../Components/ProductComponents/ProductTabs';
import { map as _map, findIndex as _findIndex, find as _find, get as _get, forEach as _forEach, isEmpty as _isEmpty, set as _set, reduce as _reduce, cloneDeep as _cloneDeep, orderBy as _orderBy, slice as _slice } from 'lodash';
import ProductsListing from "../../Components/Wallet/WalletCategoryComponents";
import ProductDetails from "../../Components/ProductComponents/ProductDetails"
import genericGetData from "../../Redux/Actions/genericGetData";
import { genericPostData } from "../../Redux/Actions/genericPostData";
import {Container, Row, Col, ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button} from 'reactstrap';
import { Loader } from '../../Global/UIComponents/LoaderHoc';
import SortIcon from '@material-ui/icons/Sort';
import CloseIcon from '@material-ui/icons/Close';
import ProductFilter from '../../Components/Wallet/WalletCategoryFilter';
import FilterListIcon from '@material-ui/icons/FilterList';
// import WithLoading from '../../Global/UIComponents/LoaderHoc';
import { cleanEntityData, formatPrice } from '../../Global/helper/commonUtil';
// import { updateParentFilter } from '../../Components/StoreCategoryComponents/StoreCategoryFilter';

// radio button



const styles = theme => ({
    main: {
        width: 'auto',
        display: 'block', // Fix IE 11 issue.
        marginLeft: theme.spacing(3),
        marginRight: theme.spacing(3),
        [theme.breakpoints.up(400 + theme.spacing(3 * 2))]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing(2)}px ${theme.spacing(3)}px ${theme.spacing(3)}px`,
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        marginTop: theme.spacing(3),
    },
    
});

// pure functions
// export function setProductList(data) {
    
//         this.setState({
//             productList: _get(data, 'products')
//         });
// };

// pure functions
// export function updateParentFilter(data) {
//     const newSelectedFilter = {};
//     let availableFilters = !_isEmpty(data.filters) ? this.makeFilter({ data: data.filters, selectedFilter: newSelectedFilter}): [];
    
//     // filter option
//     const catLabel = 'type';
    
//     const selectedcatId = this.props.match.params.categoryId;
    
//     const selectedParent = _find(availableFilters, [ 'label', catLabel.toUpperCase()]);
    
//     _set(newSelectedFilter, `type__${selectedcatId}`, true); 
    
//     const newFilterBody = [{ parameter: _get(selectedParent, 'parameter'), value: this.props.match.params.categoryId }]
    
//     this.setState({
//             parentFilters: availableFilters,
//             selectedFilters: newSelectedFilter,
//             filterBody: newFilterBody,
//             expandedFilterPanel: {[`${_get(selectedParent, 'label')}`]: true}
//         });
// }




class WalletProductListing extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabValue: 0,
            selectedTab: "",
            isLoading: true,           
            sortToggle: false,
            productList: [],
            parentFilters: [],
            parentFiltersBK: [],
            selectedFilters: {},
            selectedFiltersBK: {},
            filterBody: [],
            filterBodyBK: [],
            isMobileFilter: false,
            isMobileFilterSelectedFirstTime: false,
            expandedFilterPanel: {},
            selectedRadioFilter: null,
            selectedFilterOption: {},
            filterOptions: [],
        };
        // setProductList = setProductList.bind(this);
        // updateParentFilter = updateParentFilter.bind(this);
    }

    // pure function
    updateSelectedFilter = ({ parentLabel, childLabel, childId, selectedFilter, selectedRetailerId }) => {
        
        
        if (_isEmpty(selectedFilter)) {
            const catLabel = 'retailer';
            const selectedCategory = selectedRetailerId;
            
            
            const response = ((parentLabel && parentLabel.toLowerCase() === catLabel) && (childId == selectedCategory)) ? true : false;
            
            // console.log('selected filter', response);
            if (response === true) {
              
              this.setState({
                selectedRadioFilter: childId
              })
            }
            return response;
        } else {
            
            const filterString = `${parentLabel && parentLabel.toLowerCase()}__${childId}`;
            
            const response = _get(this.state, `selectedFilters.${filterString}`, false);
            
            return response; 
        }


    }
    
    // pure function
    makeFilter = ({ data, selectedFilter, selectedRetailerId }) => {
        let filterData = [];
        _forEach(data, (value, key) => {
                const childOptions = _get(value, 'options') || _get(value, 'optoions');
                let parentFilter = cleanEntityData({
                    label: key.toUpperCase(),
                    value: _get(value, 'id'),
                    id:_get(value, 'id'),
                    // parameter: key === 'size' ? 'size' : key === 'price' ? 'price' : key === 'type' ? 'catid' : key === 'country' ? 'country' : null,
                    parameter: _get(value, 'parameter'),
                    childrenFilter: _map(childOptions, c => {
                        return {
                            label: _get(c, 'label'),
                            value: _get(c, 'value'),
                            id: _get(c, 'value'), 
                            selected: this.updateSelectedFilter({ parentLabel: key, childLabel: _get(c, 'label'), childId: _get(c, 'value'), selectedFilter, selectedRetailerId })
                        }
                    })
                }); 
                filterData.push(parentFilter);

                
        });
        return filterData;
        
    }
    // componentWillReceiveProps(nextProps) {
    //     if(nextProps.match.params.categoryId != this.props.match.params.categoryId){
    //         window.scrollTo(0, 0);
    //         const categoryID = nextProps.match.params.categoryId;
    //         this.fetchProducts(categoryID);
    //     }
       
    // }
    
    componentDidMount() {
        window.scrollTo(0, 0);

        const defaultDate = this.props.history.location.state?.date;
        const defaultTime = this.props.history.location.state?.time;
        const retailerId = this.props.history.location.state?.retailerId;

        // const categoryID = this.props.match.params.categoryId;
        // this.fetchProducts(categoryID);
        
        

        // new changes

        const retailerLocId = this.props.match.params.retailerId;
        // const filters = _slice(this.props.walletShipping, 0, 5);
        const filter_options = _map(this.props.walletShipping, d => ({
          "value": _get(d, 'location_id'),
          "label": _get(d, 'vendor_name')
        }));

        const selectedSuppFilter = _find(filter_options, ['value', retailerLocId])
        // this.setState({
        //   selectedFilterOption: filter_options
        // });
        this.setState({
          selectedRetailerId: retailerLocId,
          selectedFilterOption: selectedSuppFilter,
          filterOptions: filter_options
        });

        this.fetchWalletProducts({ retailerId });

    }

    fetchWalletProducts = async ({retailerId}) => {
      
      const reqbody = cleanEntityData({
          vendor_id: retailerId,
          customer_id: this.props.customer_id
          // vendor_id: 6621,
          // customer_id: '7099'
      });
      // console.log('select', retailerId);
      genericPostData({
          dispatch: this.props.dispatch,
          reqObj: reqbody,
          url: `/api/walletproductlst/walletProducts`,
          constants: {
              init: "WALLET_PRODUCT_INIT",
              success: "WALLET_PRODUCT_SUCCESS",
              error: "WALLET_PRODUCT_ERROR"
          },
          identifier: "WALLET_PRODUCT",
          successCb: this.walletProductSuccess,
          errorCb: this.walletProductError,
          dontShowMessage: true,
      });
    }

    walletProductSuccess = (data) => {
      
      // const slicedFilters = _slice(this.props.walletShipping, 0, 20);
      const slicedFilters = this.props.walletShipping;
      const options = _map(slicedFilters, d => cleanEntityData({
        "value": _get(d, 'location_id'),
        "label": _get(d, 'vendor_name')
      }));
      
        if (!_isEmpty(data)) {
            // this.setState({
            //     productList: data
            // })
            const finalData = {
              "filters": {
                "retailer": {
                  "id": 502,
                  "parameter": "retailer",
                  "options": options
                
                  
                  
                },
                
              },
              "products": data,
            };
            // console.log('final product listing', finalData);

            this.productsListFetchSuccess(finalData);
        }
    };
    walletProductError = (err) => {
        console.log('error in wallet product', err);
    }


    // handleTabChange = (index, selectedTab) => {
    //     this.setState({ tabValue: index, isLoading: true });
    //     this.fetchProducts(selectedTab);
    // };

    // fetchProducts = (categoryID) => {
    //     const zipcode = localStorage.getItem("zipcode");
    //     // const location = localStorage.getItem("location");
    //     const locTime = localStorage.getItem("dineinTime");
    //     const retailer = localStorage.getItem("retailer");
    //     let urlparam = ''
    //     // if (!_isEmpty(zipcode) && !_isEmpty(location)) {
    //     //     urlparam = `/connect/index/category?catid=${categoryID}&store_id=1&zipcode=${zipcode}&location=${location}&dineinTime=${locTime}&retailer=${retailer}`;
    //     // } else if (!_isEmpty(zipcode)){
    //     //     urlparam = `/connect/index/category?catid=${categoryID}&store_id=1&zipcode=${zipcode}&dineinTime=${locTime}&retailer=${retailer}`;
    //     // } else if (!_isEmpty(location)) {
    //     //     urlparam = `/connect/index/category?catid=${categoryID}&store_id=1&location=${location}&dineinTime=${locTime}&retailer=${retailer}`;
    //     // }

    //     if (!_isEmpty(zipcode)) {
    //         urlparam = `/connect/index/category?catid=${categoryID}&store_id=1&zipcode=${zipcode}&loc_id=${retailer}`
    //     } else {
    //         urlparam = `/connect/index/category?catid=${categoryID}&store_id=1&zipocde=&loc_id=${retailer}`
    //     }
    //     genericGetData({
    //         dispatch:this.props.dispatch,
    //         url:urlparam,
    //         constants:{
    //         init:"PRODUCTS_LIST_INIT",
    //         success:"PRODUCTS_LIST_SUCCESS",
    //         error:"PRODUCTS_LIST_ERROR" 
    //         },
    //         identifier:"PRODUCTS_LIST",
    //         successCb:this.productsListFetchSuccess,
    //         errorCb:this.productsListFetchError,
    //         dontShowMessage: true
    //     })
    // }

    productsListFetchSuccess = (data) => {
        // console.log('product listing', data);
        // this.setState({ isLoading: false , productList: _get(this.props,'productListingData', [])});
        this.setState({ isLoading: false, productList: {}}, () => {
          this.setState({
            productList: data.products
          })
        })
       

        // filter option
        const catLabel = 'retailer';
        const newSelectedFilter = {};
        let availableFilters = !_isEmpty(data.filters) ? this.makeFilter({ data: data.filters, selectedFilter: newSelectedFilter, selectedRetailerId: this.state.selectedRetailerId }): [];
        
        const selectedcatId = this.props.match.params.retailerId;
        
        const selectedParent = _find(availableFilters, [ 'label', catLabel.toUpperCase()]);
        
        _set(newSelectedFilter, `retailer__${selectedcatId}`, true);

        this.setState({
            parentFilters: availableFilters,
            selectedFilters: newSelectedFilter,
            filterBody: [{ parameter: _get(selectedParent, 'parameter'), value: this.props.match.params.retailerId }],
            expandedFilterPanel: {[`${_get(selectedParent, 'label')}`]: true}
        });

        // end
    }

    productsListFetchError = () => {

    }

    handleCheckboxChange = () => {
        this.setState( {
            checkboxSelected: true
        })
    }
    toggleSort = () => {
        this.setState({
            sortToggle: !this.state.sortToggle
        })
    }

    sortData = (val) => {
        let sortedData = [];
        // const productList =  this.props.productListingData;
        const productList = this.state.productList;
        if (val === 'A' || val === 'Z') {
            
            const sortData = productList.sort((a, b) => {
            var nameA=a.name.toLowerCase(), nameB=b.name.toLowerCase();
            if (nameA < nameB) //sort string ascending
             return -1;
            if (nameA > nameB)
             return 1;
            return 0; //default return value (no sorting)
           });
           sortedData = val === 'A' ? sortData : sortData.reverse();
        } else if ( val === 'high') {
            const newProductList = _reduce(productList, (acc, val) => {
                const newList = {
                    ...val,
                    defaultPrice: !_isEmpty(_get(val, 'child.0.price', '')) ? formatPrice(_get(val, 'child.0.price')) : 0,
                };
                acc.push(newList);
                return acc;
            },[]);
            sortedData = _orderBy(newProductList, ['defaultPrice'], ['desc']);
            
        } else if (val === 'low') {
            const newProductList = _reduce(productList, (acc, val) => {
                const newList = {
                    ...val,
                    defaultPrice: !_isEmpty(_get(val, 'child.0.price', '')) ? formatPrice(_get(val, 'child.0.price')) : 0,
                };
                acc.push(newList);
                return acc;
            },[]);
            sortedData = _orderBy(newProductList, ['defaultPrice'], ['asc']);
        };
        
        this.setState({ productList: [] }, () => {
            this.setState({ productList: sortedData});
        });
    };

    handleFilterChange = ({ data }) => {
        const zipcode = localStorage.getItem("zipcode");
        const loc_id = localStorage.getItem('retailer');
        const newData = {
            ...data,
            zipcode: zipcode ? zipcode : "",
            loc_id: loc_id ? loc_id: ""
        };
        genericPostData({
            dispatch: this.props.dispatch,
            reqObj: newData,
            url: '/connect/index/filters',
            constants:{
                init:"PRODUCTS_LIST_INIT",
                success:"PRODUCTS_LIST_SUCCESS",
                error:"PRODUCTS_LIST_ERROR" 
            },
            identifier:"PRODUCTS_LIST",
            successCb: this.productsListFilterFetchSuccess,
            errorCb: this.productsListFilterFetchError,
            dontShowMessage: true
        });
    };

    productsListFilterFetchSuccess = (data) => {
        if (_get(data, 'filters')) {
            const selectedFilter = this.state.selectedFilters;
            
            let availableFilters = !_isEmpty(data.filters) ? this.makeFilter({ data: data.filters, selectedFilter}): [];

            this.setState({ parentFilters: [], isLoading: false, productList: _get(data, 'products', []) }, () => {
                this.setState({ parentFilters: availableFilters});
            });
        }
        
    };

    productsListFilterFetchError = () => {

    };


    handleChange = (selectedOption) => {
      // console.log('event', event);
      // console.log('selected options', selectedOption);
      this.setState({
        selectedFilterOption: selectedOption,
        selectedRetailerId: _get(selectedOption, 'value')
      });

      const retailer = this.props.walletShipping?.find((x)=> x.location_id ==  _get(selectedOption, 'value')) ;

      localStorage.setItem("retailer", _get(retailer, 'vendor_id'));
      localStorage.setItem("retailer_name", _get(selectedOption, 'label'));

      localStorage.setItem("vendor_location_id", _get(selectedOption, 'value') );

      this.fetchWalletProducts({ retailerId: _get(retailer, 'vendor_id') });

        // state backup in case of mobile view
        // if (this.state.isMobileFilterSelectedFirstTime) {
            
        //     const initialParFltr = _cloneDeep(this.state.parentFilters);
        //     const initialselFltr = { ...this.state.selectedFilters };
        //     const initialFltrBdy = _cloneDeep(this.state.filterBody);

            
        //     this.setState({
        //         parentFiltersBK: initialParFltr,
        //         selectedFiltersBK: initialselFltr,
        //         filterBodyBK: initialFltrBdy,
        //         isMobileFilterSelectedFirstTime: false,
        //     });
        // };

        
        
        // const childSelectedFlag = child.selected;

        // const newParentFilters = this.state.parentFilters;
        
        
        // _set(newParentFilters,`${parentIndex}.childrenFilter.${childIndex}.selected`, !child.selected);
        
        

        // // updating the selected filters
        // const selectedParents = _get(this.state.parentFilters, `${parentIndex}`, {});
        // const selectedChild = _get(selectedParents, `childrenFilter.${childIndex}`, {});
        // const newSelectedFilters = this.state.selectedFilters;
        // _set(newSelectedFilters, `${_get(selectedParents, 'label') && _get(selectedParents, 'label').toLowerCase()}__${_get(selectedChild, 'id')}`, !childSelectedFlag);

        // const selectedFilterBodyIndex = _findIndex(this.state.filterBody, {'parameter': _get(selectedParents, 'parameter'), 'value': _get(selectedChild, 'value')});
        // const payload = cleanEntityData({
        //     parameter: _get(selectedParents, 'parameter'),
        //     value: _get(selectedChild, 'value')
        // });

        // let filterBodyUpdated = this.state.filterBody;
        // if (selectedFilterBodyIndex === -1 ) {
            
        //     filterBodyUpdated.push(payload);
        // } else {
            
        //     filterBodyUpdated.splice(selectedFilterBodyIndex, 1);
        // }


        

        // updating states

        // this.setState({ parentFilters: [],  selectedFilters: {}, filterBody: [] }, () => {
        //     this.setState({ 
        //         parentFilters: newParentFilters,
        //         selectedFilters: newSelectedFilters,
        //         filterBody: filterBodyUpdated,
        //     });
        // });
        // this.setState({
        //     parentFilters: this.state.parentFilters,
        //     selectedFilters: newSelectedFilters,
        //     filterBody: filterBodyUpdated,

        // });


        // if (!this.state.isMobileFilter){
        //     // creating body for filter api
        //     const filterAPIBody = _reduce(filterBodyUpdated, (acc, val) => {
        //         if (acc[`${_get(val, 'parameter')}`]) {
        //             acc[`${_get(val, 'parameter')}`].push(_get(val, 'value'));
        //         } else {
        //             acc[`${_get(val, 'parameter')}`] =  [_get(val, 'value')];
        //         }
        //         return acc;
        //     }, {});
        //     this.handleFilterChange({data: filterAPIBody});
        // };
        

        
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
            const filterAPIBody = _reduce(this.state.filterBody, (acc, val) => {
                if (_get(val, 'parameter') === 'retailer' && _get(val, 'value') === this.props.match.params.retailerId) {
                    acc[`${_get(val, 'parameter')}`] = [_get(val, 'value')];
                    filterBodyUpdated.push({ parameter: _get(val, 'parameter'), value: _get(val, 'value')});
                    
                }
                return acc;
                
            }, {});

            const newSelectedFilters = !_isEmpty(filterBodyUpdated) ? { [`retailer__${_get(filterBodyUpdated, '0.value')}`]: true} : {};
            this.setState({
                selectedFilters: newSelectedFilters,
                filterBody: filterBodyUpdated
            });
            this.handleFilterChange({data: filterAPIBody});
        // }
    };  

    handleMobilefilterIconClick = () => {
        const filterIconState = !this.state.isMobileFilter
        this.setState({
            isMobileFilter:filterIconState,
            isMobileFilterSelectedFirstTime: true
        });
    };

    handleShowHideMobileFilter (){
        if (this.state.isMobileFilter) {
            return 'catFiltersection show'
        } else {
            return 'catFiltersection'
        }
    };

    handleFilterApply = () => {
        // creating body for filter api
        const filterAPIBody = _reduce(this.state.filterBody, (acc, val) => {
            if (acc[`${_get(val, 'parameter')}`]) {
                acc[`${_get(val, 'parameter')}`].push(_get(val, 'value'));
            } else {
                acc[`${_get(val, 'parameter')}`] =  [_get(val, 'value')];
            }
            return acc;
        }, {});
        this.handleFilterChange({data: filterAPIBody});
        this.setState({
            isMobileFilter: !this.state.isMobileFilter,
            isMobileFilterSelectedFirstTime: false,
            parentFiltersBK: [],
            selectedFiltersBK: {},
            filterBodyBK: []
        });
    };

    handleFilterCancel = () => {
        if (!this.state.isMobileFilterSelectedFirstTime){
                
            const parFltrs = _cloneDeep(this.state.parentFiltersBK);
            // const fltrBdy = this.state.filterBodyBK;
            // const slecFltr = this.state.selectedFiltersBK;
            this.setState({
                parentFilters: [],
                filterBody: this.state.filterBodyBK,
                selectedFilters: this.state.selectedFiltersBK,
                isMobileFilterSelectedFirstTime: false
            }, () => {
                this.setState({
                    parentFilters: parFltrs,
                    parentFiltersBK: [],
                    filterBodyBK: [],
                    selectedFiltersBK: {}
                });
            });
        };
        this.setState({
            isMobileFilter: !this.state.isMobileFilter,
        });

    }

    openedFilterPanel = (label) =>(event, isExpanded) =>  {

        const avlblExpandedFilterPanel = _cloneDeep(this.state.expandedFilterPanel);
        _set(avlblExpandedFilterPanel, label, isExpanded);

        this.setState({
            expandedFilterPanel: avlblExpandedFilterPanel
        });
    }

    render() {
        const { classes } = this.props;
        const { isLoading } = this.state;

        return (
            <React.Fragment>
                <CssBaseline /> 
                {/* <div className="breadCrumb">
                    <ul>                        
                        <li><a href="#">Home</a></li>
                        <li>Wine</li>
                    </ul>
                </div> */}
                <div className="page-content-container walletproductlist">  
                  <Container fluid={true}  className="proCategoryList">
                      <div className="titleandFilterbar">
                        <h1>{_get(this.props,'match.params.categoryType','')}</h1>

                          <div className="d-flex align-items-center">
                              <div className="mr-2" >  
                                  <ButtonDropdown left  isOpen={this.state.sortToggle} toggle={this.toggleSort}> 
                                    <DropdownToggle className="rounded-0" outline>
                                        Sort by<SortIcon className="ml-2" style={{fontSize:15}}></SortIcon>
                                    </DropdownToggle>
                                    <DropdownMenu>
                                        {/* <DropdownItem><div onClick={() => this.sortData('Popular')}>Popular</div></DropdownItem>
                                        <DropdownItem><div onClick={() => this.sortData('Low')}>Price-Low to High</div></DropdownItem>
                                        <DropdownItem><div onClick={() => this.sortData('High')}>Price- High to Low</div></DropdownItem> */}
                                        <DropdownItem><div onClick={() => this.sortData('A')}>Name- A to Z</div></DropdownItem>
                                        <DropdownItem><div onClick={() => this.sortData('Z')}>Name- Z to A</div></DropdownItem>
                                        <DropdownItem><div onClick={() => this.sortData('high')}>Price- High to Low</div></DropdownItem>
                                        <DropdownItem><div onClick={() => this.sortData('low')}>Price- Low to High</div></DropdownItem>
                                    </DropdownMenu>
                                    </ButtonDropdown>
                                </div>
                               
                                    <div className="filterIcon d-md-none" onClick={() => this.handleMobilefilterIconClick()}>Filter<FilterListIcon className="ml-2" style={{fontSize:15}}></FilterListIcon></div>
                             </div>
                      </div>
                    <div className="productCategoryList-wrapper">
                        <div className={this.handleShowHideMobileFilter()}> 
                         <div className="filterInneritems">                
                            <div className="filterTilte d-flex align-items-center">                                
                                <div className="d-flex align-items-center">                                
                                <CloseIcon className="closeFilterbtn d-md-none" onClick={this.handleFilterCancel}></CloseIcon>
                                <div className="filterTilte">Filter</div> 
                                </div>
                                {/* <div className="clearAll " onClick={this.handleFilterClear}>Clear All</div> */}
                            </div>
                            <div className="filterWrapper">
                                <ProductFilter
                                    {...this.props}
                                    parentFilters={this.state.parentFilters}  
                                    handleChange={this.handleChange}
                                    openedFilterPanel={this.openedFilterPanel}
                                    expandedFilterPanel={this.state.expandedFilterPanel}   
                                    selectedRadioFilter={this.state.selectedRadioFilter} 
                                    selectedFilterOption={this.state.selectedFilterOption}
                                    filterOptions={this.state.filterOptions}

                                />                            
                            </div>
                            { this.state.isMobileFilter ?
                            <div className="filterActionbtn"> 
                             <Button variant="contained" color="secondary" className="mr-4 rounded-0" onClick={this.handleFilterCancel}>
                                    Cancel
                                </Button>
                                <Button variant="contained" color="primary" className="rounded-0 applyBtnfilter" onClick={this.handleFilterApply}>
                                Apply
                                </Button>
                               
                            </div>
                            : null }

                        </div>
                     </div>
                    <div className="proListsection">
                        {isLoading ?  
                            <Loader /> : this.state.productList && this.state.productList.length > 0 && 
                            <ProductsListing tabValue={this.state.tabValue} 
                            {...this.props} 
                            productListingAfterSort={this.state.productList} /> 
                        }
                    </div>              
                     </div>
                </Container>
                </div>
            </React.Fragment>
            
        );
    }
}

function mapStateToProps(state) {
    let categoriesList = _get(state,'categoriesList.lookUpData.data');
    let productListingData = _get(state,'productList.lookUpData.products', {});
    // let isLoading = _get(state, 'productList.isFetching');
    let walletShipping = _get(state,'walletShipping.lookUpData', {});
    let customer_id = _get(state, 'userSignInInfo.lookUpData.0.result.customer_id');
    return {categoriesList, productListingData, walletShipping, customer_id};
}

export default connect(mapStateToProps)(withStyles(styles)(WalletProductListing));