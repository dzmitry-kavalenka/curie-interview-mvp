import { SummarySection } from "@/features/document-management/ai-summarization/components";

interface SummaryTabProps {
  summary: string;
  isGenerating: boolean;
  fileUrl?: string;
  onGenerateSummary: (fileUrl?: string) => Promise<void>;
}

export function SummaryTab({
  summary,
  isGenerating,
  fileUrl,
  onGenerateSummary,
}: SummaryTabProps) {
  return (
    <SummarySection
      summary={summary}
      isGenerating={isGenerating}
      fileUrl={fileUrl}
      onGenerateSummary={onGenerateSummary}
    />
  );
}
