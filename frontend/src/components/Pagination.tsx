import { PaginationMeta } from "../types";

interface PaginationProps {
  pagination: PaginationMeta;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  pagination,
  onPageChange,
}: PaginationProps) {
  const { page, totalPages } = pagination;

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is 5 or less
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show 5 pages centered around current page
      let start = Math.max(1, page - 2);
      let end = Math.min(totalPages, start + 4);

      // Adjust start if we're near the end
      if (end - start < 4) {
        start = Math.max(1, end - 4);
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
    }

    return pages;
  };

  return (
    <div className="flex items-center justify-center gap-3 mt-8">
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 bg-white text-gray-600 rounded-lg font-semibold transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span>←</span>
        <span>Previous</span>
      </button>

      <div className="flex gap-2">
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-[42px] h-[34px] rounded-[8px] font-semibold text-[14px] leading-none flex items-center justify-end pr-2 transition-colors ${
              page === pageNum
                ? "bg-[#4299E1] text-white"
                : "bg-[#FFFFFF] text-gray-700 hover:bg-gray-50"
            }`}
          >
            {pageNum}
          </button>
        ))}
      </div>

      <button
        onClick={() => onPageChange(page + 1)}
        disabled={page === totalPages}
        className="px-4 py-2 bg-white text-gray-600 rounded-lg font-semibold transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span>Next</span>
        <span>→</span>
      </button>
    </div>
  );
}
