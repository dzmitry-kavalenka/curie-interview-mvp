"use client";

import type {
  PDFDocumentProxy,
  RenderTask,
  PDFPageProxy,
  PageViewport,
} from "pdfjs-dist";
import { useCallback, useEffect, useRef, useState } from "react";

import { logger } from "@/shared/utils/logger";

import { useTextRendering, useTextSelection } from "../hooks";

import { TextSelectionPopover } from "./text-selection-popover";

interface PdfPageProps {
  pdf: PDFDocumentProxy;
  pageNumber: number;
  onTextSelect?: (text: string) => void;
  fileId?: string;
  fileName?: string;
  onAnnotationCreated?: () => void;
}

export function PdfPage({
  pdf,
  pageNumber,
  onTextSelect,
  fileId,
  fileName,
  onAnnotationCreated,
}: PdfPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);
  const [scale] = useState(1.5);

  // Use custom hooks
  const {
    selectedText,
    showPopover,
    mousePosition,
    handleTextSelection,
    handleKeyDown,
    handlePopoverClose,
  } = useTextSelection(onTextSelect);

  const { textLayerRef, renderTextLayer, removeEventListeners } =
    useTextRendering(scale);

  // Helper function to render canvas
  const renderCanvas = useCallback(
    async (currentPage: PDFPageProxy, viewport: PageViewport) => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const context = canvas.getContext("2d");
      if (!context) return;

      canvas.height = viewport.height;
      canvas.width = viewport.width;

      renderTaskRef.current?.cancel();

      const task = currentPage.render({
        canvasContext: context,
        viewport,
        canvas: canvas,
      });
      renderTaskRef.current = task;

      await task.promise;
    },
    []
  );

  const handleAnnotationCreated = useCallback(() => {
    onAnnotationCreated?.();
    handlePopoverClose();
  }, [onAnnotationCreated, handlePopoverClose]);

  // Main render effect
  useEffect(() => {
    let isMounted = true;

    const renderPage = async () => {
      try {
        const currentPage = await pdf.getPage(pageNumber);
        const viewport = currentPage.getViewport({ scale });

        await renderCanvas(currentPage, viewport);

        if (isMounted && textLayerRef.current) {
          await renderTextLayer(
            currentPage,
            viewport,
            handleTextSelection,
            handleKeyDown
          );
        }
      } catch (err: unknown) {
        if ((err as { name?: string }).name === "RenderingCancelledException") {
          return;
        }
        logger.error("Rendering error:", err);
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      renderTaskRef.current?.cancel();
      removeEventListeners(handleTextSelection, handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pdf,
    pageNumber,
    scale,
    renderCanvas,
    renderTextLayer,
    removeEventListeners,
    handleTextSelection,
    handleKeyDown,
  ]);

  return (
    <div className="flex justify-center relative">
      <div className="relative">
        <canvas ref={canvasRef} className="rounded shadow block" />
        <div
          ref={textLayerRef}
          className="absolute inset-0 pointer-events-auto overflow-hidden leading-none select-text"
        />

        {showPopover && selectedText && fileId && fileName && (
          <div
            className="fixed z-50"
            style={{
              left: mousePosition.x,
              top: mousePosition.y - 10,
            }}
          >
            <TextSelectionPopover
              selectedText={selectedText}
              fileId={fileId}
              fileName={fileName}
              pageNumber={pageNumber}
              onAnnotationCreated={handleAnnotationCreated}
              onClose={handlePopoverClose}
            />
          </div>
        )}
      </div>
    </div>
  );
}
