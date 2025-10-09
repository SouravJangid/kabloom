import ReactGA from "react-ga";
import { cleanEntityData } from "./commonUtil";
import { map as _map, get as _get } from 'lodash';


export const initGA = (trackingID) => {           
    ReactGA.initialize(trackingID); 
    ReactGA.plugin.require('ec');
 };


 export const PageView = () => {  
    ReactGA.pageview(window.location.pathname +  
                     window.location.search); 
};

/**
 * Event - Add custom tracking event.
 * @param {string} category 
 * @param {string} action 
 * @param {string} label 
 */
export const Event = (category, action, label) => {
    ReactGA.event({
      category: category,
      action: action,
      label: label
    });
  };




/**
 * Event - Add custom tracking event.
 * @param {string } porductId 
 * @param {string} name 
 * @param {string} category
 * @param {string} branc
 * @param {string} variant
 * @param {string} position
 * @param {number} price
 * @param {number} quantity
 * @param {string} coupon
 */
export const ProductClick = ({ productId, name, category, brand, variant, position, price, quantity, coupon}) => {
    const payload = cleanEntityData({
        id: productId,
        name,
        category,
        brand,
        variant,
        position,
        price,
        quantity,
        coupon
    });
    // ReactGA.plugin.require('ec');
    ReactGA.plugin.execute('ec', 'addProduct', {
        ...payload
    });
    ReactGA.plugin.execute('ec', 'setAction', 'click');
};


/**
 * Event - Add custom tracking event.
 * @param {string } porductId 
 * @param {string} name 
 * @param {string} category
 * @param {string} branc
 * @param {string} variant
 * @param {string} position
 * @param {number} price
 * @param {number} quantity
 * @param {string} coupon
 */
export const ProductView = ({ productId, name, category, brand, variant, position, price, quantity, coupon}) => {
  const payload = cleanEntityData({
      id: productId,
      name,
      category,
      brand,
      variant,
      position,
      price,
      quantity,
      coupon
  });
  // ReactGA.plugin.require('ec');
  ReactGA.plugin.execute('ec', 'addProduct', {
      ...payload
  });
  ReactGA.plugin.execute('ec', 'setAction', 'detail');
};

/**
 * Event - Add custom tracking event.
 * @param {string } porductId 
 * @param {string} name 
 * @param {string} category
 * @param {string} branc
 * @param {string} variant
 * @param {string} position
 * @param {number} price
 * @param {number} quantity
 * @param {string} coupon
 * @param {number} step
 * @param {string} option
 */
export const ProductCheckout = ({ cart,  step, option}) => {
  // ReactGA.plugin.require('ec');
  _map(cart, c => {
    const payload = cleanEntityData({
      id: _get(c, 'productId'),
      name: _get(c, 'name'),
      category: _get(c, 'category'),
      brand: _get(c, 'brand'),
      variant: _get(c, 'variant'),
      position: _get(c, 'position'),
      price: _get(c, 'price'),
      quantity: _get(c, 'quantity'),
      coupon: _get(c, 'coupon')
    });
    ReactGA.plugin.execute('ec', 'addProduct', {
      ...payload
    });

  })
  
  const checkoutPayoload = cleanEntityData({
      step,
      option,
  });
  ReactGA.plugin.execute('ec', 'setAction', 'checkout', {
    ...checkoutPayoload
  });
};

export const ProductCheckoutOptions = ({ cart,  step, option}) => {
  // ReactGA.plugin.require('ec');
  _map(cart, c => {
    const payload = cleanEntityData({
      id: _get(c, 'productId'),
      name: _get(c, 'name'),
      category: _get(c, 'category'),
      brand: _get(c, 'brand'),
      variant: _get(c, 'variant'),
      position: _get(c, 'position'),
      price: _get(c, 'price'),
      quantity: _get(c, 'quantity'),
      coupon: _get(c, 'coupon')
    });
    ReactGA.plugin.execute('ec', 'addProduct', {
      ...payload
    });

  })
  
  const checkoutPayoload = cleanEntityData({
      step,
      option,
  });
  ReactGA.plugin.execute('ec', 'setAction', 'checkout_option', {
    ...checkoutPayoload
  });
};

/**
 * Event - Add custom tracking event.
 * @param {string } porductId 
 * @param {string} name 
 * @param {string} category
 * @param {string} branc
 * @param {string} variant
 * @param {string} position
 * @param {number} price
 * @param {number} quantity
 * @param {string} coupon
 */
export const ProductAddedtoCart = ({ productId, name, category, brand, variant, position, price, quantity, coupon}) => {
  const payload = cleanEntityData({
      id: productId,
      name,
      category,
      brand,
      variant,
      position,
      price,
      quantity,
      coupon
  });
  
  ReactGA.plugin.execute('ec', 'addProduct', {
      ...payload
  });
  ReactGA.plugin.execute('ec', 'setAction', 'add');
};

/**
 * Event - Add custom tracking event.
 * @param {string } porductId 
 * @param {string} name 
 * @param {string} category
 * @param {string} branc
 * @param {string} variant
 * @param {string} position
 * @param {number} price
 * @param {number} quantity
 * @param {string} coupon
 */
export const ProductRemovefromCart = ({ productId, name, category, brand, variant, position, price, quantity, coupon}) => {
  const payload = cleanEntityData({
      id: productId,
      name,
      category,
      brand,
      variant,
      position,
      price,
      quantity,
      coupon
  });
  // ReactGA.plugin.require('ec');
  ReactGA.plugin.execute('ec', 'addProduct', {
      ...payload
  });
  ReactGA.plugin.execute('ec', 'setAction', 'remove');
};



/**
 * Event - Add custom tracking event.
 * @param {string } porductId 
 * @param {string} name 
 * @param {string} category
 * @param {string} branc
 * @param {string} variant
 * @param {string} position
 * @param {number} price
 * @param {number} quantity
 * @param {string} coupon
 */
export const MakeTransaction = ({ cart, purchasePayload}) => {
  _map(cart, c => {
    const payload = cleanEntityData({
      id: _get(c, 'productId'),
      name: _get(c, 'name'),
      category: _get(c, 'category'),
      brand: _get(c, 'brand'),
      variant: _get(c, 'variant'),
      position: _get(c, 'position'),
      price: _get(c, 'price'),
      quantity: _get(c, 'quantity'),
      coupon: _get(c, 'coupon')
    });
    ReactGA.plugin.execute('ec', 'addProduct', {
      ...payload
    });

  })

  const purchasePayloadData = cleanEntityData({
    id: _get(purchasePayload, 'id'),
    affiliation: _get(purchasePayload, 'affiliation'),
    revenue: _get(purchasePayload, 'revenue'),
    tax: _get(purchasePayload, 'tax'),
    shipping: _get(purchasePayload, 'shipping'),
    coupon: _get(purchasePayload, 'coupon'),
    list: _get(purchasePayload, 'list')
  });
  ReactGA.plugin.execute('ec', 'setAction', 'purchase', purchasePayloadData);
};

/**
 * Event - Add custom tracking event.
 * @param {string } productId 
 * @param {string} name 
 * @param {string} creative
 * @param {string} position
 */
export const PromotionEvent = ({ productId, name, creative, position }) => {
    const payload = cleanEntityData({
        id: productId,
        name,
        creative,
        position
    });
    ReactGA.plugin.execute('ec', 'addPromo', {
    ...payload
    });

    ReactGA.plugin.execute('ec', 'setAction', 'promo_click');

  };