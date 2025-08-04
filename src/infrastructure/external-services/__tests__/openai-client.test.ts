import { generateSummary } from "../openai-client";

jest.mock("@/shared/config/config", () => ({
  MAX_RETRIES: 3,
  RETRY_DELAY_MS: 1000,
  OPENAI_MODEL: "gpt-3.5-turbo",
  OPENAI_MAX_TOKENS: 1000,
  OPENAI_TEMPERATURE: 0.3,
}));

jest.mock("../prompts", () => ({
  SUMMARY_SYSTEM_PROMPT: "You are an expert document analyst",
  SUMMARY_USER_PROMPT_TEMPLATE: "Summarize this text: {text}",
}));

jest.mock("../pdf-utils", () => ({
  delay: jest.fn().mockResolvedValue(undefined),
}));

// Mock the entire openai-client module
jest.mock("../openai-client", () => ({
  generateSummary: jest.fn(),
}));

describe("OpenAI Client", () => {
  const mockGenerateSummary = generateSummary as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("generateSummary", () => {
    it("should generate a summary successfully", async () => {
      mockGenerateSummary.mockResolvedValue(
        "This is a test summary of the document."
      );

      const text = "This is a sample document text for testing.";
      const result = await generateSummary(text);

      expect(result).toBe("This is a test summary of the document.");
      expect(mockGenerateSummary).toHaveBeenCalledWith(text);
    });

    it("should handle OpenAI API errors", async () => {
      const error = new Error("OpenAI API error");
      mockGenerateSummary.mockRejectedValue(error);

      const text = "Test document text";

      await expect(generateSummary(text)).rejects.toThrow("OpenAI API error");
    });

    it("should handle empty text input", async () => {
      mockGenerateSummary.mockResolvedValue("No content to summarize.");

      const result = await generateSummary("");
      expect(result).toBe("No content to summarize.");
    });
  });
});
