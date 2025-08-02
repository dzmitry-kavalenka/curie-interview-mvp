"use client";

import { useEffect, useState } from "react";
import { PdfPage } from "./pdf-page";
import { Loader2 } from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";
import { PaginationControls } from "./pagination-controls";

export function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    const load = async () => {
      try {
        setLoading(true);
        setError(null);

        // Dynamic import to ensure it only loads on client
        const pdfjs = await import("pdfjs-dist");
        const { getDocument, GlobalWorkerOptions } = pdfjs;

        // Use the real worker from public folder
        GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

        const loadingTask = getDocument(fileUrl);
        const doc = await loadingTask.promise;
        setPdfDoc(doc);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("Failed to load PDF");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fileUrl]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return <p className="text-destructive text-center mt-12">Error: {error}</p>;
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16 text-muted-foreground animate-pulse">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Loading PDF…
      </div>
    );
  }

  if (!pdfDoc) {
    return (
      <p className="text-destructive text-center mt-12">Error loading PDF</p>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      {/* PDF Page Container - Takes up available space */}
      <div className="flex-1 overflow-auto p-4">
        <div className="flex justify-center">
          <PdfPage pageNumber={currentPage} pdf={pdfDoc} />
        </div>
      </div>

      {/* Fixed Bottom Pagination */}
      <div className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <PaginationControls
          totalItems={pdfDoc.numPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          className="py-4"
        />
      </div>
    </div>
  );
}
