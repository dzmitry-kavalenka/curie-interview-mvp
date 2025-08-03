export interface UploadRecord {
  _id: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  path: string;
  uploadedAt: string;
  filePath: string;
}

export interface UploadResponse {
  message: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  path: string;
}

export interface FileWithSummary {
  upload: UploadRecord;
  summary: SummaryRecord | null;
}

export interface SummaryRecord {
  _id: string;
  filename: string;
  summary: string;
  fileSize: number;
  textLength: number;
  processingTime?: number;
  createdAt: string;
}
