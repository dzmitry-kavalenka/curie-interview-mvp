"use server";

import { apiClient } from "@/shared/utils/api-client";

import { SummaryRequest, SummaryApiResponse } from "../types";

export async function generateSummaryAction(
  request: SummaryRequest
): Promise<SummaryApiResponse> {
  try {
    const response = await apiClient.post<SummaryApiResponse>(
      "/api/summarize",
      request
    );

    if (response.error) {
      return { error: response.error };
    }

    return response.data || { error: "Failed to generate summary" };
  } catch (error) {
    console.error("Error in generateSummaryAction:", error);
    return { error: "Failed to generate summary" };
  }
}
