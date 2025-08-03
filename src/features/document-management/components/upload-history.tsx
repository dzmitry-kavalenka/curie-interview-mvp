"use client";

import { useEffect } from "react";

import { EmptyState } from "@/shared/components/common/empty-state";
import { ErrorState } from "@/shared/components/common/error-state";
import { LoadingState } from "@/shared/components/common/loading-state";

import { useFiles } from "../hooks/use-files";

import { FileCard } from "./file-card";

interface UploadHistoryProps {
  onFileSelect?: (filename: string) => void;
  onFileCountUpdate?: (count: number) => void;
}

export function UploadHistory({
  onFileSelect,
  onFileCountUpdate,
}: UploadHistoryProps) {
  const {
    files,
    loading,
    error,
    selectedFile,
    fetchUploads,
    deleteFile,
    selectFile,
  } = useFiles();

  useEffect(() => {
    onFileCountUpdate?.(files.length);
  }, [files.length, onFileCountUpdate]);

  const handleFileSelect = (filename: string) => {
    selectFile(filename);
    onFileSelect?.(filename);
  };

  const handleDeleteFile = async (filename: string) => {
    await deleteFile(filename);
  };

  if (loading) {
    return <LoadingState message="Loading upload history..." />;
  }

  if (error) {
    return (
      <ErrorState
        title="Failed to load uploads"
        message={error}
        onRetry={fetchUploads}
      />
    );
  }

  if (files.length === 0) {
    return (
      <EmptyState
        title="No files uploaded yet"
        message="Upload your first PDF to see it appear here with its AI summary"
      />
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {files.map(file => (
            <FileCard
              key={file.upload._id}
              file={file}
              onSelect={handleFileSelect}
              onDelete={handleDeleteFile}
              isSelected={selectedFile === file.upload.filename}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
