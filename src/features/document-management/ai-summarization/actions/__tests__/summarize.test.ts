import { apiClient } from "@/shared/utils/api-client";

import {
  SummaryRequest,
  SummaryApiResponse,
  SummaryResponse,
} from "../../types";
import { generateSummaryAction } from "../summarize";

jest.mock("@/shared/utils/api-client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe("generateSummaryAction", () => {
  const mockRequest: SummaryRequest = {
    fileUrl: "https://example.com/test-file.pdf",
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("successful summary generation", () => {
    it("should return summary data when API call succeeds", async () => {
      const mockResponse: SummaryApiResponse = {
        summary: "This is a test summary of the document",
        cached: false,
        createdAt: "2024-01-01T00:00:00Z",
        processingTime: 1500,
      };

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      });

      const result = await generateSummaryAction(mockRequest);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/api/summarize",
        mockRequest
      );
      expect(result).toEqual(mockResponse);
    });

    it("should handle cached summary response", async () => {
      const mockResponse: SummaryApiResponse = {
        summary: "Cached summary content",
        cached: true,
        createdAt: "2024-01-01T00:00:00Z",
        processingTime: 50,
      };

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      });

      const result = await generateSummaryAction(mockRequest);

      expect(result).toEqual(mockResponse);
      expect((result as SummaryResponse).cached).toBe(true);
    });
  });

  describe("error handling", () => {
    it("should return error when API returns error response", async () => {
      const mockError = "Failed to process document";

      mockApiClient.post.mockResolvedValue({
        error: mockError,
      });

      const result = await generateSummaryAction(mockRequest);

      expect(result).toEqual({ error: mockError });
    });

    it("should return error when API response has no data", async () => {
      mockApiClient.post.mockResolvedValue({});

      const result = await generateSummaryAction(mockRequest);

      expect(result).toEqual({ error: "Failed to generate summary" });
    });

    it("should handle network errors", async () => {
      const networkError = new Error("Network error");
      mockApiClient.post.mockRejectedValue(networkError);

      const result = await generateSummaryAction(mockRequest);

      expect(console.error).toHaveBeenCalledWith(
        "Error in generateSummaryAction:",
        networkError
      );
      expect(result).toEqual({ error: "Failed to generate summary" });
    });

    it("should handle unexpected errors", async () => {
      const unexpectedError = "Unexpected error";
      mockApiClient.post.mockRejectedValue(unexpectedError);

      const result = await generateSummaryAction(mockRequest);

      expect(console.error).toHaveBeenCalledWith(
        "Error in generateSummaryAction:",
        unexpectedError
      );
      expect(result).toEqual({ error: "Failed to generate summary" });
    });
  });

  describe("input validation", () => {
    it("should handle empty fileUrl", async () => {
      const requestWithEmptyUrl: SummaryRequest = {
        fileUrl: "",
      };

      mockApiClient.post.mockResolvedValue({
        data: { summary: "Empty file summary" },
      });

      const result = await generateSummaryAction(requestWithEmptyUrl);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/api/summarize",
        requestWithEmptyUrl
      );
      expect(result).toEqual({ summary: "Empty file summary" });
    });

    it("should handle malformed fileUrl", async () => {
      const requestWithMalformedUrl: SummaryRequest = {
        fileUrl: "not-a-valid-url",
      };

      mockApiClient.post.mockResolvedValue({
        data: { summary: "Malformed URL summary" },
      });

      const result = await generateSummaryAction(requestWithMalformedUrl);

      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/api/summarize",
        requestWithMalformedUrl
      );
      expect(result).toEqual({ summary: "Malformed URL summary" });
    });
  });

  describe("API client interaction", () => {
    it("should call API client with correct parameters", async () => {
      const mockResponse: SummaryApiResponse = {
        summary: "Test summary",
      };

      mockApiClient.post.mockResolvedValue({
        data: mockResponse,
      });

      await generateSummaryAction(mockRequest);

      expect(mockApiClient.post).toHaveBeenCalledTimes(1);
      expect(mockApiClient.post).toHaveBeenCalledWith(
        "/api/summarize",
        mockRequest
      );
    });

    it("should handle different file URLs", async () => {
      const differentUrls = [
        "https://example.com/document1.pdf",
        "https://storage.example.com/files/document2.pdf",
        "http://localhost:3000/uploads/document3.pdf",
      ];

      for (const url of differentUrls) {
        const request: SummaryRequest = { fileUrl: url };
        const mockResponse: SummaryApiResponse = {
          summary: `Summary for ${url}`,
        };

        mockApiClient.post.mockResolvedValue({
          data: mockResponse,
        });

        const result = await generateSummaryAction(request);

        expect(mockApiClient.post).toHaveBeenCalledWith(
          "/api/summarize",
          request
        );
        expect(result).toEqual(mockResponse);
      }
    });
  });
});
