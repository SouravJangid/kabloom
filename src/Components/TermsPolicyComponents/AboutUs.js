
import React from 'react';
import { connect } from 'react-redux';

class AboutUs extends React.Component {
    constructor(props){
        super(props);
        this.state = {
        }
      }

    render() {
        
        return (
            <React.Fragment>
              <div className="row my-5">
              <div className="col-md-12 mb-4"><h1>About Us</h1></div>
                  <div className="col-md-12" style={{ textAlign: "justify", textJustify: "inter-word"}}>
                      <div>
                        <p>
                        From our first hand-crafted bouquet in 1998, our floral designers have created beautiful arrangements to celebrate life’s memorable moments. Our passion for flowers goes beyond just the price and petal. Our goal is to enhance your lifestyle and home.
                        </p>
                      </div>
                      <div>
                        <p>
                        At KaBloom, we believe that flowers should be used to celebrate all of life's occasions. That’s why no matter what, we make sure your bouquet arrives fresh. All of our bouquets and plants are shipped fast with a 7 day freshness guarantee.  
                        </p>
                      </div>
                      <div>
                        <p>
                        Trained to make traditional or contemporary flower arrangements, our designers work hard to help you create a bouquet you’ll love. Every KaBloom bouquet is designed with genuine care.
                        </p>
                      </div>
                      <div>
                        <p>
                        Because our flowers are received directly from our farms around the world, KaBloom’s quality is unmatched; allowing you to enjoy your arrangements longer than the average wholesale blooms. We also offer a wide selection of exceptional décor and gift items to pair with your bouquets. 
                        </p>
                      </div>
                      <div>
                        <p>
                        Please select one of the links below for additional information. For further assistance, please contact us via our online Customer Inquiry Form, or call a Kabloom customer service representative at 1-800-KaBloom
                        </p>
                      </div>
                      <div className='d-flex justify-content-center' style={{marginTop: 50 }}>
                        <p>
                        KaBloom – we make buying fresh flowers a beautiful experience!
                        </p>
                      </div>
                  </div>
              </div>       
            </React.Fragment>
          );
     }
}

export default AboutUs;