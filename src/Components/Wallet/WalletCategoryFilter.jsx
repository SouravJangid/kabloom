import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';
// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
// import { genericPostData } from "../../Redux/Actions/genericPostData";
import {get as _get , isEmpty as _isEmpty, set as _set, forEach as _forEach, map as _map, find as _find, findIndex as _findIndex, reduce as _reduce} from 'lodash';
import Divider from '@material-ui/core/Divider';


// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import { cleanEntityData } from '../../Global/helper/commonUtil';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Select from 'react-select';
import { TextField } from '@material-ui/core';
import moment from 'moment';



// radio button

import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
// import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';



// export function updateParentFilter(data) {
//     let availableFilters = !_isEmpty(data.filters) ? this.makeFilter({ data: data.filters}): [];
//         this.setState({
//             parentFilters: availableFilters
//         });
// }


// const styles = theme => ({
//     root: {
//         width: '100%',
//         // marginLeft: 'auto',
//         // marginRight: 'auto',            
//         // paddingBottom: 0,
//         // marginTop: 0,
//         // fontWeight: 500
//     },
    
// });


const colourStyles = {
    control: (styles, state) => ({ 
      ...styles, 
      backgroundColor: 'rgba(255,255,255,0)', 
      border: state.isFocused ? 0 : 0, 
      borderBottom: '1px solid white',
      boxShadow: state.isFocused ? 0 : 0, 
      borderRadius: 0,
      "&:hover": {
        border: state.isFocused ? 0 : 0,
        borderBottom: '1px solid white',
      }
    
    }),
    option: (styles, state) => ({
      ...styles,
      color: 'black',
      // backgroundColor: 'rgba(255,255,255,0)'
    }),
    singleValue: (styles) => ({ ...styles, color: '#000' }),
    valueContainer: base => ({
      ...base,    
      padding: '0px',
    }),
    clearIndicator: base => ({
      ...base,
      padding: '0px',
    }),
    dropdownIndicator: base => ({
      ...base,
      padding: '0px',
    }),
  }




const ExpansionPanel = withStyles({
    root: {
      border: '1px solid rgba(0, 0, 0, .125)',
      boxShadow: 'none',
      minHeight: 25
    //   '&:not(:last-child)': {
    //     borderBottom: 0,
    //   },
    //   '&:before': {
    //     display: 'none',
    //   },
    //   '&$expanded': {
    //     margin: 'auto',
    //   },
    },
    expanded: {},
  })(MuiExpansionPanel);

  const ExpansionPanelSummary = withStyles({
    root: {
    //   backgroundColor: 'rgba(0, 0, 0, .03)',
    //   borderBottom: '1px solid rgba(0, 0, 0, .125)',
    //   marginBottom: -1,
        height: 35,
      minHeight: 12,
      '&$expanded': {
        minHeight: 12,
      },
    },
    // content: {
    //   '&$expanded': {
    //     margin: '12px 0',
    //   },
    // },
    expanded: {
        minHeight: 12,
      '&$expanded': {
        minHeight: 12,
      },
    },
  })(MuiExpansionPanelSummary);

  const yesterday = moment().subtract(1, "day");

