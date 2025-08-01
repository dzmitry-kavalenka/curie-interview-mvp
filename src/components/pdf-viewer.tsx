"use client";

import { useEffect, useState } from "react";
import { PdfPage } from "./pdf-page";
import { Loader2 } from "lucide-react";
import type { PDFDocumentProxy } from "pdfjs-dist";

export function PdfViewer({ fileUrl }: { fileUrl: string }) {
  const [pdfDoc, setPdfDoc] = useState<PDFDocumentProxy | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError("Failed to load PDF");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [fileUrl]);

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
    <div className="space-y-12 px-4 py-8">
      {Array.from({ length: pdfDoc.numPages }, (_, i) => (
        <PdfPage key={i} pageNumber={i + 1} pdf={pdfDoc} />
      ))}
    </div>
  );
}
