import React from 'react'
import { Card, CardImg, CardText, CardBody, CardTitle, CardSubtitle, Button } from 'reactstrap';
export default ({ name, message, isServer }) =>
<React.Fragment>
    <Card className={isServer === 'Yes' ? 'serverChatcard' : 'userChatcard'} style= {{marginBottom: '10px'}}>
      <CardBody className="p-3 d-flex align-items-center justify-content-center flex-column usercardadd">
        <p>
        {/* <strong  style={{color: 'darkgrey'}}>{name}</strong>  */}
         <em style={{color: isServer === 'Yes' ? 'white' :'darkgrey'}}>{message}</em>
        </p>
      </CardBody>
    </Card>
</React.Fragment>