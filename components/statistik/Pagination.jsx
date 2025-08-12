const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    pageBlockStart,
    blockSize,
    onNextBlock,
    onPrevBlock,
  }) => {
    const pageNumbers = Array.from(
      { length: Math.min(blockSize, totalPages - pageBlockStart + 1) },
      (_, i) => pageBlockStart + i
    );
  
    return (
      <div className="flex justify-center items-center gap-2 pt-6 flex-wrap">
        {pageBlockStart > 1 && (
          <button
            onClick={onPrevBlock}
            className="text-sm px-3 py-1 rounded-full border border-gray-300"
          >
            ‹ Sebelumnya
          </button>
        )}
  
        {pageNumbers.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`text-sm px-3 py-1 rounded-full ${
              page === currentPage ? "bg-teal-500 text-white" : "border border-gray-300"
            }`}
          >
            {page}
          </button>
        ))}
  
        {pageBlockStart + blockSize <= totalPages && (
          <button
            onClick={onNextBlock}
            className="text-sm px-3 py-1 rounded-full border border-gray-300"
          >
            Selanjutnya ›
          </button>
        )}
      </div>
    );
  };
  
  export default Pagination;
  