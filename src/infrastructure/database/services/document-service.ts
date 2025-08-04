import { PDFUploadService } from "../db/models/pdf-upload";

export interface PDFUploadData {
  filename: string;
  originalName: string;
  size: number;
  type: string;
  path: string;
  filePath?: string;
  s3Key?: string;
  s3Url?: string;
}

export class DocumentService {
  static async createUpload(data: PDFUploadData) {
    return await PDFUploadService.create(data);
  }

  static async getUpload(filename: string) {
    return await PDFUploadService.getByFilename(filename);
  }

  static async getAllUploads(limit = 50, skip = 0) {
    return await PDFUploadService.getAll(limit, skip);
  }

  static async deleteUpload(filename: string) {
    return await PDFUploadService.deleteByFilename(filename);
  }

  static async getUploadCount() {
    return await PDFUploadService.count();
  }
}
