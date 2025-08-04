"use server";

import { apiClient } from "@/shared/utils/api-client";

import { UploadsApiResponse } from "../types/document.types";

interface DeleteFileResponse {
  message: string;
  uploadDeleted: boolean;
  summaryDeleted: boolean;
  s3Deleted: boolean;
}

export async function fetchUploadsAction() {
  try {
    const response = await apiClient.get<UploadsApiResponse>("/api/uploads");

    if (response.error) {
      throw new Error(response.error);
    }

    return { files: response.data?.files || [] };
  } catch (error) {
    console.error("Error in fetchUploadsAction:", error);
    throw new Error("Failed to fetch uploads");
  }
}

export async function deleteFileAction(filename: string) {
  try {
    const response = await apiClient.delete(`/api/uploads/${filename}`);

    if (response.error) {
      throw new Error(response.error);
    }

    // Check if S3 deletion was successful
    const data = response.data as DeleteFileResponse;
    if (data.s3Deleted === false) {
      console.warn(
        `File deleted from database but S3 deletion may have failed: ${filename}`
      );
    }

    return {
      success: true,
      s3Deleted: data.s3Deleted,
      uploadDeleted: data.uploadDeleted,
      summaryDeleted: data.summaryDeleted,
    };
  } catch (error) {
    console.error("Error in deleteFileAction:", error);
    throw new Error("Failed to delete file");
  }
}
