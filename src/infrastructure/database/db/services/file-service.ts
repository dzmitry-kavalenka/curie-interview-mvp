import { PDFUploadService } from "../models/pdf-upload";
import { AISummaryService } from "../models/ai-summary";

// Combined service for handling files with summaries
export class FileService {
  // Get a specific file with its summary
  static async getFileWithSummary(filename: string) {
    const [upload, summary] = await Promise.all([
      PDFUploadService.getByFilename(filename),
      AISummaryService.getByFilename(filename),
    ]);

    return {
      upload,
      summary,
    };
  }

  // Get all files with their summaries
  static async getAllFilesWithSummaries(limit = 50, skip = 0) {
    const [uploads, summaries] = await Promise.all([
      PDFUploadService.getAll(limit, skip),
      AISummaryService.getAll(limit, skip),
    ]);

    // Create a map of summaries by filename for quick lookup
    const summaryMap = new Map();
    summaries.forEach((summary) => {
      summaryMap.set(summary.filename, summary);
    });

    // Combine uploads with their summaries
    const filesWithSummaries = uploads.map((upload) => ({
      upload,
      summary: summaryMap.get(upload.filename) || null,
    }));

    return filesWithSummaries;
  }

  // Delete both upload and summary for a file
  static async deleteFileAndSummary(filename: string) {
    const [uploadDeleted, summaryDeleted] = await Promise.all([
      PDFUploadService.deleteByFilename(filename),
      AISummaryService.deleteByFilename(filename),
    ]);

    return {
      uploadDeleted: !!uploadDeleted,
      summaryDeleted: !!summaryDeleted,
    };
  }

  // Get statistics
  static async getStatistics() {
    const [uploadCount, summaryCount] = await Promise.all([
      PDFUploadService.count(),
      AISummaryService.count(),
    ]);

    return {
      totalUploads: uploadCount,
      totalSummaries: summaryCount,
      pendingSummaries: uploadCount - summaryCount,
    };
  }
}
