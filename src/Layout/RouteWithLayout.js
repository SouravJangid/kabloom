import React from 'react';
import { Route } from 'react-router-dom';
import { Redirect } from 'react-router';

const RouteWithLayout = ({ Layout, Component, ...rest }) => {
  // const ageGateVerified = localStorage.getItem("ageGateVerified");
  return (
    <Route {...rest} render={props=>
      // ageGateVerified ? 
      <Layout {...props} >
        <Component {...props} />
      </Layout>
      // : <Redirect to={{pathname: '/', state: {from: props.location}}} />
    }
    />
  )
}

export default RouteWithLayout;