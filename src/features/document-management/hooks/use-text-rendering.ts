import type { PDFPageProxy, PageViewport } from "pdfjs-dist";
import { useCallback, useRef } from "react";

import { logger } from "@/shared/utils/logger";

interface TextLayerItem {
  text: string;
  x: number;
  y: number;
  width: number;
  height: number;
  fontName: string;
  fontSize: number;
  style: {
    fontFamily?: string;
  };
}

interface TextItem {
  str: string;
  transform: number[];
  width: number;
  height: number;
  fontName: string;
}

interface TextContent {
  items: TextItem[];
  styles: Record<string, { fontFamily?: string }>;
}

// Custom hook for text rendering logic
export const useTextRendering = (scale: number) => {
  const textLayerRef = useRef<HTMLDivElement>(null);

  const clearTextLayer = useCallback(() => {
    if (textLayerRef.current) {
      textLayerRef.current.innerHTML = "";
    }
  }, []);

  const createTextSpan = useCallback((item: TextLayerItem): HTMLSpanElement => {
    const textSpan = document.createElement("span");
    textSpan.textContent = item.text;
    textSpan.className =
      "absolute text-transparent whitespace-pre cursor-text select-text";

    // More precise positioning
    textSpan.style.left = `${item.x}px`;
    textSpan.style.top = `${item.y - item.height}px`;
    textSpan.style.width = `${item.width}px`;
    textSpan.style.height = `${item.height}px`;
    textSpan.style.fontSize = `${item.fontSize}px`;
    textSpan.style.fontFamily = item.style.fontFamily || "sans-serif";
    textSpan.style.lineHeight = "1";
    textSpan.style.transform = "scaleY(-1)"; // Flip to match PDF coordinate system

    // Add data attributes for better selection handling
    textSpan.setAttribute("data-text", item.text);
    textSpan.setAttribute("data-x", item.x.toString());
    textSpan.setAttribute("data-y", item.y.toString());

    return textSpan;
  }, []);

  const createTextLayerItem = useCallback(
    (
      item: TextItem,
      viewport: PageViewport,
      textContent: TextContent
    ): TextLayerItem => {
      const tx = item.transform[4];
      const ty = item.transform[5];
      const style = textContent.styles[item.fontName];
      const fontSize = item.height * scale;

      // More accurate positioning calculation
      const x = tx * scale;
      const y = viewport.height - ty * scale;
      const width = item.width * scale;
      const height = item.height * scale;

      return {
        text: item.str,
        x,
        y,
        width,
        height,
        fontName: item.fontName,
        fontSize,
        style,
      };
    },
    [scale]
  );

  const addEventListeners = useCallback(
    (
      handleTextSelection: (event: Event) => void,
      handleKeyDown: (event: KeyboardEvent) => void
    ) => {
      const textLayerDiv = textLayerRef.current;
      if (textLayerDiv) {
        textLayerDiv.addEventListener("mouseup", handleTextSelection);
        textLayerDiv.addEventListener("keyup", handleTextSelection);
        textLayerDiv.addEventListener("keydown", handleKeyDown);
      }
    },
    []
  );

  const removeEventListeners = useCallback(
    (
      handleTextSelection: (event: Event) => void,
      handleKeyDown: (event: KeyboardEvent) => void
    ) => {
      const textLayerDiv = textLayerRef.current;
      if (textLayerDiv) {
        textLayerDiv.removeEventListener("mouseup", handleTextSelection);
        textLayerDiv.removeEventListener("keyup", handleTextSelection);
        textLayerDiv.removeEventListener("keydown", handleKeyDown);
      }
    },
    []
  );

  const renderTextLayer = useCallback(
    async (
      currentPage: PDFPageProxy,
      viewport: PageViewport,
      handleTextSelection: (event: Event) => void,
      handleKeyDown: (event: KeyboardEvent) => void
    ) => {
      clearTextLayer();

      try {
        const textContent = (await currentPage.getTextContent()) as TextContent;

        // Sort items by position for better selection
        const sortedItems = textContent.items.sort((a, b) => {
          const aY = viewport.height - a.transform[5] * scale;
          const bY = viewport.height - b.transform[5] * scale;
          if (Math.abs(aY - bY) < 5) {
            // Same line, sort by X
            return a.transform[4] * scale - b.transform[4] * scale;
          }
          return aY - bY;
        });

        const textLayerItems = sortedItems.map(item =>
          createTextLayerItem(item, viewport, textContent)
        );

        // Group items by lines for better text flow
        const lineGroups: TextLayerItem[][] = [];
        let currentLine: TextLayerItem[] = [];
        let lastY = -1;

        textLayerItems.forEach(item => {
          if (lastY === -1 || Math.abs(item.y - lastY) < 5) {
            // Same line
            currentLine.push(item);
          } else {
            // New line
            if (currentLine.length > 0) {
              lineGroups.push(currentLine);
            }
            currentLine = [item];
          }
          lastY = item.y;
        });

        if (currentLine.length > 0) {
          lineGroups.push(currentLine);
        }

        // Render each line group
        lineGroups.forEach(lineGroup => {
          lineGroup.forEach(item => {
            const textSpan = createTextSpan(item);
            textLayerRef.current?.appendChild(textSpan);
          });
        });

        // Add event listeners
        addEventListeners(handleTextSelection, handleKeyDown);
      } catch (err) {
        logger.error("Text layer rendering error:", err);
      }
    },
    [
      clearTextLayer,
      createTextLayerItem,
      createTextSpan,
      addEventListeners,
      scale,
    ]
  );

  return {
    textLayerRef,
    renderTextLayer,
    removeEventListeners,
  };
};
