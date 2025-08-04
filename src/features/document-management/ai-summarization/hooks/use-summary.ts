import { useState } from "react";
import { toast } from "sonner";

import { logger } from "@/shared/utils/logger";

import { generateSummaryAction } from "../actions";

export function useSummary() {
  const [summary, setSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async (fileUrl?: string) => {
    if (!fileUrl) {
      toast.error("No file selected", {
        description: "Please select a file to generate a summary.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const data = await generateSummaryAction({ fileUrl });

      if ("error" in data) {
        throw new Error(data.error);
      }

      if ("summary" in data) {
        setSummary(data.summary);
        toast.success("Summary generated successfully!", {
          description: "Your document has been analyzed and summarized.",
        });
      } else {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      logger.error("Error generating summary:", error);
      const errorMessage =
        error instanceof Error ? error.message : "Failed to generate summary";

      if (errorMessage.includes("PDF too large")) {
        toast.error("File too large", {
          description: "Please upload a PDF smaller than 5MB.",
          duration: 6000,
        });
      } else if (errorMessage.includes("Document too long")) {
        toast.error("Document too long", {
          description:
            "Please upload a document with less than 50,000 characters.",
          duration: 6000,
        });
      } else if (errorMessage.includes("Rate limit")) {
        toast.error("Rate limit exceeded", {
          description: "Please wait a moment and try again.",
          duration: 5000,
        });
      } else {
        toast.error("Summary generation failed", {
          description: errorMessage,
          duration: 5000,
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    summary,
    isGenerating,
    generateSummary,
  };
}
