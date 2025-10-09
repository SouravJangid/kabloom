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
import {get as _get , isEmpty as _isEmpty, set as _set} from 'lodash';
import Divider from '@material-ui/core/Divider';


// import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import MuiExpansionPanel from '@material-ui/core/ExpansionPanel';
// import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
// import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import MuiExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';



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
        height: 12,
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

class ProductFilter extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            filterParent:[{label: 'Type' , value: 'type', id: 1, childrenFilter: [{label: 'Desert', value: 'desert', selected: true, id: 1}, 
            {label: 'Sake', value: 'sake', selected: false, id: 2}, {label: 'Rose', value: 'rose', selected: false, id: 3}]},
            {label: 'Country' , value: 'country',id: 2, childrenFilter: [{label: 'Australia', value: 'australia', selected: false, id: 1}, 
            {label: 'USA', value: 'usa', selected: false, id: 2}, {label: 'India', value: 'india', selected: false, id: 3}]}, 
            {label: 'Size' , value: 'size', id: 3, childrenFilter: [{label: '375ml', value: '375ml', selected: false, id: 1}, 
            {label: '750ml', value: '750ml', selected: false, id: 2}, {label: '1.5Litre', value: '1.5L', selected: false, id: 3}]}],
        }
    }
    
    componentDidMount() {
        window.scrollTo(0, 0);
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

    handleChange = ({ parentIndex, childIndex, child }) => {
        // console.log('parentIndex', parentIndex);
        // console.log('childIndex', childIndex);
        
        _set(this.state.filterParent,`${parentIndex}.childrenFilter.${childIndex}.selected`, !child.selected);
        // console.log('see', this.state.filterParent);
        this.setState({
            filterParent: this.state.filterParent
        })
        
    }

    render() {
        let renderChildrenFilter= ({parentIndex, children }) => children && children.map((child,childIndex)=> {
            return(<React.Fragment  key={childIndex}>
                        <FormControlLabel
                            control={
                            <Checkbox
                                checked={child.selected}
                                onChange={() => this.handleChange({parentIndex, childIndex, child })}
                                color="primary"
                            />
                            }
                            label={child.label}
                        /> <br/>
            </React.Fragment>)
        })

        let renderParentFilters = _get(this.state,'filterParent',[]).map((parent, parentIndex)=> {
            return (<React.Fragment key={parentIndex}> 
                        <ExpansionPanel 
                            defaultExpanded={parentIndex === 0 ? true : false}>
                            <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}                            
                            aria-controls="panel1a-content" id="panel1a-header">
                            <div className="d-flex flex-wrap title">
                                            {parent.label}
                            </div>
                            </ExpansionPanelSummary>
                            <Divider  style={{ marginTop: 10, backgroundColor: 'white' }}/>
                            <ExpansionPanelDetails>
                                <div className = "d-flex no-gutters w-100">
                                    <div className="col-md-12">                                      
                                        <div>
                                            {renderChildrenFilter({parentIndex: parentIndex, children: parent.childrenFilter })}
                                        </div>
                                    </div>
                                </div>
                                
                            </ExpansionPanelDetails>
                        </ExpansionPanel>
            </React.Fragment> )
        });

        return (
            <React.Fragment>
                {/* <div className="block-title mb-5"> Filter</div>  */}

                   <div className="orderSummary">{this.state.filterParent && renderParentFilters}</div> 
            </React.Fragment>
          );
     }
}

const mapStateToProps = (state) => {
    // let isLoading = _get(state, 'orderSettings.isFetching')
    return {}
};

export default connect(mapStateToProps)(ProductFilter);