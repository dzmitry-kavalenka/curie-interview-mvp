import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/infrastructure/database/db";
import { AnnotationService } from "@/infrastructure/database/services/annotation-service";
import { logger } from "@/shared/utils/logger";

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const fileId = searchParams.get("fileId");
    const pageNumber = searchParams.get("pageNumber");

    if (!fileId) {
      return NextResponse.json(
        { error: "fileId is required" },
        { status: 400 }
      );
    }

    let annotations;
    if (pageNumber) {
      annotations = await AnnotationService.getAnnotationsByFileAndPage(
        fileId,
        parseInt(pageNumber)
      );
    } else {
      annotations = await AnnotationService.getAnnotationsByFile(fileId);
    }

    return NextResponse.json({ annotations });
  } catch (error) {
    logger.error("Error fetching annotations:", error);
    return NextResponse.json(
      { error: "Failed to fetch annotations" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();
    const { fileId, fileName, pageNumber, selectedText, note } = body;

    if (!fileId || !fileName || !pageNumber || !selectedText || !note) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const annotation = await AnnotationService.createAnnotation({
      fileId,
      fileName,
      pageNumber: parseInt(pageNumber),
      selectedText,
      note,
    });

    return NextResponse.json({ annotation }, { status: 201 });
  } catch (error) {
    logger.error("Error creating annotation:", error);
    return NextResponse.json(
      { error: "Failed to create annotation" },
      { status: 500 }
    );
  }
}
