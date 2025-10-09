
import React from 'react';
import { connect } from 'react-redux';

import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import withStyles from '@material-ui/core/styles/withStyles';

const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%'
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }));

class FAQ extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
      }

    render() {
        const { classes } = this.props;
        return (
            <React.Fragment>
                <div style={{ marginTop: 20, marginBottom: 50}}>
                    <div style={{ marginLeft: 50 }}>
                        <span style={{ fontWeight: "bold" }}> Shipping: </span>
                    </div>
                    <div className={classes.root} style={{ marginTop: 10, marginLeft: 50, marginRight: 50}}>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="shipping1a-content"
                            id="shipping1a-header"
                            >
                            <Typography className={classes.heading}>1. Do you ship internationally?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            At this time we do not ship internationally, delivery is only available in the United States and India. For flower deliveries in India please visithttp://kabloom.in
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="shipping1b-content"
                            id="shipping1b-header"
                            >
                            <Typography className={classes.heading}>2. Does someone have to be there to accept the flowers?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            No. We use UPS, Federal Express and the agent will leave the flowers on the doorstep if the recipient is not home at the time of delivery.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="shipping1e-content"
                            id="shipping1e-header"
                            >
                            <Typography className={classes.heading}>3. Do you offer same day delivery?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            Yes, we offer same-day delivery in select zip codes. If your zip code qualifies, you will be able to choose same-day as your delivery date.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="shipping1f-content"
                            id="shipping1f-header"
                            >
                            <Typography className={classes.heading}>4. Shipping and Delivery?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            KaBloom, in conjunction with Federal Express or UPS, will attempt to deliver a product on the requested day. Federal Express or UPS does not call via telephone prior to delivering packages, and we cannot guarantee the time of delivery.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="shipping1c-content"
                            id="shipping1c-header"
                            >
                            <Typography className={classes.heading}>5. Major Floral Holidays</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            KaBloom is not responsible for delays in delivery of packages due to incorrect information such as a wrong address or wrong zip code. KaBloom will accommodate any changes on recipient addresses within 72 hours of ship date, excluding all major floral holidays (Mother's Day, Valentine's Day, Easter, Thanksgiving, Christmas, etc.) when a 7 day notice of change is required.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="shipping1d-content"
                            id="shipping1d-header"
                            >
                            <Typography className={classes.heading}>6. KaBloom is not responsible for:</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                <ul>
                                    <li>Flowers, plants or other items delivered to incorrect addresses supplied by the sender.</li>
                                    <li>Unsuccessful deliveries arising from the recipient not being present at time of delivery at the address supplied by the customer.</li>
                                    <li>Decreased flower and plant quality due to an incorrect delivery address supplied by the sender, or a Federal Express or UPS re-route requested by the sender.</li>
                                    <li>Flower and plant quality problems where delivery is delayed due to sender requiring signature upon delivery.</li>
                                </ul>
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        
                    </div>
                    <div style={{ marginLeft: 50, marginTop: 20 }}>
                        <span style={{ fontWeight: "bold" }}> Flowers: </span>
                    </div>
                    <div className={classes.root} style={{ marginTop: 10, marginLeft: 50, marginRight: 50}}>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="flower1a-content"
                            id="flower1a-header"
                            >
                            <Typography className={classes.heading}>1. How should I care for my flowers?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                <ul>
                                    <li>step 1: Cut the fastener band that is securing your bouquet into the box -this can be done with any pair of household scissors.</li>
                                    <li>step 2: Fill a vase 3/4 full with fresh warm water. Add the provided KaBloom Flower Food.</li>
                                    <li>step 3: Remove the protective floral tissue.</li>
                                    <li>step 4: If necessary, remove the outside protective petals (no more than 1 or 2). These petals were intentionally left on to protect your flowers during shipment.</li>
                                    <li>step 5: Remove all of the foliage and leaves that falls below the water line. Cut the bottom of the stems at least one inch under warm running water with a shears, scissors, or sharp knife. Place the flowers in the vase, fluff out your bouquet and enjoy!</li>
                                </ul>
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="flower1b-content"
                            id="flower1b-header"
                            >
                            <Typography className={classes.heading}>2. Additional Care Tips:</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                                <p>
                                    When your flowers arrive, they will be thirsty and need to drink water. Please bear in mind that it may take 8-12 hours for your flowers to perk up once submerged in water. <br></br>
                                    

                                    

                                    
                                </p>
                                <p>After 2 - 3 days, replace the water in your vase. Refresh the water with the second packet of the KaBloom Flower Food, and re-cut the stems. <br></br></p>
                                <p> Often after a few days, the water in the vase will start to turn cloudy and/or yellow. This is a natural sign that bacteria are growing in the water. Bacteria can clog stems and shorten the vase life of flowers, so keep the water clear at all times to ensure the longevity of your blooms. If your water starts to turn cloudy, immediately empty the vase and add fresh water, preferably mixed with the KaBloom flower food provided. <br></br></p>
                                <p>No matter what type of arrangement you have, it is important to keep your flowers off of televisions, appliances and heating/cooling units. You should also keep them away from hot or cold drafts and out of direct sunlight.</p>
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="flower1e-content"
                            id="flower1e-header"
                            >
                            <Typography className={classes.heading}>3. My flowers haven’t opened up yet, what should I do?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            We ship our flowers in bud form for optimal vase life; blooms will naturally open a few days after cutting them and putting them in water. If you want your flowers to open faster you can trim them and put them in hot water to speed up the blooming process.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="flower1f-content"
                            id="flower1f-header"
                            >
                            <Typography className={classes.heading}>4. What is your Quality Guarantee?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            We take pride in the quality of the products we ship and the service we provide. If, for any reason, you are not satisfied with the quality and freshness of your flowers, please call us at 1-800-KABLOOM or email us at customerservice@kabloomcorp.com .
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="flower1d-content"
                            id="flower1d-header"
                            >
                            <Typography className={classes.heading}>5. Do the vase and flowers come in the same box?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            Yes, if you order a vase it will come in the same box as your flowers.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="flower1g-content"
                            id="flower1g-header"
                            >
                            <Typography className={classes.heading}>6. Do flower care instructions come with the flowers?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            Yes, we include a flower care card and flower food with every order.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        
                    </div>
                    <div style={{ marginLeft: 50, marginTop: 20 }}>
                        <span style={{ fontWeight: "bold" }}> Ordering: </span>
                    </div>
                    <div className={classes.root} style={{ marginTop: 10, marginLeft: 50, marginRight: 50}}>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="ordering1a-content"
                            id="ordering1a-header"
                            >
                            <Typography className={classes.heading}>1. How do I use a discount code?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            On the checkout screen, enter the code in the ‘Gift Code’ box and click ‘Apply Code’ before completing checkout.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="ordering1b-content"
                            id="ordering1b-header"
                            >
                            <Typography className={classes.heading}>2. Can I include a gift message with the flowers?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            Yes, when you checkout there is a box where you can write a message that will be included with the flowers.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="ordering1e-content"
                            id="ordering1e-header"
                            >
                            <Typography className={classes.heading}>3. Can I change an order after I’ve placed it?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            Please give us a call at 1-800-KABLOOM to make any changes to an order. Please call before 3:00pm EST on the day you placed the order as our shipments go out at 3:00pm each day.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        <Accordion>
                            <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="shipping1f-content"
                            id="shipping1f-header"
                            >
                            <Typography className={classes.heading}>4. How can I track my order?</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                            <Typography>
                            After placing your order you will receive a confirmation email that will contain your order information as well as a UPS tracking number. Visit http://www.ups.com/tracking/tracking.html and enter your tracking number to track your order.
                            </Typography>
                            </AccordionDetails>
                        </Accordion>
                        
                        
                    </div>
                </div>
            </React.Fragment>
          );
     }
}

// export default FAQ;

export default (withStyles(useStyles)(FAQ));