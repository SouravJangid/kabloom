import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import React from 'react';
import { connect } from 'react-redux';
import withStyles from '@material-ui/core/styles/withStyles';

const styles = theme => ({
    root: {
        // flexGrow: 1,
        // maxWidth: 500,
        // display: 'flex',
        // 'flex-direction': 'row',
        // 'margin-left': '60px',
        // height: 150,
        // width: 250,
        marginRight: "20px",
        marginLeft: '20px',
        marginBottom: '20px',
        flex: '0 0 auto',
        // overflow: 'visible !important'
        // 'max-width': 200,
        // 'align-items': 'center',
        // background: 'cornflowerblue',
        // // background: 'White',
        // height: '50px',
        // 'border-bottom': '1px solid white',
        // 'border-radius': '0px 0px 25px 25px',
        // opacity: 0.38
      },
    actionArea: {
        height: 150,
        width: 250,
        // 'justify-content': 'center',
        // 'align-items': 'center'
    },
    
});


class AddressCard extends React.Component {
    constructor(props){
        super(props);
      } 
    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
               <Card className={classes.root}>
                    <CardActionArea className={classes.actionArea}>
                        <CardContent >
                            <div style={{ fontWeight: "bold", marginBottom: 10 }}>
                                HOME
                            </div>
                            <div style={{ fontSize: 10, marginBottom: 10 }}>
                                PRABHANSHU STREET
                            </div>
                            <div>
                                street1, balcony nagar, chhapa mar, east us, 560037
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card> 
                <Card className={classes.root}>
                    <CardActionArea className={classes.actionArea}>
                        <CardContent >
                            <div style={{ fontWeight: "bold", marginBottom: 10 }}>
                                HOME
                            </div>
                            <div style={{ fontSize: 10, marginBottom: 10 }}>
                                PRABHANSHU STREET
                            </div>
                            <div>
                                street1, balcony nagar, chhapa mar, east us, 560037
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card className={classes.root}>
                    <CardActionArea className={classes.actionArea}>
                        <CardContent >
                            <div style={{ fontWeight: "bold", marginBottom: 10 }}>
                                HOME
                            </div>
                            <div style={{ fontSize: 10, marginBottom: 10 }}>
                                PRABHANSHU STREET
                            </div>
                            <div>
                                street1, balcony nagar, chhapa mar, east us, 560037
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card className={classes.root}>
                    <CardActionArea className={classes.actionArea}>
                        <CardContent >
                            <div style={{ fontWeight: "bold", marginBottom: 10 }}>
                                HOME
                            </div>
                            <div style={{ fontSize: 10, marginBottom: 10 }}>
                                PRABHANSHU STREET
                            </div>
                            <div>
                                street1, balcony nagar, chhapa mar, east us, 560037
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card className={classes.root}>
                    <CardActionArea className={classes.actionArea}>
                        <CardContent >
                            <div style={{ fontWeight: "bold", marginBottom: 10 }}>
                                HOME
                            </div>
                            <div style={{ fontSize: 10, marginBottom: 10 }}>
                                PRABHANSHU STREET
                            </div>
                            <div>
                                street1, balcony nagar, chhapa mar, east us, 560037
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card className={classes.root}>
                    <CardActionArea className={classes.actionArea}>
                        <CardContent >
                            <div style={{ fontWeight: "bold", marginBottom: 10 }}>
                                HOME
                            </div>
                            <div style={{ fontSize: 10, marginBottom: 10 }}>
                                PRABHANSHU STREET
                            </div>
                            <div>
                                street1, balcony nagar, chhapa mar, east us, 560037
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
                <Card className={classes.root}>
                    <CardActionArea className={classes.actionArea}>
                        <CardContent >
                            <div style={{ fontWeight: "bold", marginBottom: 10 }}>
                                HOME
                            </div>
                            <div style={{ fontSize: 10, marginBottom: 10 }}>
                                PRABHANSHU STREET
                            </div>
                            <div>
                                street1, balcony nagar, chhapa mar, east us, 560037
                            </div>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </React.Fragment>
          );
     }
}

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps)(withStyles(styles)(AddressCard));