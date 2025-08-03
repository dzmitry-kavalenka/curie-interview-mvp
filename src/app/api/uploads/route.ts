import { NextRequest, NextResponse } from "next/server";
import { connectDB, FileService } from "@/infrastructure/database/db";
import { logger } from "@/shared/utils/logger";

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await connectDB();

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = parseInt(searchParams.get("skip") || "0");

    // Get all files with their summaries
    const filesWithSummaries = await FileService.getAllFilesWithSummaries(
      limit,
      skip
    );

    return NextResponse.json({
      files: filesWithSummaries,
      total: filesWithSummaries.length,
      limit,
      skip,
    });
  } catch (error) {
    logger.error("Error fetching uploads:", error);
    return NextResponse.json(
      { error: "Failed to fetch uploads" },
      { status: 500 }
    );
  }
}
