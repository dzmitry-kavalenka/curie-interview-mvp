"use client";

import type { PDFDocumentProxy, RenderTask } from "pdfjs-dist";
import { useEffect, useRef } from "react";

import { logger } from "@/shared/utils/logger";

interface PdfPageProps {
  pdf: PDFDocumentProxy;
  pageNumber: number;
}

export function PdfPage({ pdf, pageNumber }: PdfPageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderTaskRef = useRef<RenderTask | null>(null);

  useEffect(() => {
    let isMounted = true;

    const renderPage = async () => {
      const page = await pdf.getPage(pageNumber);
      const viewport = page.getViewport({ scale: 1.5 });

      const canvas = canvasRef.current;
      if (!canvas || !isMounted) return;

      const context = canvas.getContext("2d");
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      // Отменить предыдущий render если есть
      renderTaskRef.current?.cancel();

      const task = page.render({
        canvasContext: context!,
        viewport,
        canvas: canvasRef.current!,
      });
      renderTaskRef.current = task;

      try {
        await task.promise;
      } catch (err: unknown) {
        if ((err as { name?: string }).name !== "RenderingCancelledException") {
          logger.error("Rendering error:", err);
        }
      }
    };

    renderPage();

    return () => {
      isMounted = false;
      renderTaskRef.current?.cancel(); // Отменить при размонтировании
    };
  }, [pdf, pageNumber]);

  return (
    <div className="flex justify-center">
      <canvas ref={canvasRef} className="rounded shadow" />
    </div>
  );
}
