import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { logger } from "@/shared/utils/logger";

import { fetchUploadsAction, deleteFileAction } from "../actions/documents";

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

export function useFiles() {
  const [files, setFiles] = useState<FileWithSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const fetchUploads = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetchUploadsAction();
      setFiles(result.files || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch uploads";
      setError(errorMessage);
      logger.error("Error fetching uploads:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteFile = async (filename: string) => {
    try {
      const result = await deleteFileAction(filename);

      setFiles(prev => prev.filter(file => file.upload.filename !== filename));
      if (selectedFile === filename) {
        setSelectedFile(null);
      }

      // Show appropriate success message based on deletion results
      if (result.s3Deleted === false) {
        toast.success("File deleted from database", {
          description:
            "File removed from database but S3 deletion may have failed.",
        });
      } else {
        toast.success("File deleted successfully", {
          description: "File removed from database and storage.",
        });
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to delete file";
      toast.error(errorMessage);
      logger.error("Error deleting file:", err);
    }
  };

  const selectFile = (filename: string) => {
    setSelectedFile(filename);
  };

  useEffect(() => {
    fetchUploads();
  }, [fetchUploads]);

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
