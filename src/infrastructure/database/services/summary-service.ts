import { AISummaryService } from "../db/models/ai-summary";

export interface AISummaryData {
  filename: string;
  summary: string;
  fileSize: number;
  textLength: number;
  processingTime?: number;
}

export class SummaryService {
  static async createSummary(data: AISummaryData) {
    return await AISummaryService.create(data);
  }

  static async getSummary(filename: string) {
    return await AISummaryService.getByFilename(filename);
  }

  static async getAllSummaries(limit = 50, skip = 0) {
    return await AISummaryService.getAll(limit, skip);
  }

  static async deleteSummary(filename: string) {
    return await AISummaryService.deleteByFilename(filename);
  }
}
