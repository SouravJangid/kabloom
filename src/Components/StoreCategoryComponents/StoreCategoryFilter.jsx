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


// accrodian imports



// import { withStyles } from '@material-ui/core/styles';
import MuiAccordion from '@material-ui/core/Accordion';
import MuiAccordionSummary from '@material-ui/core/AccordionSummary';
import MuiAccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { IconButton } from '@material-ui/core';

// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import AddBoxOutlinedIcon from '@material-ui/icons/AddBoxOutlined';
import IndeterminateCheckBoxOutlinedIcon from '@material-ui/icons/IndeterminateCheckBoxOutlined';
import { NoEncryption } from '@material-ui/icons';
// import FormControlLabel from '@material-ui/core/FormControlLabel';



// export function updateParentFilter(data) {
//     let availableFilters = !_isEmpty(data.filters) ? this.makeFilter({ data: data.filters}): [];
//         this.setState({
//             parentFilters: availableFilters
//         });
// }


const useStyles = makeStyles({
    root: {
      boxShadow: 'none',
      border: 'none',
      '&:before': {
        display: 'none',
      },
    },
  });



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


  

  const Accordion = withStyles({
    root: {
    //   border: '1px solid rgba(0, 0, 0, .125)',
        border: 'none',
      boxShadow: 'none',
      '&:not(:last-child)': {
        borderBottom: 0,
      },
      '&:before': {
        display: 'none',
      },
      '&$expanded': {
        margin: 'auto',
      },
    },
    expanded: {},
  })(MuiAccordion);
  
  const AccordionSummary = withStyles({
    root: {
    //   backgroundColor: 'rgba(0, 0, 0, .03)',
    //   borderBottom: '1px solid rgba(0, 0, 0, .125)',
      marginBottom: -1,
    //   fontSize: '10px',
        padding: '0px 8px',
      minHeight: 20,
      '&$expanded': {
        minHeight: 56,
      },
    },
    content: {
      '&$expanded': {
        margin: '12px 0',
      },
    },
    expanded: {},
  })(MuiAccordionSummary);
  
  const AccordionDetails = withStyles((theme) => ({
    root: {
    //   padding: theme.spacing(2),
    padding: '0px 16px 0px'
    },
  }))(MuiAccordionDetails);

class ProductFilter extends React.Component {
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
            expanded: {},
            childOpenedState: {}
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
    //                 value: _get(value, 'id'),ProductFilter
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


    handleChange = (panel) => (event, newExpanded) => {
        // setExpanded(newExpanded ? panel : false);
        // console.log('here', panel, newExpanded);
        this.setState({ expanded: newExpanded ? panel : false});
      };

    // handleExpand = ({ parentIndex, children, parent_label, child, childIndex }) => {

    // }
    // classes = useStyles();

    renderchildFilter = ({}) => {

    }

