export interface DocumentHistory {
  _id: string;
  fileName: string;
  fileUrl: string;
  uploadedAt: string;
  lastAccessedAt?: string;
  fileSize: number;
  summary?: string;
  annotationCount: number;
}

export interface DocumentHistoryResponse {
  documents: DocumentHistory[];
}

export interface DocumentHistoryFilters {
  dateRange?: {
    start: string;
    end: string;
  };
  fileType?: string;
  hasSummary?: boolean;
  hasAnnotations?: boolean;
}

// Types for the actual API response structure
export interface PDFUpload {
  _id: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  path: string;
  uploadedAt: string;
  filePath: string;
  createdAt: string;
  updatedAt: string;
}

export interface AISummary {
  _id: string;
  filename: string;
  summary: string;
  fileSize: number;
  textLength: number;
  processingTime?: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileWithSummary {
  upload: PDFUpload;
  summary: AISummary | null;
}

export interface UploadsApiResponse {
  files: FileWithSummary[];
  total: number;
  limit: number;
  skip: number;
}
