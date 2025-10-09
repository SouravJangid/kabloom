import React from 'react';


import { connect } from 'react-redux';


const styles = () => {

};
class VendorDetailContainer extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            storeData: {},
            noProduct : false
        }
    }

    componentDidMount() {
        
    }
    
    
    render() {
        return (
            <div>
                Its working
            </div>
        )
    };
};

// function mapStateToProps(state) {
//     // let isLoading = _get(state, 'landingStoreInfo.isFetching')
//     // return { isLoading }
// }

export default VendorDetailContainer;
