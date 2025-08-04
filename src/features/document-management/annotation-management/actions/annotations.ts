"use server";

import { apiClient } from "@/shared/utils/api-client";

import { AnnotationResponse, SingleAnnotationResponse } from "../types";

export async function getAnnotationsAction(
  fileId: string
): Promise<AnnotationResponse> {
  try {
    const response = await apiClient.get<AnnotationResponse>(
      "/api/annotations",
      {
        fileId,
      }
    );

    if (response.error) {
      throw new Error(response.error);
    }

    return response.data || { annotations: [] };
  } catch (error) {
    console.error("Error in getAnnotationsAction:", error);
    return { annotations: [] };
  }
}

export async function updateAnnotationAction(
  annotationId: string,
  note: string
): Promise<SingleAnnotationResponse> {
  try {
    const response = await apiClient.put<SingleAnnotationResponse>(
      `/api/annotations/${annotationId}`,
      { note }
    );

    if (response.error) {
      throw new Error(response.error);
    }

    if (!response.data) {
      throw new Error("Failed to update annotation");
    }

    return response.data;
  } catch (error) {
    console.error("Error in updateAnnotationAction:", error);
    throw error;
  }
}

export async function deleteAnnotationAction(
  annotationId: string
): Promise<void> {
  try {
    const response = await apiClient.delete(`/api/annotations/${annotationId}`);

    if (response.error) {
      throw new Error(response.error);
    }
  } catch (error) {
    console.error("Error in deleteAnnotationAction:", error);
    throw error;
  }
}
