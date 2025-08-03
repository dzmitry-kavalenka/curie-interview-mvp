import { NextRequest, NextResponse } from "next/server";

import {
  connectDB,
  DocumentService,
  SummaryService,
  FileService,
} from "@/infrastructure/database/db";
import { logger } from "@/shared/utils/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // Connect to database
    await connectDB();

    const { filename } = await params;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    // Get file with summary
    const fileWithSummary = await FileService.getFileWithSummary(filename);

    if (!fileWithSummary.upload) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json(fileWithSummary);
  } catch (error) {
    logger.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    // Connect to database
    await connectDB();

    const { filename } = await params;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    // Delete both upload and summary records
    const [uploadDeleted, summaryDeleted] = await Promise.all([
      DocumentService.deleteUpload(filename),
      SummaryService.deleteSummary(filename),
    ]);

    return NextResponse.json({
      message: "File deleted successfully",
      uploadDeleted: !!uploadDeleted,
      summaryDeleted: !!summaryDeleted,
    });
  } catch (error) {
    logger.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
