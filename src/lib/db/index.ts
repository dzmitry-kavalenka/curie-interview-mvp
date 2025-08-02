// Database connection
export { connectDB, disconnectDB } from "./connection";

// Models
export { PDFUpload, PDFUploadService } from "./models/pdf-upload";
export { AISummary, AISummaryService } from "./models/ai-summary";

// Services
import { FileService } from "./services/file-service";

// Legacy DatabaseService for backward compatibility
import { PDFUploadService } from "./models/pdf-upload";
import { AISummaryService } from "./models/ai-summary";

export class DatabaseService {
  // PDF Upload methods (legacy)
  static async createPDFUpload(data: {
    filename: string;
    originalName: string;
    size: number;
    type: string;
    path: string;
    filePath: string;
  }) {
    return await PDFUploadService.create(data);
  }

  static async getPDFUpload(filename: string) {
    return await PDFUploadService.getByFilename(filename);
  }

  static async getAllPDFUploads(limit = 50, skip = 0) {
    return await PDFUploadService.getAll(limit, skip);
  }

  static async deletePDFUpload(filename: string) {
    return await PDFUploadService.deleteByFilename(filename);
  }

  // AI Summary methods (legacy)
  static async createAISummary(data: {
    filename: string;
    summary: string;
    fileSize: number;
    textLength: number;
    processingTime?: number;
  }) {
    return await AISummaryService.create(data);
  }

  static async getAISummary(filename: string) {
    return await AISummaryService.getByFilename(filename);
  }

  static async getAllAISummaries(limit = 50, skip = 0) {
    return await AISummaryService.getAll(limit, skip);
  }

  static async deleteAISummary(filename: string) {
    return await AISummaryService.deleteByFilename(filename);
  }

  // Combined methods (legacy)
  static async getFileWithSummary(filename: string) {
    return await FileService.getFileWithSummary(filename);
  }

  static async getAllFilesWithSummaries(limit = 50, skip = 0) {
    return await FileService.getAllFilesWithSummaries(limit, skip);
  }
}
