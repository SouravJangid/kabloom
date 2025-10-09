// import React from "react";
// import { withRouter } from "react-router-dom";

// class ScrollToTop extends React.Component {
//   componentDidUpdate(prevProps) {
//       console.log('check', prevProps, this.props.location.pathname);
//     if (
//       this.props.location.pathname !== prevProps.location.pathname
//     ) {
//         console.log('check1', this.props.location.pathname);
//       window.scrollTo(0, 0);
//     }
//   }

//   render() {
//     return null;
//   }
// }

// export default withRouter(ScrollToTop);


import React, { useEffect } from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link,
    useLocation,
    withRouter
} from 'react-router-dom'
function _ScrollToTop(props) {
    const { pathname } = useLocation();
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);
    // return props.children
    return null;
}
// const ScrollToTop = withRouter(_ScrollToTop)

export default withRouter(_ScrollToTop);