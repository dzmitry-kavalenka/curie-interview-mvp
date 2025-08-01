"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  MessageSquare,
  FileText,
  Bookmark,
  Plus,
  Clock,
  User,
  Loader2,
  Target,
  Settings,
  Lightbulb,
  CheckCircle,
} from "lucide-react";

// Utility function to extract sections from markdown response
function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(
    `## ${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`,
    "i"
  );
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

// Simple markdown formatter
function formatMarkdown(text: string, color: string): string {
  return text
    .replace(/\n/g, "<br>")
    .replace(
      /^- (.+)$/g,
      `<div class="flex items-start gap-3 mb-2"><span class="w-2 h-2 ${color} rounded-full mt-2 flex-shrink-0"></span><span>$1</span></div>`
    )
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/"/g, "&quot;");
}

// Simple section component
function SummarySection({
  title,
  content,
  icon: Icon,
  color,
}: {
  title: string;
  content: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  if (!content) return null;

  return (
    <div
      className={`p-4 border border-${color}-200 rounded-xl bg-gradient-to-br from-${color}-50 to-${color}-100/50 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <h4
        className={`font-semibold text-sm mb-3 flex items-center gap-2 text-${color}-700`}
      >
        <Icon className="h-4 w-4" />
        {title}
      </h4>
      <div
        className={`text-sm text-${color}-900/80 leading-relaxed`}
        dangerouslySetInnerHTML={{
          __html: formatMarkdown(content, `bg-${color}-500`),
        }}
      />
    </div>
  );
}

export function DocumentPanel({ fileUrl }: { fileUrl?: string }) {
  const [summary, setSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);

  const generateSummary = async () => {
    if (!fileUrl) {
      toast.error("No file selected", {
        description: "Please select a file to generate a summary.",
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/summarize", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fileUrl }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate summary");
      }

      setSummary(data.summary);
      toast.success("Summary generated successfully!", {
        description: "Your document has been analyzed and summarized.",
      });
    } catch (error) {
      console.error("Error generating summary:", error);
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

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="p-4 border-b border-border bg-background sticky top-0 z-10">
        <h2 className="font-semibold text-lg truncate">Document Viewer</h2>
        <p className="text-sm text-muted-foreground">
          Interactive PDF Analysis
        </p>
      </div>

      <Tabs defaultValue="summary" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 p-1">
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="annotations" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Notes
          </TabsTrigger>
          <TabsTrigger value="bookmarks" className="flex items-center gap-2">
            <Bookmark className="h-4 w-4" />
            Bookmarks
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="summary" className="h-full">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">AI Summary</h3>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={generateSummary}
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
                    <SummarySection
                      title="Document Overview"
                      content={extractSection(summary, "Document Overview")}
                      icon={FileText}
                      color="blue"
                    />
                    <SummarySection
                      title="Key Points"
                      content={extractSection(summary, "Key Points")}
                      icon={Target}
                      color="green"
                    />
                    <SummarySection
                      title="Technical Details"
                      content={extractSection(summary, "Technical Details")}
                      icon={Settings}
                      color="purple"
                    />
                    <SummarySection
                      title="Claims & Insights"
                      content={extractSection(summary, "Claims & Insights")}
                      icon={Lightbulb}
                      color="orange"
                    />
                    <SummarySection
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
                      Click &quot;Generate&quot; to create an AI-powered summary
                      using fast text extraction and GPT-3.5-turbo. Large
                      documents are automatically split into chunks for better
                      processing.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="annotations" className="h-full">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Annotations & Notes</h3>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Note
                </Button>
              </div>

              <div className="space-y-3">
                <div className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Page 1
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />2 min ago
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    Important section about project requirements
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      John Doe
                    </div>
                    <div className="flex gap-1">
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        important
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        requirements
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
                      <FileText className="h-3 w-3" />
                      Page 3
                    </span>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />5 min ago
                    </span>
                  </div>
                  <p className="text-sm mb-2">
                    Need to review this calculation
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <User className="h-3 w-3" />
                      Jane Smith
                    </div>
                    <div className="flex gap-1">
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        review
                      </span>
                      <span className="text-xs bg-muted px-2 py-1 rounded">
                        calculation
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookmarks" className="h-full">
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Bookmarks</h3>
                <Button size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Bookmark
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-start justify-between p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Bookmark className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">Introduction</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Document overview and objectives
                    </p>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      Page 1
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Bookmark className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">
                        Technical Requirements
                      </p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      System architecture and specifications
                    </p>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      Page 5
                    </span>
                  </div>
                </div>

                <div className="flex items-start justify-between p-3 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Bookmark className="h-4 w-4 text-primary" />
                      <p className="text-sm font-medium">Conclusion</p>
                    </div>
                    <p className="text-xs text-muted-foreground mb-1">
                      Summary and next steps
                    </p>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      Page 12
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
