"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/shared/components/ui/pagination";
import { usePagination } from "@/shared/hooks/use-pagination";

interface PaginationControlsProps {
  totalItems: number;
  itemsPerPage?: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  showPageInfo?: boolean;
  className?: string;
}

export function PaginationControls({
  totalItems,
  itemsPerPage = 1,
  currentPage,
  onPageChange,
  showPageInfo = true,
  className,
}: PaginationControlsProps) {
  const {
    totalPages,
    pageNumbers,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    canGoToNextPage,
    canGoToPreviousPage,
  } = usePagination({
    totalItems,
    itemsPerPage,
    initialPage: currentPage,
  });

  const handlePageChange = (page: number) => {
    goToPage(page);
    onPageChange(page);
  };

  const handleNextPage = () => {
    goToNextPage();
    onPageChange(currentPage + 1);
  };

  const handlePreviousPage = () => {
    goToPreviousPage();
    onPageChange(currentPage - 1);
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <div className={`flex flex-col items-center space-y-4 ${className || ""}`}>
      {showPageInfo && (
        <div className="text-sm text-muted-foreground">
          Page {currentPage} of {totalPages}
        </div>
      )}

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handlePreviousPage();
              }}
              className={
                !canGoToPreviousPage ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>

          {pageNumbers.map((page, index) => (
            <PaginationItem key={index}>
              {page === "ellipsis" ? (
                <span className="flex size-9 items-center justify-center">
                  <span className="text-muted-foreground">...</span>
                </span>
              ) : (
                <PaginationLink
                  href="#"
                  isActive={currentPage === page}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page as number);
                  }}
                >
                  {page}
                </PaginationLink>
              )}
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleNextPage();
              }}
              className={
                !canGoToNextPage ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
