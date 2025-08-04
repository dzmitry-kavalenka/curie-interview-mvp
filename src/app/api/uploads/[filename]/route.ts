import { NextRequest, NextResponse } from "next/server";

import {
  connectDB,
  DocumentService,
  SummaryService,
  FileService,
} from "@/infrastructure/database/db";
import { storageService } from "@/infrastructure/external-services/storage-service";
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

    // Get upload record to get S3 key before deletion
    const uploadRecord = await DocumentService.getUpload(filename);

    if (!uploadRecord) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    // Delete from S3 first (if S3 key exists)
    let s3Deleted = false;
    if (uploadRecord.s3Key) {
      try {
        await storageService.deleteFileByKey(uploadRecord.s3Key);
        s3Deleted = true;
        logger.info(
          `File deleted from S3: ${filename} (key: ${uploadRecord.s3Key})`
        );
      } catch (error) {
        logger.error(
          `Failed to delete file from S3: ${filename} (key: ${uploadRecord.s3Key})`,
          error
        );
        // Continue with database deletion even if S3 deletion fails
      }
    }

    // Delete both upload and summary records from database
    const [uploadDeleted, summaryDeleted] = await Promise.all([
      DocumentService.deleteUpload(filename),
      SummaryService.deleteSummary(filename),
    ]);

    return NextResponse.json({
      message: "File deleted successfully",
      uploadDeleted: !!uploadDeleted,
      summaryDeleted: !!summaryDeleted,
      s3Deleted,
    });
  } catch (error) {
    logger.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
