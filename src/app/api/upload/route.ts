import { randomUUID } from "crypto";
import { existsSync } from "fs";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";

import { NextRequest, NextResponse } from "next/server";

import { connectDB, DocumentService } from "@/infrastructure/database/db";
import { logger } from "@/shared/utils/logger";

// MVP Configuration - Match summarize route limits
const MAX_PDF_SIZE_MB = 5; // Maximum PDF size in MB (same as summarize route)
const MAX_PDF_SIZE_BYTES = MAX_PDF_SIZE_MB * 1024 * 1024;

export interface UploadResponse {
  message: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  path: string;
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type (PDF only)
    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Validate file size (5MB limit to match summarize route)
    if (file.size > MAX_PDF_SIZE_BYTES) {
      const fileSizeMB = (file.size / (1024 * 1024)).toFixed(1);
      return NextResponse.json(
        {
          error: `PDF too large. Maximum size is ${MAX_PDF_SIZE_MB}MB. Current size: ${fileSizeMB}MB`,
        },
        { status: 400 }
      );
    }

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "src", "uploads");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Generate unique filename
    const uuid = randomUUID();
    const originalName = file.name;
    const uniqueFilename = `${uuid}.pdf`;

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save file to uploads directory
    const filePath = join(uploadsDir, uniqueFilename);
    await writeFile(filePath, buffer);

    // Store upload information in MongoDB
    const uploadData = {
      filename: uniqueFilename,
      originalName: originalName,
      size: file.size,
      type: file.type,
      path: `/api/files/${uniqueFilename}`,
      filePath: filePath,
    };

    await DocumentService.createUpload(uploadData);

    logger.upload(`File uploaded: ${originalName} -> ${uniqueFilename}`, {
      originalName,
      filename: uniqueFilename,
      size: `${(file.size / (1024 * 1024)).toFixed(1)}MB`,
    });

    return NextResponse.json({
      message: "File uploaded successfully",
      filename: uniqueFilename,
      originalName: originalName,
      size: file.size,
      type: file.type,
      path: `/api/files/${uniqueFilename}`,
    });
  } catch (error) {
    logger.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