class WalletProductFilter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            filterParent:[{label: 'TYPE' , value: 'type', id: 1, childrenFilter: [{label: 'Desert', value: 'desert', selected: true, id: 1}, 
            {label: 'Sake', value: 'sake', selected: false, id: 2}, {label: 'Rose', value: 'rose', selected: false, id: 3}]},
            {label: 'COUNTRY' , value: 'country',id: 2, childrenFilter: [{label: 'Australia', value: 'australia', selected: false, id: 1}, 
            {label: 'USA', value: 'usa', selected: false, id: 2}, {label: 'India', value: 'india', selected: false, id: 3}]}, 
            {label: 'SIZE' , value: 'size', id: 3, childrenFilter: [{label: '375ml', value: '375ml', selected: false, id: 1}, 
            {label: '750ml', value: '750ml', selected: false, id: 2}, {label: '1.5Litre', value: '1.5L', selected: false, id: 3}]}],
            // parentFilters: [],
            // selectedFilters: {},
            // filterBody: [],
            selectedOption: {},
            dateValue: null,
        };
        // updateParentFilter = updateParentFilter.bind(this);
    }

    // updateSelectedFilter = ({ parentLabel, childLabel, childId }) => {
        
    //     console.log('selected', this.state);
    //     if (_isEmpty(this.state.selectedFilters)) {
    //         const catLabel = 'type';
    //         const selectedCategory = this.props.match.params.categoryId;
            
    //         console.log('updated filter', parentLabel, childId, selectedCategory);
    //         const response = ((parentLabel && parentLabel.toLowerCase() === catLabel) && (childId === selectedCategory)) ? true : false;
    //         // const response = true;
    //         console.log(response);
    //         return response;
    //     } else {
    //         // const categoryName = this.props.match.params.categoryName;
    //         console.log(this.state.selectedFilters);
    //         const filterString = `${parentLabel && parentLabel.toLowerCase()}__${childId}`;
    //         console.log('filter string', filterString, _get(this.state, `selectedFilters.${filterString}`, ''));
    //         const response = _get(this.state, `selectedFilters.${filterString}`, false);
    //         console.log(response);
    //         return response; 
    //     }


    // }
    
    // catLabel = 'type';
    // makeFilter = ({ data }) => {
    //     let filterData = [];
    //     // const catLabel = 'type';
    //     // const selectedCategory = this.props.match.params.categoryId;
    //     _forEach(data, (value, key) => {
    //         // if ((key !== 'price') && (key !== 'type')) {
    //             const childOptions = _get(value, 'options') || _get(value, 'optoions');
    //             let parentFilter = cleanEntityData({
    //                 label: key.toUpperCase(),
    //                 value: _get(value, 'id'),
    //                 id:_get(value, 'id'),
    //                 parameter: key === 'size' ? 'size' : key === 'price' ? 'price' : key === 'type' ? 'catid' : key === 'country' ? 'country' : null,
                    
    //                 childrenFilter: _map(childOptions, c => {
    //                     return {
    //                         label: _get(c, 'label'),
    //                         value: _get(c, 'value'),
    //                         id: _get(c, 'value'), 
    //                         selected: this.updateSelectedFilter({ parentLabel: key, childLabel: _get(c, 'label'), childId: _get(c, 'value') }) 
    //                         // selected: ((key === catLabel) && (_get(c, 'value') === selectedCategory)) ? true : false
    //                     }
    //                 })
    //             });
    //             console.log('parent filter', parentFilter); 
    //             filterData.push(parentFilter);

                
    //         // }
    //     });
    //     return filterData;
        
    // }

    componentDidMount() {
        window.scrollTo(0, 0);

        
        
        // let availableFilters = !_isEmpty(this.props.productListingData.filters) ? this.makeFilter({ data: this.props.productListingData.filters }): [];
        // // console.log('available', availableFilters, this.props.productListingData);
        // const selectedcatName = this.props.match.params.categoryType;
        // const selectedcatId = this.props.match.params.categoryId;
        // // const catName = this.props.match.params.categoryName;
        // const selectedParent = _find(availableFilters, [ 'label', this.catLabel.toUpperCase()]);
        // console.log(this.state.selectedFilters);
        // _set(this.state.selectedFilters, `type__${selectedcatId}`, true);

        // console.log('changes in sele');
        // this.setState({
        //     parentFilters: availableFilters,
        //     selectedFilters: this.state.selectedFilters,
        //     filterBody: [{ parameter: _get(selectedParent, 'parameter'), value: this.props.match.params.categoryId }]
        // });
    }

    getOrderSettingData = () => {
        // let reqData = {api_token: localStorage.getItem("Token")};
        // genericPostData({
        //     dispatch: this.props.dispatch,
        //     reqObj: reqData,
        //     url: `api/account/myorders`,
        //     constants: {
        //         init: "GET_ORDER_SETTING_DATA_INIT",
        //         success: "GET_ORDER_SETTING_DATA_SUCCESS",
        //         error: "GET_ORDER_SETTING_DATA_ERROR"
        //     },
        //     identifier: "GET_ORDER_SETTING_DATA",
        //     successCb: this.orderSettingDataSuccess,
        //     errorCb: this.orderSettingDataFailure,
        //     dontShowMessage:true
        // });
    }

    orderSettingDataSuccess = (apiData) => {
        // if(apiData.code === 1) {
        //     this.setState({
        //         orderData: apiData.data
        //     })
        // }
    }

    orderSettingDataFailure = () => {

    }

    // handleChange = ({ parentIndex, childIndex, child, categoryName }) => {
        
    //     const childSelectedFlag = child.selected;
        
    //     _set(this.state.parentFilters,`${parentIndex}.childrenFilter.${childIndex}.selected`, !child.selected);
        
        

    //     // updating the selected filters
    //     const selectedParents = _get(this.state.parentFilters, `${parentIndex}`, {});
    //     const selectedChild = _get(selectedParents, `childrenFilter.${childIndex}`, {});
    //     const newSelectedFilters = this.state.selectedFilters;
    //     _set(newSelectedFilters, `${_get(selectedParents, 'label') && _get(selectedParents, 'label').toLowerCase()}__${_get(selectedChild, 'id')}`, !childSelectedFlag);

    //     const selectedFilterBodyIndex = _findIndex(this.state.filterBody, {'parameter': _get(selectedParents, 'parameter'), 'value': _get(selectedChild, 'value')});
    //     const payload = cleanEntityData({
    //         parameter: _get(selectedParents, 'parameter'),
    //         value: _get(selectedChild, 'value')
    //     });

    //     let filterBodyUpdated = this.state.filterBody;
    //     if (selectedFilterBodyIndex === -1 ) {
            
    //         filterBodyUpdated.push(payload);
    //     } else {
            
    //         filterBodyUpdated.splice(selectedFilterBodyIndex, 1);
    //     }

    //     // updating states
    //     this.setState({
    //         parentFilters: this.state.parentFilters,
    //         selectedFilters: newSelectedFilters,
    //         filterBody: filterBodyUpdated,

    //     });

    //     console.log('selected filters', newSelectedFilters);

    //     // creating body for filter api
    //     const filterAPIBody = _reduce(filterBodyUpdated, (acc, val) => {

    //         acc[`${_get(val, 'parameter')}`] = _get(val, 'value');
    //         return acc;
    //     }, {});

    //     this.props.handleFilterChange({data: filterAPIBody});

        
    // }

    valid(current) {
   
        return current.isAfter(yesterday);
      }
    handleDateChange = (event) => {
        console.log('date value', event.target.value);
    }

    handleTimeChange = (event) => {
        console.log('time value', event.target.value);
    }

    render() {
        let renderChildrenFilter= ({parentIndex, children }) => children && children.map((child,childIndex)=> {
            // console.log(children, child, 'checking');
            return(<React.Fragment  key={childIndex}>
                        {/* <FormControlLabel
                            control={
                            <Checkbox
                                checked={child.selected}
                                onChange={() => this.props.handleChange({parentIndex, childIndex, child, categoryName: this.props.match.params.categoryName })}
                                color="primary"
                            />
                            }
                            label={child.label}
                        /> <br/> */}


                        {/* <FormControl component="fieldset"> */}
                            {/* <FormLabel component="legend">Gender</FormLabel> */}
                            {/* <RadioGroup aria-label="supplier filter" name="supplier" value={child.selected} onChange={() => this.props.handleChange({parentIndex, childIndex, child, categoryName: this.props.match.params.categoryName })}> */}
                                <FormControlLabel value={child.value} control={<Radio />} label={child.label} />
                                {/* <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                                <FormControlLabel value="disabled" disabled control={<Radio />} label="(Disabled option)" /> */}
                            {/* </RadioGroup> */}
                            {/* </FormControl> */}
            </React.Fragment>)
        })

        let renderParentFilters = _get(this.props,'parentFilters',[]).map((parent, parentIndex)=> {
            // console.log('checking', this.props.selectedRadioFilter);
            return (<React.Fragment key={parentIndex}> 
                    <div style={{ marginTop: 10}}>
                        <ExpansionPanel 
                            expanded={_get(this.props.expandedFilterPanel, _get(parent, 'label'), false)}
                            onChange={this.props.openedFilterPanel(_get(parent, 'label'))}
                            >
                            <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}                            
                            aria-controls="panel1a-content" id="panel1a-header">
                            <div className="d-flex flex-wrap title">
                                            {parent.label}
                            </div>
                            </ExpansionPanelSummary>
                            <Divider/>
                            <ExpansionPanelDetails>
                                <div className = "d-flex no-gutters w-100">
                                    <div className="col-md-12">                                      
                                        <div>
                                            <FormControl component="fieldset">
                                                <RadioGroup aria-label="supplier filter" name="supplier" value={this.props.selectedRadioFilter} onChange={this.props.handleChange}>
                                                
                                                {renderChildrenFilter({parentIndex: parentIndex, children: parent.childrenFilter })}
                                                </RadioGroup>
                                            </FormControl>
                                        </div>
                                    </div>
                                </div>
                                
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </div>
            </React.Fragment> )
        });

        const timeconstraint = { hours: { min: 10, max: 16 }};
        const timeFormat = false;

        return (
            <React.Fragment>
                {/* <div className="block-title mb-5"> Filter</div>  */}

                   {/* <div className="orderSummary">{this.props.parentFilters && renderParentFilters}</div>  */}
                   <Select
                        isSearchable={true}
                        isMulti ={false}
                        isDisabled ={false}
                        valueKey="value"
                        name="retailer"
                        placeholder={'Select retailer'}
                        value={this.props.selectedFilterOption}
                        options={this.props.filterOptions}
                        onChange={this.props.handleChange}
                        // onBlur={() => onBlur(value)}
                        // onFocus={onFocus}
                        styles={colourStyles}
                    />
                    <div style={{ marginTop: 10, width: '100%'}}>
                        <TextField
                                id="datetime-local"
                                label="Select Date"
                                type="date"
                                inputProps={{ disabled: false }} 
                                // {...custom} 
                                // defaultValue={date.now()}
                                isValidDate={this.valid}
                                timeConstraints={ timeconstraint}
                                // value={this.state.dateValue} 
                                // {...input}
                                timeFormat={timeFormat}
                                dateFormat={true}
                                closeOnSelect="true"
                                // {...rest}
                                // sx={{ width: '550px' }}
                                style = {{ width: '100%'}}
                                InputLabelProps={{
                                shrink: true,
                                }}
                                onChange={this.handleDateChange}
                            />
                    </div>
                    
                    <div style={{ marginTop: 10, width: '100%'}}>
                        <TextField
                            id="datetime-local"
                            label="Select Time"
                            type="time"
                            inputProps={{  disabled: false }} 
                            // {...custom} 
                            isValidDate={this.valid}
                            defaultValue="07:30"
                            timeConstraints={ timeconstraint}
                            // value={input.value} 
                            // {...input}
                            timeFormat={true}
                            dateFormat={true}
                            closeOnSelect="true"
                            // {...rest}
                            // sx={{ width: '550px' }}
                            style = {{ width: '100%'}}
                            InputLabelProps={{
                            shrink: true,
                            }}
                            onChange={this.handleTimeChange}
                        />
                    </div>


                    
            </React.Fragment>
          );
     }
}

const mapStateToProps = (state) => {
    // let isLoading = _get(state, 'orderSettings.isFetching')
    let productListingData = _get(state,'productList.lookUpData', {});
    return {productListingData}
    
};

export default connect(mapStateToProps)(WalletProductFilter);