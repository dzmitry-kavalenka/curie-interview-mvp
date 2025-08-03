import { useCallback, useState } from "react";

// Custom hook for text selection logic
export const useTextSelection = (onTextSelect?: (text: string) => void) => {
  const [selectedText, setSelectedText] = useState<string>("");
  const [showPopover, setShowPopover] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleTextSelection = useCallback(
    (event: Event) => {
      const selection = window.getSelection();
      if (!selection || !selection.toString().trim()) return;

      const selectedText = selection.toString().trim();
      console.log("Selected text:", selectedText);

      // Get more precise mouse position
      if (event instanceof MouseEvent) {
        const rect = (event.target as Element)?.getBoundingClientRect();
        if (rect) {
          setMousePosition({
            x: event.clientX,
            y: event.clientY,
          });
        }
      }

      // Validate selection is meaningful
      if (selectedText.length < 1) return;

      setSelectedText(selectedText);
      setShowPopover(true);
      onTextSelect?.(selectedText);
    },
    [onTextSelect]
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        window.getSelection()?.removeAllRanges();
        setSelectedText("");
        setShowPopover(false);
        onTextSelect?.("");
      }
    },
    [onTextSelect]
  );

  const handlePopoverClose = useCallback(() => {
    setShowPopover(false);
    setSelectedText("");
    window.getSelection()?.removeAllRanges();
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedText("");
    setShowPopover(false);
    window.getSelection()?.removeAllRanges();
  }, []);

  return {
    selectedText,
    showPopover,
    mousePosition,
    handleTextSelection,
    handleKeyDown,
    handlePopoverClose,
    clearSelection,
  };
};
