import "./Pagination.css";

const Pagination = ({
  page,
  totalPages,
  pageSize,
  pageSizes,
  totalItems,
  label = "Rows per page",
  onPageChange,
  onPageSizeChange,
}) => {
  const hasResults = totalItems > 0;
  const firstItemIndex = hasResults ? (page - 1) * pageSize + 1 : 0;
  const lastItemIndex = hasResults ? Math.min(totalItems, page * pageSize) : 0;

  const handlePrevious = () => {
    if (page > 1) {
      onPageChange(page - 1);
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      onPageChange(page + 1);
    }
  };

  const handlePageSizeChange = (event) => {
    const nextSize = Number(event.target.value);
    onPageSizeChange(nextSize);
  };

  return (
    <div className="admin-pagination">
      <p>
        Showing {hasResults ? firstItemIndex : 0}-
        {hasResults ? lastItemIndex : 0} of {totalItems}
      </p>
      <div className="admin-pagination__controls">
        <label>
          {label}
          <select value={pageSize} onChange={handlePageSizeChange}>
            {pageSizes.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </label>
        <div className="admin-pagination__buttons">
          <button
            type="button"
            className="admin-pagination__button"
            onClick={handlePrevious}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            className="admin-pagination__button"
            onClick={handleNext}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
