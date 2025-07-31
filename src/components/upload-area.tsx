"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UploadCloud, File } from "lucide-react";

export function UploadArea({
  onFileSelect,
}: {
  onFileSelect?: (file: File) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      onFileSelect?.(file);
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div
        className={cn(
          "flex flex-col items-center justify-center h-48 border-2 border-dashed rounded-2xl transition-all cursor-pointer",
          isDragging
            ? "border-blue-500 bg-blue-50"
            : "border-muted hover:border-primary/50"
        )}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <UploadCloud className="w-8 h-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground text-sm">
          Drag and drop a PDF here or click to select a file
        </p>
        <input
          type="file"
          accept="application/pdf"
          ref={inputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {selectedFile && (
        <div className="mt-4 flex items-center justify-between bg-muted rounded-xl px-4 py-3">
          <div className="flex items-center gap-2 text-sm">
            <File className="w-4 h-4 text-muted-foreground" />
            <span className="truncate max-w-[80%]">{selectedFile.name}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedFile(null)}
          >
            Clear
          </Button>
        </div>
      )}
    </div>
  );
}
