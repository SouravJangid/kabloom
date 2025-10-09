import React, { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';


const items = [...Array(33).keys()];



function PaginatedItems({ itemsPerPage,pageCount,handlePageClick,forcePage }) {
  // Invoke when user click to request another page.
  const handlePageClickFun = (event) => {
    handlePageClick(event.selected)
  };

  return (
    <>
      <ReactPaginate
        nextLabel=">"
        onPageChange={handlePageClickFun}
        pageRangeDisplayed={3}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="<"
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakLabel="..."
        breakClassName="page-item"
        breakLinkClassName="page-link"
        containerClassName="pagination"
        activeClassName="active"
        renderOnZeroPageCount={null}
        forcePage={forcePage?forcePage:0}
      />
    </>
  );
}

export default PaginatedItems;