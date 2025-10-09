import React from 'react';
// import '../../assets/stylesheets/dynamictab.css';
import '../../assets/stylesheets/dynamictabingcomponent.css';
import { useState, Suspense } from "react";


const DynamicTab = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].label);

  const activeTabData = tabs.find((tab) => tab.label === activeTab);

  return (
    <div className="container-tab">
      {/* Tab Headers */}
      <div className="tabs tab-header-container">
        {tabs.map((tab) => (

          <button
            key={tab.label}
            onClick={() => setActiveTab(tab.label)}
            className={`tab-button ${activeTab === tab.label ? "active" : ""}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="tab-content">
        <Suspense fallback={<div>Loading ...</div>}>
          {/* {activeTabData?.Component ? (
            <activeTabData.Component {...(activeTabData?.props || {})} />
          ) : (
            activeTabData?.content
          )} */}
          {activeTabData && activeTabData.getComponent()}
        </Suspense>



      </div>
    </div>
  );
};

export default DynamicTab;
