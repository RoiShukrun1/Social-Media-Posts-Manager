import { PaginationMeta } from "../types";
import { COLORS, DEFAULTS } from "../constants/config";

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
    const maxVisible = DEFAULTS.paginationVisible;

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
    <nav
      aria-label="Pagination navigation"
      className="flex items-center justify-center gap-3 mt-8"
    >
      <button
        onClick={() => onPageChange(page - 1)}
        disabled={page === 1}
        aria-label="Go to previous page"
        aria-disabled={page === 1}
        className="px-4 py-2 bg-white text-gray-600 rounded-lg font-semibold transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span aria-hidden="true">←</span>
        <span>Previous</span>
      </button>

      <div className="flex gap-2" role="group" aria-label="Pagination pages">
        {getPageNumbers().map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            aria-label={`Go to page ${pageNum}`}
            aria-current={page === pageNum ? "page" : undefined}
            style={
              page === pageNum ? { backgroundColor: COLORS.primary } : undefined
            }
            className={`w-[42px] h-[34px] rounded-[8px] font-semibold text-[14px] leading-none flex items-center justify-end pr-2 transition-colors ${
              page === pageNum
                ? "text-white"
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
        aria-label="Go to next page"
        aria-disabled={page === totalPages}
        className="px-4 py-2 bg-white text-gray-600 rounded-lg font-semibold transition-colors hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <span>Next</span>
        <span aria-hidden="true">→</span>
      </button>
    </nav>
  );
}
