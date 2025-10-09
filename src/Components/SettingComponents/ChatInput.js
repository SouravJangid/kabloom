import React, { Component } from 'react'
import {TextInputField} from '../../Global/FormCompoents/wrapperComponent';
import { Button } from '@material-ui/core';
import { Form, Field } from 'react-final-form';

class ChatInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            message: '',
        }
    }

    onSubmitMessage = async values =>  {
        this.props.onSubmitMessage(values.message);

    }

  render() {
    return (
      <Form  onSubmit= {this.onSubmitMessage}
      render={({ handleSubmit, form }) => (
          <div className="row">
              <form className="" style={{flex:3, maxHeight:350, width:'75%'}}
                onSubmit={event => {
                    handleSubmit(event).then(() => {form.reset();});
                  }}
                  >
                      <div className="col-md-9" >
                      <Field name="message" component={TextInputField} placeholder='Enter message...'
                        autoFocus={false} type='text' />
                      </div>
                
                      <div className="col-md-3" >
                <Button  variant="contained" color="primary" type="submit">SEND</Button>
                </div>
            </form>
          </div>
            )}
            />
    )
  }
}

export default ChatInput