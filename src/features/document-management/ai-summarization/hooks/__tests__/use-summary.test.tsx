import { renderHook, waitFor, act } from "@testing-library/react";
import { toast } from "sonner";

import { generateSummaryAction } from "../../actions";
import { useSummary } from "../use-summary";

// Mock the API client
jest.mock("@/shared/utils/api-client", () => ({
  apiClient: {
    post: jest.fn(),
  },
}));

// Mock the actions
jest.mock("../../actions", () => ({
  generateSummaryAction: jest.fn(),
}));

// Mock sonner toast
jest.mock("sonner", () => ({
  toast: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

describe("useSummary", () => {
  const mockGenerateSummaryAction = generateSummaryAction as jest.Mock;
  const mockToast = toast as jest.Mocked<typeof toast>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should generate summary successfully", async () => {
    const mockResponse = {
      summary: "This is a test summary",
    };

    // Make the mock async to allow state changes to be observed
    mockGenerateSummaryAction.mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve(mockResponse), 0))
    );

    const { result } = renderHook(() => useSummary());

    // Initially should not be generating
    expect(result.current.isGenerating).toBe(false);
    expect(result.current.summary).toBe("");

    // Call generateSummary
    const fileUrl = "test-file-url";

    await act(async () => {
      result.current.generateSummary(fileUrl);
    });

    // Should be generating immediately after calling
    expect(result.current.isGenerating).toBe(true);

    // Wait for the async operation to complete
    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
    });

    expect(result.current.summary).toBe("This is a test summary");
    expect(mockGenerateSummaryAction).toHaveBeenCalledWith({ fileUrl });
    expect(mockToast.success).toHaveBeenCalledWith(
      "Summary generated successfully!",
      {
        description: "Your document has been analyzed and summarized.",
      }
    );
  });

  it("should handle API errors", async () => {
    const error = new Error("API Error");
    mockGenerateSummaryAction.mockRejectedValue(error);

    const { result } = renderHook(() => useSummary());

    const fileUrl = "test-file-url";

    await act(async () => {
      result.current.generateSummary(fileUrl);
    });

    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
    });

    expect(result.current.summary).toBe("");
    expect(mockToast.error).toHaveBeenCalledWith("Summary generation failed", {
      description: "API Error",
      duration: 5000,
    });
  });

  it("should handle error response from API", async () => {
    const mockErrorResponse = {
      error: "Document too long",
    };

    mockGenerateSummaryAction.mockResolvedValue(mockErrorResponse);

    const { result } = renderHook(() => useSummary());

    const fileUrl = "test-file-url";

    await act(async () => {
      result.current.generateSummary(fileUrl);
    });

    await waitFor(() => {
      expect(result.current.isGenerating).toBe(false);
    });

    expect(result.current.summary).toBe("");
    expect(mockToast.error).toHaveBeenCalledWith("Document too long", {
      description: "Please upload a document with less than 50,000 characters.",
      duration: 6000,
    });
  });

  it("should handle empty fileUrl", async () => {
    const { result } = renderHook(() => useSummary());

    await act(async () => {
      result.current.generateSummary("");
    });

    // Should not make API call for empty fileUrl
    expect(mockGenerateSummaryAction).not.toHaveBeenCalled();
    expect(result.current.isGenerating).toBe(false);
    expect(mockToast.error).toHaveBeenCalledWith("No file selected", {
      description: "Please select a file to generate a summary.",
    });
  });

  it("should handle undefined fileUrl", async () => {
    const { result } = renderHook(() => useSummary());

    await act(async () => {
      result.current.generateSummary(undefined);
    });

    // Should not make API call for undefined fileUrl
    expect(mockGenerateSummaryAction).not.toHaveBeenCalled();
    expect(result.current.isGenerating).toBe(false);
    expect(mockToast.error).toHaveBeenCalledWith("No file selected", {
      description: "Please select a file to generate a summary.",
    });
  });
});
