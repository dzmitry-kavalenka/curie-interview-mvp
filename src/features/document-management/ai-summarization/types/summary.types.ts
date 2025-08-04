export interface SummaryRequest {
  fileUrl: string;
}

export interface SummaryResponse {
  summary: string;
  cached?: boolean;
  createdAt?: string;
  processingTime?: number;
}

export interface SummaryError {
  error: string;
}

export type SummaryApiResponse = SummaryResponse | SummaryError;
