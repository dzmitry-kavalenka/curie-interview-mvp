import {
  FileText,
  Target,
  Settings,
  Lightbulb,
  CheckCircle,
  Loader2,
} from "lucide-react";

import { SummarySection as SharedSummarySection } from "@/shared/components/common/summary-section";
import { Button } from "@/shared/components/ui/button";
import { extractSection } from "@/shared/utils/markdown-utils";

interface SummarySectionProps {
  summary: string;
  isGenerating: boolean;
  fileUrl?: string;
  onGenerateSummary: (fileUrl?: string) => Promise<void>;
}

export function SummarySection({
  summary,
  isGenerating,
  fileUrl,
  onGenerateSummary,
}: SummarySectionProps) {
  return (
    <div className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">AI Summary</h3>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onGenerateSummary(fileUrl)}
          disabled={isGenerating || !fileUrl}
        >
          {isGenerating ? (
            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
          ) : (
            <FileText className="h-4 w-4 mr-1" />
          )}
          {isGenerating ? "Generating..." : "Generate"}
        </Button>
      </div>

      <div className="space-y-4">
        {summary ? (
          <>
            <SharedSummarySection
              title="Document Overview"
              content={extractSection(summary, "Document Overview")}
              icon={FileText}
              color="blue"
            />
            <SharedSummarySection
              title="Key Points"
              content={extractSection(summary, "Key Points")}
              icon={Target}
              color="green"
            />
            <SharedSummarySection
              title="Technical Details"
              content={extractSection(summary, "Technical Details")}
              icon={Settings}
              color="purple"
            />
            <SharedSummarySection
              title="Claims & Insights"
              content={extractSection(summary, "Claims & Insights")}
              icon={Lightbulb}
              color="orange"
            />
            <SharedSummarySection
              title="Summary"
              content={extractSection(summary, "Summary")}
              icon={CheckCircle}
              color="emerald"
            />
          </>
        ) : (
          <div className="p-4 border border-blue-200 rounded-xl bg-gradient-to-br from-blue-50 to-blue-100/50 shadow-sm">
            <h4 className="font-semibold text-sm mb-3 flex items-center gap-2 text-blue-700">
              <FileText className="h-4 w-4" />
              Document Overview
            </h4>
            <p className="text-sm text-blue-900/80 leading-relaxed">
              Click &quot;Generate&quot; to create an AI-powered summary using
              fast text extraction and GPT-3.5-turbo. Large documents are
              automatically split into chunks for better processing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
