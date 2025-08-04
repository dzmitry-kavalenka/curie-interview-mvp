import { NextRequest, NextResponse } from "next/server";

import { connectDB, DocumentService } from "@/infrastructure/database/db";
import { storageService } from "@/infrastructure/external-services/storage-service";
import { logger } from "@/shared/utils/logger";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ filename: string }> }
) {
  try {
    const { filename } = await params;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename parameter is required" },
        { status: 400 }
      );
    }

    if (
      filename.includes("..") ||
      filename.includes("/") ||
      filename.includes("\\")
    ) {
      return NextResponse.json({ error: "Invalid filename" }, { status: 400 });
    }

    // Connect to database to get file info
    await connectDB();

    // Get file information from database
    const fileInfo = await DocumentService.getUpload(filename);

    if (!fileInfo) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    const fileUrl = await storageService.getFileUrl(filename);

    if (process.env.NODE_ENV === "production") {
      // Redirect to S3 signed URL in production
      return NextResponse.redirect(fileUrl);
    } else {
      // Serve local file in development
      const fileBuffer = await storageService.getLocalFileBuffer(filename);

      return new NextResponse(Buffer.from(fileBuffer), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `inline; filename="${filename}"`,
          "Cache-Control": "public, max-age=3600",
        },
      });
    }
  } catch (error) {
    logger.error("File fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}
