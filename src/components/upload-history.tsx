"use client";

import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { FileText, Clock, Download, Trash2, Eye, FileIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface UploadRecord {
  _id: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  path: string;
  uploadedAt: string;
  filePath: string;
}

interface SummaryRecord {
  _id: string;
  filename: string;
  summary: string;
  fileSize: number;
  textLength: number;
  processingTime?: number;
  createdAt: string;
}

interface FileWithSummary {
  upload: UploadRecord;
  summary: SummaryRecord | null;
}

interface UploadHistoryProps {
  onFileSelect?: (filename: string) => void;
  onFileCountUpdate?: (count: number) => void;
}

export function UploadHistory({
  onFileSelect,
  onFileCountUpdate,
}: UploadHistoryProps) {
  const [files, setFiles] = useState<FileWithSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  useEffect(() => {
    fetchUploads();
  }, []);

  useEffect(() => {
    onFileCountUpdate?.(files.length);
  }, [files.length, onFileCountUpdate]);

  const fetchUploads = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/uploads");
      if (!response.ok) {
        throw new Error("Failed to fetch uploads");
      }
      const data = await response.json();
      setFiles(data.files || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch uploads");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (filename: string) => {
    setSelectedFile(filename);
    onFileSelect?.(filename);
  };

  const handleDeleteFile = async (filename: string) => {
    if (!confirm("Are you sure you want to delete this file?")) {
      return;
    }

    try {
      const response = await fetch(`/api/uploads/${filename}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete file");
      }

      // Refresh the list
      await fetchUploads();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete file");
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatProcessingTime = (ms?: number) => {
    if (!ms) return "N/A";
    return `${ms}ms`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
        <p className="text-gray-500 text-sm">Loading upload history...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full">
        <div className="bg-red-50 rounded-full p-3 mb-4">
          <svg
            className="h-6 w-6 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <p className="text-red-600 font-medium mb-2">Failed to load uploads</p>
        <p className="text-gray-500 text-sm mb-4">{error}</p>
        <Button onClick={fetchUploads} variant="outline" size="sm">
          Try Again
        </Button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 h-full">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <FileIcon className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="font-medium text-gray-900 mb-2">
          No files uploaded yet
        </h3>
        <p className="text-gray-500 text-sm text-center max-w-sm">
          Upload your first PDF to see it appear here with its AI summary
        </p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mx-4 mt-4">
            <TabsTrigger value="all">All Files</TabsTrigger>
            <TabsTrigger value="summarized">Summarized</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-2 p-4">
            {files.map((file) => (
              <FileCard
                key={file.upload._id}
                file={file}
                onSelect={handleFileSelect}
                onDelete={handleDeleteFile}
                isSelected={selectedFile === file.upload.filename}
              />
            ))}
          </TabsContent>

          <TabsContent value="summarized" className="space-y-2 p-4">
            {files
              .filter((file) => file.summary)
              .map((file) => (
                <FileCard
                  key={file.upload._id}
                  file={file}
                  onSelect={handleFileSelect}
                  onDelete={handleDeleteFile}
                  isSelected={selectedFile === file.upload.filename}
                />
              ))}
          </TabsContent>

          <TabsContent value="pending" className="space-y-2 p-4">
            {files
              .filter((file) => !file.summary)
              .map((file) => (
                <FileCard
                  key={file.upload._id}
                  file={file}
                  onSelect={handleFileSelect}
                  onDelete={handleDeleteFile}
                  isSelected={selectedFile === file.upload.filename}
                />
              ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

interface FileCardProps {
  file: FileWithSummary;
  onSelect: (filename: string) => void;
  onDelete: (filename: string) => void;
  isSelected: boolean;
}

function FileCard({ file, onSelect, onDelete, isSelected }: FileCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatProcessingTime = (ms?: number) => {
    if (!ms) return "N/A";
    return `${ms}ms`;
  };

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-colors ${
        isSelected
          ? "border-blue-500 bg-blue-50"
          : "border-gray-200 hover:border-gray-300"
      }`}
      onClick={() => onSelect(file.upload.filename)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <h3 className="font-medium text-sm truncate">
              {file.upload.originalName}
            </h3>
            {file.summary && (
              <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                Summarized
              </span>
            )}
          </div>

          <div className="space-y-1 text-xs text-gray-500">
            <div className="flex items-center gap-4">
              <span>{formatFileSize(file.upload.size)}</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDistanceToNow(new Date(file.upload.uploadedAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {file.summary && (
              <div className="flex items-center gap-4">
                <span>
                  Text: {file.summary.textLength.toLocaleString()} chars
                </span>
                <span>
                  Processing:{" "}
                  {formatProcessingTime(file.summary.processingTime)}
                </span>
              </div>
            )}
          </div>

          {file.summary && (
            <p className="text-xs text-gray-600 mt-2 line-clamp-2">
              {file.summary.summary}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 ml-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(file.upload.filename);
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(file.upload.filename);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
