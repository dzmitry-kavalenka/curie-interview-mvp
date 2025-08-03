import { PDFUploadService } from "../db/models/pdf-upload";
import { AISummaryService } from "../db/models/ai-summary";

export interface FileWithSummary {
  upload: unknown;
  summary: unknown | null;
}

export class FileService {
  static async getFileWithSummary(filename: string): Promise<FileWithSummary> {
    const [upload, summary] = await Promise.all([
      PDFUploadService.getByFilename(filename),
      AISummaryService.getByFilename(filename),
    ]);

    return {
      upload,
      summary,
    };
  }

  static async getAllFilesWithSummaries(
    limit = 50,
    skip = 0
  ): Promise<FileWithSummary[]> {
    const uploads = await PDFUploadService.getAll(limit, skip);
    const summaries = await AISummaryService.getAll(limit, skip);

    // Create a map of summaries by filename for efficient lookup
    const summaryMap = new Map();
    summaries.forEach((summary) => {
      summaryMap.set(summary.filename, summary);
    });

    // Combine uploads with their summaries
    return uploads.map((upload) => ({
      upload,
      summary: summaryMap.get(upload.filename) || null,
    }));
  }
}
