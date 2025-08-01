import { writeFile, readFile, readdir, mkdir, unlink } from "fs/promises";
import { existsSync } from "fs";
import { join } from "path";

export interface SummaryData {
  filename: string;
  summary: string;
  createdAt: string;
  fileSize: number;
  textLength: number;
  processingTime?: number;
}

export class SummaryStorage {
  private static readonly STORAGE_DIR = join(
    process.cwd(),
    "src",
    "storage",
    "summaries"
  );

  /**
   * Store a summary for a given filename
   */
  static async storeSummary(
    filename: string,
    summary: string,
    metadata: Omit<SummaryData, "filename" | "summary">
  ): Promise<void> {
    try {
      // Ensure storage directory exists
      if (!existsSync(this.STORAGE_DIR)) {
        await mkdir(this.STORAGE_DIR, { recursive: true });
      }

      const summaryData: SummaryData = {
        filename,
        summary,
        ...metadata,
      };

      const summaryPath = join(this.STORAGE_DIR, `${filename}.json`);
      await writeFile(summaryPath, JSON.stringify(summaryData, null, 2));

      console.log(`Summary stored for ${filename}`);
    } catch (error) {
      console.error("Error storing summary:", error);
      throw new Error("Failed to store summary");
    }
  }

  /**
   * Retrieve a summary for a given filename
   */
  static async getSummary(filename: string): Promise<SummaryData | null> {
    try {
      const summaryPath = join(this.STORAGE_DIR, `${filename}.json`);

      if (!existsSync(summaryPath)) {
        return null;
      }

      const data = await readFile(summaryPath, "utf-8");
      return JSON.parse(data) as SummaryData;
    } catch (error) {
      console.error("Error retrieving summary:", error);
      return null;
    }
  }

  /**
   * Check if a summary exists for a filename
   */
  static async hasSummary(filename: string): Promise<boolean> {
    const summaryPath = join(this.STORAGE_DIR, `${filename}.json`);
    return existsSync(summaryPath);
  }

  /**
   * Delete a summary for a filename
   */
  static async deleteSummary(filename: string): Promise<void> {
    try {
      const summaryPath = join(this.STORAGE_DIR, `${filename}.json`);
      if (existsSync(summaryPath)) {
        await unlink(summaryPath);
        console.log(`Summary deleted for ${filename}`);
      }
    } catch (error) {
      console.error("Error deleting summary:", error);
      throw new Error("Failed to delete summary");
    }
  }

  /**
   * Get all stored summaries (for admin/debug purposes)
   */
  static async getAllSummaries(): Promise<SummaryData[]> {
    try {
      if (!existsSync(this.STORAGE_DIR)) {
        return [];
      }

      const files = await readdir(this.STORAGE_DIR);
      const summaries: SummaryData[] = [];

      for (const file of files) {
        if (file.endsWith(".json")) {
          const data = await readFile(join(this.STORAGE_DIR, file), "utf-8");
          summaries.push(JSON.parse(data));
        }
      }

      return summaries.sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
    } catch (error) {
      console.error("Error getting all summaries:", error);
      return [];
    }
  }
}
