import React from 'react';
import { Route } from 'react-router-dom';


const UnProtectedRouteWithLayout = ({ Layout, Component, ...rest }) => {
  return (
    <Route {...rest} render={props => 
      <Layout {...props} >
        <Component {...props} />
      </Layout>
    }
    />
  )
}

export default UnProtectedRouteWithLayout;