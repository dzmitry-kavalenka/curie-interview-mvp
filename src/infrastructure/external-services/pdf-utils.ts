import pdfParser from "pdf-parse";
import { logger } from "@/shared/utils/logger";

// Utility function to delay execution
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function extractTextFromPDF(pdfBuffer: Buffer): Promise<string> {
  try {
    const data = await pdfParser(pdfBuffer);
    const extractedText = data.text;

    if (!extractedText || extractedText.trim().length === 0) {
      throw new Error("No text content found in PDF");
    }

    return extractedText.trim();
  } catch (error) {
    logger.error("Error extracting text from PDF:", error);
    throw new Error("Failed to extract text from PDF");
  }
}
