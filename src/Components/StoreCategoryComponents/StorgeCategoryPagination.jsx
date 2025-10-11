import React, { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import "./pagination.css";

function PaginatedItems({
  itemsPerPage,
  pageCount,
  handlePageClick,
  forcePage,
}) {
  const [pageRangeDisplayed, setPageRangeDisplayed] = useState(3);
  const [marginPagesDisplayed, setMarginPagesDisplayed] = useState(2);

  useEffect(() => {
    const updateRanges = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1024;
      if (w < 420) {
        setPageRangeDisplayed(1);
        setMarginPagesDisplayed(1);
      } else if (w < 768) {
        setPageRangeDisplayed(2);
        setMarginPagesDisplayed(1);
      } else {
        setPageRangeDisplayed(3);
        setMarginPagesDisplayed(2);
      }
    };

    updateRanges();
    window.addEventListener("resize", updateRanges);
    return () => window.removeEventListener("resize", updateRanges);
  }, []);

  const handlePageClickFun = (event) => {
    if (handlePageClick) handlePageClick(event.selected);
  };

  const isCompact = typeof window !== "undefined" && window.innerWidth < 520;

  // Let the parent container control alignment (center/right). Use auto width so parent flex can position this block.
  const containerStyle = {
    width: "auto",
    display: "inline-flex",
    padding: "6px 0",
  };
  const innerStyle = { display: "inline-flex", alignItems: "center", gap: 8 };

  return (
    <div style={containerStyle}>
      <div style={innerStyle}>
        <ReactPaginate
          nextLabel=">"
          onPageChange={handlePageClickFun}
          pageRangeDisplayed={pageRangeDisplayed}
          marginPagesDisplayed={marginPagesDisplayed}
          pageCount={pageCount}
          previousLabel="<"
          pageClassName={isCompact ? "page-item compact" : "page-item"}
          pageLinkClassName={isCompact ? "page-link compact" : "page-link"}
          previousClassName={isCompact ? "page-item compact" : "page-item"}
          previousLinkClassName={isCompact ? "page-link compact" : "page-link"}
          nextClassName={isCompact ? "page-item compact" : "page-item"}
          nextLinkClassName={isCompact ? "page-link compact" : "page-link"}
          breakLabel="..."
          breakClassName={isCompact ? "page-item compact" : "page-item"}
          breakLinkClassName={isCompact ? "page-link compact" : "page-link"}
          containerClassName="pagination"
          activeClassName="active"
          renderOnZeroPageCount={null}
          forcePage={forcePage ? forcePage : 0}
        />
      </div>
    </div>
  );
}

export default PaginatedItems;
