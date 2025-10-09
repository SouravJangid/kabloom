import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import FlowerCard from './FlowerCard';
import {postDataAsync} from '../../Redux/Actions/genericPostData';
import '../../assets/stylesheets/VendorProductsListing.css';
import '../../assets/stylesheets/flowerCard.css';
import '../../assets/stylesheets/VendorProductFilter.css';
import { priceRanges, sizes } from '../../Global/Constants/commonconstants';

/** transform helper kept (unchanged) */
const transform = (arr = [], defaultImage) => {
  const productData = Array.isArray(arr?.data)
    ? arr.data
    : Array.isArray(arr)
    ? arr
    : [];
  if (!Array.isArray(productData)) return [];

  return productData.map(parent => {
    if (!Array.isArray(parent.child) || parent.child.length === 0) {
      // const image = (parent.image && parent.image.length)
      //   ? parent.image
      //   : (defaultImage ? [{ small_image: defaultImage }, { small_image: defaultImage }] : []);

      return {
        ...parent,
        child: [],
        price: parent.price || '',
        // image,
        speed_id: parent.speed_id || [],
        _parent: parent
      };
    }

    const children = [...parent.child];
    let primaryChild = null;
    let minPrice = Infinity;

    for (const c of children) {
      const raw = String(c.price || '');
      const parsed = parseFloat(raw.replace(/[^0-9.-]+/g, ''));
      if (Number.isFinite(parsed) && parsed < minPrice) {
        minPrice = parsed;
        primaryChild = c;
      }
    }

    if (!primaryChild) primaryChild = children[0] || null;

    const orderedChildren = primaryChild ? [primaryChild, ...children.filter(c => c !== primaryChild)] : children;

    // const chosenImage =
    //   (primaryChild?.image?.length) ? primaryChild.image :
    //   (parent.image?.length) ? parent.image :
    //   (defaultImage ? [{ small_image: defaultImage }, { small_image: defaultImage }] : []);

    const speedMapByType = {};
    children.forEach(c => {
      if (Array.isArray(c.speed_id)) {
        c.speed_id.forEach(s => {
          if (s?.Type && !speedMapByType[s.Type]) {
            speedMapByType[s.Type] = { ...s };
          }
        });
      }
    });

    return {
      ...parent,
      child: orderedChildren,
      price: primaryChild?.price || parent.price || '',
      // image: chosenImage,
      speed_id: Object.values(speedMapByType),
      bottle_size: primaryChild?.bottle_size || parent.bottle_size || '',
      _parent: parent
    };
  });
};

export default function VendorProductsListing({
  productListingData = [],
  defaultImage,
  vendorId,
  zipcode
}) {
  const history = useHistory();
  const dispatch = useDispatch();
  const PRODUCTS_PER_PAGE = 20;
  const isFirstRender = useRef(true);
 
  const [filters, setFilters] = useState({ price: [], size: [] }); // single filter state
  const [loading, setLoading] = useState(false);

  const [productList,setProductList] = useState(transform(productListingData, defaultImage))
  const [paginationData,setPaginationData] = useState(productListingData?.pagination)


  const fetchProductListData = async (pageNo = 1) => {
    if (!vendorId || !zipcode) {
      console.error('Vendor ID or zipcode missing');
      return;
    }
    setLoading(true);

    const body = {
      vendor_id: vendorId,
      zipcode,
      page_no: Number(pageNo) || 1,
      limit: String(PRODUCTS_PER_PAGE),
      size: filters.size,
      price_range: filters.price
    };

    try {
      const response = await postDataAsync(
        dispatch,
        {
          reqObj:body,
          url: '/api/Vendordata/getFilteredProducts',
          constants: {
            init: 'VENDOR_PAGE_INIT',
            success: 'VENDOR_PAGE_SUCCESS',
            error: 'VENDOR_PAGE_ERROR',
          },
          identifier: 'VENDOR_PAGE',
          dontShowMessage: true
        }
      );
      console.log("response",response);
      
      if (response?.status === "true") {
        const productData = response.data;
        const paginationData = response.pagination;
        setProductList(transform(productData, defaultImage));
        setPaginationData(paginationData);
      }
      setLoading(false);
    } catch (err) {
      console.error('fetchVendorPage failed', err);
      // keep previous serverPageProducts or client products
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  };

  const isFilterApplied = ()=>{
    return (filters.price.length>0 || filters.size.length>0)
  }
  // load pagination meta on mount / vendor change
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false; // skip first render
      return;
    }

    // This will only run on subsequent changes of `filters`
    fetchProductListData(1);
  }, [filters]);

  const handleCheckboxChange = (type, value) => {
    setFilters(prev => {
      const currentSet = new Set(prev[type]); // convert array to Set
      if (currentSet.has(value)) {
        currentSet.delete(value);             // remove if exists
      } else {
        currentSet.add(value);                // add if not
      }
      return {
        ...prev,
        [type]: Array.from(currentSet)        // convert back to array
      };
    });
  };

  const clearAllFilters = () => setFilters({ price: [], size: [] });

  if (!loading && productList.length === 0) {
    return <div>No products found.</div>;
  }

  // UI
  return (
    <div className="vendor-products-container">
      <div className="vendor-filter-container">
        <div className="vendor-filter-title">
          FILTER
          <button className="filter-clear-btn" onClick={clearAllFilters}>CLEAR ALL</button>
        </div>

        <div className="filter-section">
          <strong>PRICE</strong>
          {priceRanges.map(range => (
            <label key={range.label}>
              <input
                type="checkbox"
                className="filter-checkbox"
                checked={filters.price.includes(range.label)}
                onChange={() => handleCheckboxChange("price", range.label)}
              />
              {range.label}
            </label>
          ))}
        </div>

        <div className="filter-section">
          <strong>SIZE</strong>
          {sizes.map(size => (
            <label key={size}>
              <input
                type="checkbox"
                className="filter-checkbox"
                checked={filters.size.includes(size)}
                onChange={() => handleCheckboxChange("size", size)}
              />
              {size}
            </label>
          ))}
        </div>
      </div>

      <div className="vendor-products-right-panel">
        <h1 className="shop-header">Shop</h1>
        <div className="shop-underline"></div>

        <div className="flowercardContainer">
          {productList.length && productList.map((product, idx) => (
            <div
              key={product.id + '-' + idx}
              className="product-card-wrapper"
              onClick={() => history.push(`/store/${product._parent?.id || product.id}`)}
            >
              <FlowerCard product={product} defaultImage={defaultImage} isImgLazy = {idx<10?false:true}/>
            </div>
          ))}
        </div>

        <div className="pagination">
          <button
            onClick={() => fetchProductListData(Math.max(1, paginationData?.current_page - 1))}
            disabled={!paginationData?.has_previous_page || loading}
            className="paginationButton"
          >
            Previous
          </button>
          <span className="pageInfo">
            Page {paginationData?.current_page} of {paginationData?.total_pages}
          </span>
          <button
            onClick={() => fetchProductListData(Math.min(paginationData?.total_pages, paginationData?.current_page + 1))}
            disabled={!paginationData?.has_next_page || loading}
            className="paginationButton"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
