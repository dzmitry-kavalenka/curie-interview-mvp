import { useState, useEffect } from "react";

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

/**
 * Hook to manage file uploads and summaries
 * @returns {Object} - Object containing file data, loading state, error, selected file, and functions to fetch, delete, and select files
 */
export function useFiles() {
  const [files, setFiles] = useState<FileWithSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

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

  const deleteFile = async (filename: string) => {
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

  const selectFile = (filename: string) => {
    setSelectedFile(filename);
  };

  useEffect(() => {
    fetchUploads();
  }, []);

  return {
    files,
    loading,
    error,
    selectedFile,
    fetchUploads,
    deleteFile,
    selectFile,
  };
}
