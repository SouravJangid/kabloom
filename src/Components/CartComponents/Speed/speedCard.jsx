import React, {Component} from 'react';
import { Card,  CardBody, Button } from 'reactstrap';
import { mergeClasses } from '@material-ui/styles';
import withStyles from '@material-ui/core/styles/withStyles';
import LocalShippingOutlinedIcon from '@material-ui/icons/LocalShippingOutlined';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';

const styles = theme => ({  

});

class SpeedCard extends Component {
  constructor(props){
    super(props);
  } 
  _getRootCardClass = ({ selectedId, id, enablePointer }) => {
      if (id === selectedId) {
          return "cardStyles speedCards active";
      } else if (enablePointer) {
        return "cardStyles speedCards";
      } else {
        return "cardStyles speedCards disable";
      }
      
  };
    render() {
        const {classes} = this.props;
        return (
            <React.Fragment>                
                    <Card className="speedCardscontainer" >
                        <CardBody className={this._getRootCardClass({ selectedId: this.props.selectedTransportAddress, id: this.props.data.id, enablePointer: this.props.data.enablePointer})} onClick={() => this.props.changeOpactiy(this.props.data.id)} >
                        <div className="mb-4"><LocalShippingOutlinedIcon style={{ fontSize: 25 }} /> </div> 
                            <div className="cardTitle">
                                {this.props.data.description}
                            </div>
                            {/*<div className="inner-content">
                                {this.props.data.duration}
                            </div>*/}
                            {/* <div>
                                {this.props.data.address}
                            </div> */}
                             <div className="mt-4"><CheckCircleIcon style={{ fontSize: 25 }} /> </div>
                        </CardBody>
                    </Card>
            </React.Fragment>
        
        );
    }
}

export default (withStyles(styles)(SpeedCard));
