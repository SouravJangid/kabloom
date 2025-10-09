import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';
import { map as _map, findIndex as _findIndex, get as _get, set as _set } from 'lodash';
import { Container, Row, Col } from 'reactstrap';
import SettingTabs from '../../Components/SettingComponents/SettingTabs';
import UserSetting from '../../Components/SettingComponents/UserSetting';
import OrderSetting from '../../Components/SettingComponents/OrderSetting';

class SettingContainer extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            tabValue: 0,
            selectedTab: ""
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        const settingParam = this.props.match.params.settingParam;
        console.log("==settingParam==", settingParam);
        this.setState({
            tabValue: settingParam === 'user' ? 0 :
                settingParam === 'order' ? 1 : settingParam === 'chat' ? 2 : null
        })
    }

    componentDidUpdate(prevProps) {
        const prevSettingParam = _get(prevProps, 'match.params.settingParam');
        console.log("==prevSettingParam==", prevSettingParam);
        const settingParam = _get(this.props, 'match.params.settingParam');
        console.log("==componentDidUpdate=settingParam=", settingParam);
        if (settingParam !== prevSettingParam) {
            this.setState({
                tabValue: settingParam === 'user' ? 0 :
                    settingParam === 'order' ? 1 : settingParam === 'chat' ? 2 : null
            });
        }
    }

    handleTabChange = (index, selectedTab) => {
        this.setState({ selectedTab: selectedTab, tabValue: index });
        this.props.history.push(`/setting/${this.findTabRoute(index)}`);
    };

    findTabRoute = (tabValue) => {
        return tabValue === 0 ? 'user' : tabValue === 1 ? 'order' : tabValue === 2 ? 'chat' : null
    }

    handleWalletRedeem = ({ customer_id, state, category }) => {
        this.props.history.push('/wallet/shipping', { customer_id, selectedState: state, selectedCategory: category });
    }

    viewAddresses = () => {
        this.props.history.push('/profile/addresses');
    }

    renderContent = (addresses) => {
        let commonContent = <>
            <div className="scrollerwrapper no-gutters" >
                {this.state.tabValue === 0 &&
                    <Col xs={12} lg={10} ><UserSetting tabValue={this.state.tabValue} viewAddresses={this.viewAddresses} history={this.props.history} /></Col>
                }
                {this.state.tabValue === 1 &&
                    <Col xs={12} lg={10} ><OrderSetting tabValue={this.state.tabValue} handleWalletRedeem={this.handleWalletRedeem} /></Col>

                }
            </div>
        </>
        return <div>{commonContent}</div>
    }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <CssBaseline />
                <SettingTabs
                    tabValue={this.state.tabValue}
                    handleTabChange={(index, selectedTab) => this.handleTabChange(index, selectedTab)}
                />
                <div className="page-content-container">
                    <Container fluid={true} >
                        <Row className="no-gutters justify-content-lg-between secMinHeight">
                            <Col xs={12} className="p-xl-5 p-md-4 py-4" >
                                {this.renderContent()}
                            </Col>
                        </Row >
                    </Container>
                </div>
            </React.Fragment>

        );
    }
}

function mapStateToProps(state) {
    let userName = _get(state, "userSignInInfo.lookUpData[0].result.cust_name", '');
    return { userName }
}
export default connect(mapStateToProps)(SettingContainer);