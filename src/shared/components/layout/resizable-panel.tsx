"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/shared/utils/utils";

interface ResizablePanelProps {
  children: React.ReactNode;
  sidePanel: React.ReactNode;
  minWidth?: number;
  maxWidth?: number;
  defaultWidth?: number;
}

export function ResizablePanel({
  children,
  sidePanel,
  minWidth = 240,
  maxWidth = 600,
  defaultWidth = 320,
}: ResizablePanelProps) {
  const [sidePanelWidth, setSidePanelWidth] = useState(defaultWidth);
  const [isDragging, setIsDragging] = useState(false);
  const startXRef = useRef(0);
  const startWidthRef = useRef(0);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      setIsDragging(true);
      startXRef.current = e.clientX;
      startWidthRef.current = sidePanelWidth;
    },
    [sidePanelWidth]
  );

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isDragging) return;

      const deltaX = startXRef.current - e.clientX;
      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, startWidthRef.current + deltaX)
      );
      setSidePanelWidth(newWidth);
    },
    [isDragging, minWidth, maxWidth]
  );

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div className="flex h-screen">
      {/* Main Content */}
      <div className="flex-1 overflow-auto">{children}</div>

      {/* Resizable Border */}
      <div
        className={cn(
          "w-1 bg-border hover:bg-primary/50 transition-colors cursor-col-resize relative",
          isDragging && "bg-primary"
        )}
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator when dragging */}
        {isDragging && <div className="absolute inset-0 bg-primary/20" />}
      </div>

      {/* Side Panel */}
      <div
        className="bg-background border-l border-border overflow-auto"
        style={{ width: `${sidePanelWidth}px` }}
      >
        {sidePanel}
      </div>
    </div>
  );
}
