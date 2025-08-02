import { join } from "path";
import { existsSync } from "fs";
import { readFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";

import { MAX_PDF_SIZE_MB, MAX_TEXT_LENGTH } from "@/lib/config";
import { extractTextFromPDF } from "@/lib/pdf-utils";
import { generateSummary } from "@/lib/openai-client";
import { connectDB, DatabaseService } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    const { fileUrl } = await request.json();

    if (!fileUrl) {
      return NextResponse.json(
        { error: "File URL is required" },
        { status: 400 }
      );
    }

    // Extract and validate filename
    const filename = fileUrl.split("/").pop();
    if (
      !filename ||
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // Check if summary already exists in MongoDB
    const existingSummary = await DatabaseService.getAISummary(filename);
    if (existingSummary) {
      console.log(`Returning cached summary for ${filename}`);
      return NextResponse.json({
        summary: existingSummary.summary,
        cached: true,
        createdAt: existingSummary.createdAt,
        processingTime: existingSummary.processingTime,
      });
    }

    // Check if file exists
    const uploadsDir = join(process.cwd(), "src", "uploads");
    const filePath = join(uploadsDir, filename);

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Check file size
    const pdfBuffer = await readFile(filePath);
    const fileSizeMB = pdfBuffer.length / (1024 * 1024);

    if (fileSizeMB > MAX_PDF_SIZE_MB) {
      return NextResponse.json(
        {
          error: `PDF too large. Maximum size is ${MAX_PDF_SIZE_MB}MB. Current size: ${fileSizeMB.toFixed(
            1
          )}MB`,
        },
        { status: 400 }
      );
    }

    // Extract text from PDF
    const extractedText = await extractTextFromPDF(pdfBuffer);

    // Check text length
    if (extractedText.length > MAX_TEXT_LENGTH) {
      return NextResponse.json(
        {
          error: `Document too long. Maximum ${MAX_TEXT_LENGTH.toLocaleString()} characters. Current: ${extractedText.length.toLocaleString()} characters`,
        },
        { status: 400 }
      );
    }

    console.log(
      `Processing PDF: ${filename} (${fileSizeMB.toFixed(
        1
      )}MB, ${extractedText.length.toLocaleString()} characters)`
    );

    // Generate summary with timing
    const startTime = Date.now();
    const summary = await generateSummary(extractedText);
    const processingTime = Date.now() - startTime;

    if (!summary) {
      return NextResponse.json(
        { error: "Failed to generate summary" },
        { status: 500 }
      );
    }

    // Store the summary in MongoDB
    await DatabaseService.createAISummary({
      filename,
      summary,
      fileSize: pdfBuffer.length,
      textLength: extractedText.length,
      processingTime,
    });

    return NextResponse.json({
      summary,
      cached: false,
      processingTime,
    });
  } catch (error) {
    console.error("Error generating summary:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
