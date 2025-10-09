import React, { Component } from 'react';
import { Checkbox, FormControlLabel, TextField } from '@material-ui/core';
import { Button, Form, FormGroup, Label, Input, FormText, Col } from 'reactstrap';
import { connect } from 'react-redux'
import {commonActionCreater} from "../../Redux/Actions/commonAction";
import _get from "lodash/get";
class GiftCard extends Component {
    constructor(props) {
        super(props)

        this.state = {
            message: "",
            checked: false
        }
    }

    handleCheckBoxChange = (e) => {
        this.setState({ checked: e.target.checked });
        this.props.handleGift();
        if(!e.target.checked){
            this.props.dispatch(commonActionCreater("","GIFT_MESSAGE"));
        }
    }
    handleMessageChange = (e) => {
        this.setState({ message: e.target.value });
        let cartFlow = this.props.cartFlow
        this.props.dispatch(commonActionCreater(e.target.value,"GIFT_MESSAGE"));
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        if(this.props.giftMessage){
            this.setState({checked:true})
        }
    }
    render() {
        return (
            <div className="d-flex no-gutters">
                <Form className="w-100" >
                    {/* <FormControlLabel
                        label="IS THIS A GIFT?"
                        control={
                            <Checkbox
                                value={this.state.checked}
                                checked={this.state.checked}
                                onChange={this.handleCheckBoxChange}
                                color="primary"
                                style={{fontSize:24,}}
                            />
                        }
                    /> */}
                    {/* {this.state.checked && <Input
                        style={{minHeight:"40px", background: '#7f7f7f'}}
                        onChange={this.handleMessageChange}
                        
                        value={this.props.giftMessage}
                        id="message"
                        type="email" 
                        name="email"
                        placeholder="Write Your Message Here"
                        className="col" />
                    } */}
                    <Input
                        style={{minHeight:"40px", background: '#7f7f7f'}}
                        onChange={this.handleMessageChange}
                        
                        value={this.props.giftMessage}
                        id="message"
                        type="email" 
                        name="email"
                        placeholder="Gift Message"
                        className="col" />
                </Form>
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
giftMessage: _get(state,"giftMessage.lookUpData","")
})



export default connect(mapStateToProps)(GiftCard)