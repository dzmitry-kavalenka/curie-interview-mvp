import { useState, useCallback } from "react";

interface UsePaginationProps {
  totalItems: number;
  itemsPerPage?: number;
  initialPage?: number;
}

interface UsePaginationReturn {
  currentPage: number;
  totalPages: number;
  pageNumbers: (number | "ellipsis")[];
  goToPage: (page: number) => void;
  goToNextPage: () => void;
  goToPreviousPage: () => void;
  canGoToNextPage: boolean;
  canGoToPreviousPage: boolean;
}

export function usePagination({
  totalItems,
  itemsPerPage = 1,
  initialPage = 1,
}: UsePaginationProps): UsePaginationReturn {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [currentPage, setCurrentPage] = useState(() => {
    return Math.min(Math.max(initialPage, 1), totalPages);
  });

  const goToPage = useCallback(
    (page: number) => {
      const validPage = Math.min(Math.max(page, 1), totalPages);
      setCurrentPage(validPage);
    },
    [totalPages]
  );

  const goToNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  }, [currentPage, totalPages]);

  const goToPreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  }, [currentPage]);

  const generatePageNumbers = useCallback(() => {
    const pages: (number | "ellipsis")[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show smart pagination with ellipsis
      if (currentPage <= 3) {
        // Near start
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end
        pages.push(1);
        pages.push("ellipsis");
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        // Middle
        pages.push(1);
        pages.push("ellipsis");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push("ellipsis");
        pages.push(totalPages);
      }
    }

    return pages;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    pageNumbers: generatePageNumbers(),
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoToNextPage: currentPage < totalPages,
    canGoToPreviousPage: currentPage > 1,
  };
}
