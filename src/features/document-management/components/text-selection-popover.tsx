"use client";

import { Plus, X, MessageSquare } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/shared/components/ui/button";
import { logger } from "@/shared/utils/logger";

interface TextSelectionPopoverProps {
  selectedText: string;
  fileId: string;
  fileName: string;
  pageNumber: number;
  onAnnotationCreated?: () => void;
  onClose?: () => void;
}

export function TextSelectionPopover({
  selectedText,
  fileId,
  fileName,
  pageNumber,
  onAnnotationCreated,
  onClose,
}: TextSelectionPopoverProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [note, setNote] = useState("");

  const handleCreateAnnotation = async () => {
    if (!note.trim()) {
      toast.error("Please add a note", {
        description: "A note is required to create an annotation.",
      });
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/annotations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileId,
          fileName,
          pageNumber,
          selectedText,
          note: note.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create annotation");
      }

      toast.success("Annotation created successfully!");
      setIsOpen(false);
      onAnnotationCreated?.();
      onClose?.();
    } catch (error) {
      logger.error("Error creating annotation:", error);
      toast.error("Failed to create annotation");
    } finally {
      setIsCreating(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed z-50 w-80 rounded-md border bg-popover p-4 text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-primary" />
            <h3 className="font-medium text-sm">Create Annotation</h3>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleClose}
            className="h-6 w-6 p-0"
          >
            <X className="h-3 w-3" />
          </Button>
        </div>

        {/* Selected Text */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Selected Text:
          </label>
          <div className="text-xs bg-muted/50 p-2 rounded border max-h-20 overflow-y-auto">
            {selectedText}
          </div>
        </div>

        {/* Note Input */}
        <div>
          <label className="text-xs text-muted-foreground mb-1 block">
            Note:
          </label>
          <textarea
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Add your note here..."
            className="w-full p-2 text-sm border rounded resize-none"
            rows={3}
            autoFocus
          />
        </div>

        {/* Actions */}
        <div className="flex gap-2 pt-2">
          <Button
            size="sm"
            onClick={handleCreateAnnotation}
            disabled={isCreating || !note.trim()}
            className="flex-1"
          >
            {isCreating ? (
              "Creating..."
            ) : (
              <>
                <Plus className="h-3 w-3 mr-1" />
                Create Note
              </>
            )}
          </Button>
          <Button size="sm" variant="ghost" onClick={handleClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
