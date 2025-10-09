import React from 'react';
import HashLoader from "react-spinners/HashLoader";



const WithLoading = (WrappedComponent) => {
    return class Enhancer extends WrappedComponent {
        render() {
            if (this.props.isLoading) {
                return Loader();
            }
            return super.render();
        }

    };
};

function Loader () {
  return (
    <div className="loader-wrapper">
        <HashLoader
          size={50}
          margin={2}
          color="#dc3545"
          loading={true}
        />
      </div>
  ) 
};


// import './Loader.css'; // Import the CSS file for styling

const LoaderOverLay = () => (
  <div className="loader-overlay">
    {/* <div className="loader"></div> */}
    <HashLoader
          size={50}
          margin={2}
          color="#dc3545"
          loading={true}
        />
  </div>
);



export {
  WithLoading,
  Loader,
  LoaderOverLay
};

export default WithLoading;
