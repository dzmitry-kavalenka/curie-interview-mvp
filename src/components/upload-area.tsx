"use client";

import { useState, useRef } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { UploadCloud, File, Loader2, CheckCircle, XCircle } from "lucide-react";

export function UploadArea({
  onFileSelect,
}: {
  onFileSelect?: (file: File) => void;
}) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [uploadMessage, setUploadMessage] = useState("");
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  async function uploadFile(file: File) {
    setIsUploading(true);
    setUploadStatus("idle");
    setUploadMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUploadStatus("success");
        setUploadMessage("File uploaded successfully!");
        onFileSelect?.(file);
      } else {
        setUploadStatus("error");
        setUploadMessage(result.error || "Upload failed");
      }
    } catch (error) {
      setUploadStatus("error");
      setUploadMessage("Network error occurred");
    } finally {
      setIsUploading(false);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      uploadFile(file);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setSelectedFile(file);
      uploadFile(file);
    }
  }

  function handleClear() {
    setSelectedFile(null);
    setUploadStatus("idle");
    setUploadMessage("");
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
            <span className="truncate max-w-[60%]">{selectedFile.name}</span>
            {isUploading && <Loader2 className="w-4 h-4 animate-spin" />}
            {uploadStatus === "success" && (
              <CheckCircle className="w-4 h-4 text-green-500" />
            )}
            {uploadStatus === "error" && (
              <XCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
          <div className="flex items-center gap-2">
            {uploadMessage && (
              <span
                className={cn(
                  "text-xs",
                  uploadStatus === "success" ? "text-green-600" : "text-red-600"
                )}
              >
                {uploadMessage}
              </span>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleClear}
              disabled={isUploading}
            >
              Clear
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