    handleExpand = (event, panel) => {
        // console.log(panel, 'handle expand event');
        // event.stopPropagation();
        const initialState = {
            ...this.state.expanded
        }
        initialState[`${panel}`] = _get(initialState, `${panel}`, false) ? false : true ;
        // console.log(initialState, 'initial state after update');
        this.setState({ expanded: {}}, () => {
            this.setState({ expanded: initialState })
        });
    }
    render() {
        let renderChildrenFilter= ({parentIndex, children, parent_label }) => children && children.map((child,childIndex)=> {
            
            // console.log(parentIndex, 'check parent index', parent_label, child, childIndex);
            const child_label = _get(child, 'label');
            const child_value = _get(child, 'value');
            const concatenated_child_label_value = `${_get(child, 'label')}_${_get(child, 'value')}`;
            // console.log(this.state.expanded, 'panel', child_label);
            // console.log(child_label, 'here123');
            // if (parent_label.toLowerCase() == 'type' && _get(child, 'child', []).length != 0 ) {
            if ( _get(child, 'child', []).length != 0 ) {
                // console.log(child_label, 'here123');
                return(<React.Fragment  key={childIndex}>
                        
                        <div>
                            <Accordion 
                            square 
                            // expanded={this.state.expanded === 'panel1'} 
                            expanded={_get(this.state.expanded, concatenated_child_label_value)}
                            // onChange={this.handleChange('panel1')}
                            onChange={ (event) => event.preventDefault()}
                            >
                                    <AccordionSummary 
                                    // expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1d-content" id="panel1d-header">
                                    {/* <AddBoxOutlinedIcon 
                                            onClick={(event) => this.handleChange('panel1') }
                                            // onChange={(event) => this.handleChange('panel1')}
                                        /> */}
                                    {/* <IconButton onClick={(event) => this.handleExpand(event, child_label)} aria-label="Expand"> */}
                                        {/* {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />} */}
                                        {/* <AddBoxOutlinedIcon/>
                                    </IconButton> */}
                                    <FormControlLabel
                                        aria-label="Acknowledge"
                                        // onClick={(event) => {this.handleChange('panel1')} }
                                        onFocus={(event) => event.stopPropagation()}
                                        control={!this.state.expanded[`${concatenated_child_label_value}`] ?   <AddBoxOutlinedIcon 
                                            onClick={(event) => this.handleExpand(event, concatenated_child_label_value) } 
                                            // onChange={(event) => this.handleChange('panel1')}
                                        /> :<IndeterminateCheckBoxOutlinedIcon onClick={(event) => this.handleExpand(event, concatenated_child_label_value)}/> }
                                        // label="I acknowledge that I should stop the click event propagation"
                                    />
                                    <Typography>{child.label}</Typography>
                                    {/* <IconButton onClick={this.handleChange('panel1')}>
                                        {this.state.expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                                    </IconButton> */}
                                    </AccordionSummary>
                                    <AccordionDetails>
                                    <Typography>
                                        { renderChildrenFilter({parentIndex: parentIndex, children: child.child, parent_label: child.label }) }
                                    </Typography>
                                    </AccordionDetails>
                                </Accordion>
                                
                            </div>

                        {/* <div >
                            <FormControlLabel
                                // control={
                                // <Checkbox
                                //     checked={child.selected}
                                //     onChange={() => this.props.handleChange({parentIndex, childIndex, child, categoryName: this.props.match.params.categoryName })}
                                //     color="primary"
                                // />
                                // }
                                aria-label="Acknowledge"
                                onClick={(event) => this.handleExpand({ parentIndex, children, parent_label, child, childIndex })}
                                onFocus={(event) => event.stopPropagation()}
                                control={<AddBoxOutlinedIcon  style={{ marginLeft: 10, marginRight: 10 }}  />}
                                // control = { <Checkbox />}
                                // control = {<Checkbox
                                //     checked={child.selected}
                                //     onChange={() => this.props.handleChange({parentIndex, childIndex, child, categoryName: this.props.match.params.categoryName })}
                                //     color="primary"
                                // />}
                                label={child.label}
                                // style={{ marginLeft: '10px' }}
                            /> <br/>
                        </div> */}
                        

                        </React.Fragment>
                    )
            }
            return(<React.Fragment  key={childIndex}>
                        <FormControlLabel
                            control={
                            <Checkbox
                                checked={child.selected}
                                onChange={() => this.props.handleChange({parentIndex, childIndex, child, categoryName: this.props.match.params.categoryName })}
                                color="primary"
                            />
                            }
                            label={child.label}
                        /> <br/>
            </React.Fragment>)
        })

        let renderParentFilters = _get(this.props,'parentFilters',[]).map((parent, parentIndex)=> {
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
                                            {renderChildrenFilter({parentIndex: parentIndex, children: parent.childrenFilter, parent_label: parent.label })}
                                        </div>
                                    </div>
                                </div>
                                
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
                    </div>
            </React.Fragment> )
        });

        return (
            <React.Fragment>
                {/* <div className="block-title mb-5"> Filter</div>  */}

                   <div className="orderSummary">{this.props.parentFilters && renderParentFilters}</div> 
            </React.Fragment>
          );
     }
}

const mapStateToProps = (state) => {
    // let isLoading = _get(state, 'orderSettings.isFetching')
    let productListingData = _get(state,'productList.lookUpData', {});
    
    return {productListingData}
    
};

export default connect(mapStateToProps)(ProductFilter);