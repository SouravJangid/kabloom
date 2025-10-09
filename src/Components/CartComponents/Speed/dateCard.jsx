import React, {Component} from 'react';
import { Card,  CardBody, Button } from 'reactstrap';


const styles = (props) => ({
   
});


class DateCard extends Component {
  constructor(props){
    super(props);
  } 
    _getRootCardClass = ({ selectedId, id }) => {
        if (id === selectedId) {
            return "cardStyles dateTimerCards active";
        }
      else {
        return "cardStyles dateTimerCards";
      }
        
    };
    render() {
        return (
            <React.Fragment>              
                    <Card className="dateTimerCardscontainer" onClick={() => this.props.changeShippingMethodOpacity(this.props.data.id)}  >
                        <CardBody className={this._getRootCardClass({ selectedId: this.props.selectedShippingMethod, id: this.props.data.id })}>
                            <div style={{ fontSize: 15 }}>
                                {this.props.date}
                            </div>                           
                        </CardBody>
                    </Card>
            </React.Fragment>
        
        );
    }
}

export default DateCard;