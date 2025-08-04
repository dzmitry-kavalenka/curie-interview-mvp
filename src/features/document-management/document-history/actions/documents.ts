"use server";

import { apiClient } from "@/shared/utils/api-client";

import { UploadsApiResponse } from "../types/document.types";

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

    return { success: true };
  } catch (error) {
    console.error("Error in deleteFileAction:", error);
    throw new Error("Failed to delete file");
  }
}
