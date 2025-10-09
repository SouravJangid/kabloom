
import React from 'react';
import { connect } from 'react-redux';
import ChatInput from './ChatInput';
import ChatMessage from './ChatMessage';

class LivechatSetting extends React.Component {
    constructor(props){
        super(props);
        this.state = {
          name: '',
          messages: [
            {name: 'PartyCan', message: 'Welcome, to PartyCan Live Chat', isServer: 'Yes'},
            {name: 'PartyCan', message: 'How Can I help you today?', isServer: 'Yes'}],
        }
      }
    
    addMessage = message => this.setState(state => ({ messages: [...state.messages, message] }));

    submitMessage = messageString => {
      // on submitting the ChatInput form, send the message, add it to the list and reset the input
      const message = { name: this.state.name, message: messageString , isServer: 'No'}
      // this.ws.send(JSON.stringify(message))
      this.addMessage(message)
    }

    render() {
        
        return (
            <React.Fragment>
              <div className="row">
                  <div className="col-md-6">
                  <h5 style={{marginLeft: '21px', marginTop: '13px'}}>LIVE CHAT</h5>

                    {this.state.messages.map((message, index) =>
                        <ChatMessage
                          key={index}
                          message={message.message}
                          name={message.name}
                          isServer={message.isServer}
                        />,
                      )}

                    <div style={{ height: '40px', position: 'fixed', bottom: '16%', width: '50%'}}>
                      <ChatInput
                        // ws={this.ws}
                        onSubmitMessage={messageString => this.submitMessage(messageString)}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div>
                      <span>If you have questions or concerns, please us send us a chat or email us at </span>
                      <span style={{color: '#00BFB2', fontSize: '1.5rem'}}>INFO@DRINKPARTYCAN.COM</span>
                    </div>
                    <div>
                      <span>If you're a retailer or wholesaler intersted in working with us, please contact</span>
                      <span style={{color: '#00BFB2', fontSize: '1.5rem'}}>SALES@DRINKPARTYCAN.COM</span>
                    </div>
                    <div>
                      <span>MEDIA inquiries:</span>
                      <span style={{color: '#00BFB2', fontSize: '1.5rem'}}>PRESS@DRINKPARTYCAN.COM</span>
                    </div>   
                  </div>
              </div>       
            </React.Fragment>
          );
     }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(LivechatSetting);