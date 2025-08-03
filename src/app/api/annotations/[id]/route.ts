import { NextRequest, NextResponse } from "next/server";

import { connectDB } from "@/infrastructure/database/db";
import { AnnotationService } from "@/infrastructure/database/services/annotation-service";
import { logger } from "@/shared/utils/logger";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    const body = await request.json();
    const { note } = body;

    const annotation = await AnnotationService.updateAnnotation(id, {
      note,
    });

    return NextResponse.json({ annotation });
  } catch (error) {
    logger.error("Error updating annotation:", error);
    return NextResponse.json(
      { error: "Failed to update annotation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await params;
    await AnnotationService.deleteAnnotation(id);

    return NextResponse.json({ message: "Annotation deleted successfully" });
  } catch (error) {
    logger.error("Error deleting annotation:", error);
    return NextResponse.json(
      { error: "Failed to delete annotation" },
      { status: 500 }
    );
  }
}
