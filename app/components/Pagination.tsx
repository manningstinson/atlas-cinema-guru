"use client";

import { useCallback } from "react";

const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}) => {
  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage >= totalPages;

  const handlePrevious = useCallback(() => {
    if (!isPreviousDisabled) {
      onPageChange(currentPage - 1);
    }
  }, [currentPage, isPreviousDisabled, onPageChange]);

  const handleNext = useCallback(() => {
    if (!isNextDisabled) {
      onPageChange(currentPage + 1);
    }
  }, [currentPage, isNextDisabled, onPageChange]);

  return (
    <nav
      className="flex items-center justify-center gap-2 my-5 py-5 min-h-[80px] md:min-h-[60px] bg-midnightBlue"
      aria-label="Pagination Navigation"
    >
      {/* Previous Button */}
      <button
        onClick={handlePrevious}
        disabled={isPreviousDisabled}
        className={`px-5 py-3 w-28 text-midnightBlue bg-teal transition-opacity duration-300 rounded-l-full focus:outline-none focus:ring-2 focus:ring-midnightBlue-300 
        ${isPreviousDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
        aria-label="Go to previous page"
        aria-disabled={isPreviousDisabled}
      >
        Previous
      </button>

      <span className="px-4 py-3 text-white font-semibold" aria-live="polite">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        onClick={handleNext}
        disabled={isNextDisabled}
        className={`px-5 py-3 w-28 text-midnightBlue bg-teal transition-opacity duration-300 rounded-r-full focus:outline-none focus:ring-2 focus:ring-midnightBlue-300 
        ${isNextDisabled ? "opacity-50 cursor-not-allowed" : "hover:opacity-90"}`}
        aria-label="Go to next page"
        aria-disabled={isNextDisabled}
      >
        Next
      </button>
    </nav>
  );
};

export default Pagination;
