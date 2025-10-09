import React, { Suspense } from 'react';
import '../../assets/stylesheets/dynamictab.css';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { Switch, Route, Redirect } from 'react-router-dom';

const DynamicTabbingComponent = ({ tabs }) => {
  const history = useHistory();
  const location = useLocation();
  const { vendorId, zipcode } = useParams(); // e.g., /vendor/:vendorId/:tab/:zipcode

  const pathSegments = location.pathname.split('/');
  const currentTabRoute = pathSegments[3]; // assuming: /vendor/:vendorId/:tab/:zipcode
  const fallbackZipcode = zipcode || '-60642';

  // Find the tab that matches the route param or fallback to first tab
  const matchedTab = tabs.find((tab) => tab.route === currentTabRoute) || tabs[0];

  const handleTabClick = (tab) => {
    history.push(`/vendor/${vendorId}/${tab.route}/${fallbackZipcode}`);
  };

  return (
    <div className="container-tab">
      {/* Tab Buttons */}
      <div className="tabs tab-header-container">
        {tabs.map((tab) => (
          <button
            key={tab.label}
            onClick={() => handleTabClick(tab)}
            className={`tab-button ${
              tab.route === matchedTab.route
                ? "border-blue-500 text-blue-500"
                : "border-transparent text-gray-500 hover:text-blue-500"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Rendering */}
      <div className="tab-content">
        <Suspense fallback={<div>Loading ...</div>}>
          <Switch>
            {tabs.map(({ route, Component, props }) => (
              <Route
                key={route}
                path={`/vendor/:vendorId/${route}/:zipcode`}
                render={(routeProps) => <Component {...(props || {})} {...routeProps} />}
              />
            ))}

            {/* Default fallback redirect for unmatched routes */}
            <Redirect to={`/vendor/${vendorId}/${tabs[0].route}/${fallbackZipcode}`} />
          </Switch>
        </Suspense>
      </div>
    </div>
  );
};

export default DynamicTabbingComponent;
