import { NextRequest, NextResponse } from "next/server";
import { connectDB, DatabaseService } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    // Connect to database
    await connectDB();

    const { filename } = params;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    // Get file with summary
    const fileWithSummary = await DatabaseService.getFileWithSummary(filename);

    if (!fileWithSummary.upload) {
      return NextResponse.json({ error: "File not found" }, { status: 404 });
    }

    return NextResponse.json(fileWithSummary);
  } catch (error) {
    console.error("Error fetching file:", error);
    return NextResponse.json(
      { error: "Failed to fetch file" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    // Connect to database
    await connectDB();

    const { filename } = params;

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    // Delete both upload and summary records
    const [uploadDeleted, summaryDeleted] = await Promise.all([
      DatabaseService.deletePDFUpload(filename),
      DatabaseService.deleteAISummary(filename),
    ]);

    return NextResponse.json({
      message: "File deleted successfully",
      uploadDeleted: !!uploadDeleted,
      summaryDeleted: !!summaryDeleted,
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
