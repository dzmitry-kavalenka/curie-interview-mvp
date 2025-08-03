"use client";

import {
  MessageSquare,
  FileText,
  Clock,
  Loader2,
  Target,
  Settings,
  Lightbulb,
  CheckCircle,
  ArrowLeft,
  Edit,
  Trash2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { SummarySection } from "@/shared/components/common/summary-section";
import { Button } from "@/shared/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { logger } from "@/shared/utils/logger";
import { extractSection } from "@/shared/utils/markdown-utils";

interface Annotation {
  _id: string;
  fileId: string;
  fileName: string;
  pageNumber: number;
  selectedText: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

interface DocumentPanelProps {
  fileUrl?: string;
  fileId?: string;
  refreshTrigger?: number;
}

export function DocumentPanel({
  fileUrl,
  fileId,
  refreshTrigger,
}: DocumentPanelProps) {
  const [summary, setSummary] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isLoadingAnnotations, setIsLoadingAnnotations] = useState(false);
  const [editingAnnotation, setEditingAnnotation] = useState<string | null>(
    null
  );
  const router = useRouter();

  const loadAnnotations = useCallback(async () => {
    if (!fileId) return;

    setIsLoadingAnnotations(true);
    try {
      const response = await fetch(`/api/annotations?fileId=${fileId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to load annotations");
      }

      setAnnotations(data.annotations);
    } catch (error) {
      logger.error("Error loading annotations:", error);
      toast.error("Failed to load annotations");
    } finally {
      setIsLoadingAnnotations(false);
    }
  }, [fileId]);

  // Load annotations when fileId changes
  useEffect(() => {
    if (fileId) {
      loadAnnotations();
    }
  }, [fileId, loadAnnotations]);

  // Refresh annotations when refreshTrigger changes
  useEffect(() => {
    if (fileId && refreshTrigger) {
      loadAnnotations();
    }
  }, [refreshTrigger, loadAnnotations, fileId]);

  const handleBack = () => {
    router.back();
  };

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

  const handleUpdateAnnotation = async (annotationId: string, note: string) => {
    try {
      const response = await fetch(`/api/annotations/${annotationId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to update annotation");
      }

      setAnnotations(prev =>
        prev.map(ann => (ann._id === annotationId ? data.annotation : ann))
      );
      setEditingAnnotation(null);
      toast.success("Annotation updated successfully!");
    } catch (error) {
      logger.error("Error updating annotation:", error);
      toast.error("Failed to update annotation");
    }
  };

  const handleDeleteAnnotation = async (annotationId: string) => {
    try {
      const response = await fetch(`/api/annotations/${annotationId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete annotation");
      }

      setAnnotations(prev => prev.filter(ann => ann._id !== annotationId));
      toast.success("Annotation deleted successfully!");
    } catch (error) {
      logger.error("Error deleting annotation:", error);
      toast.error("Failed to delete annotation");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60)
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`;
    if (diffInMinutes < 1440)
      return `${Math.floor(diffInMinutes / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="flex flex-col h-full">
      {/* Fixed Header */}
      <div className="p-4 border-b border-border bg-background sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleBack}
            className="h-8 w-8 p-0 hover:bg-muted"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h2 className="font-semibold text-lg truncate">Document Viewer</h2>
        </div>
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
                <div className="text-xs text-muted-foreground">
                  Select text in the PDF to create annotations
                </div>
              </div>

              {/* Existing Annotations */}
              <div className="space-y-3">
                {isLoadingAnnotations ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : annotations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No annotations yet</p>
                    <p className="text-xs">
                      Select text in the PDF to create your first note
                    </p>
                  </div>
                ) : (
                  annotations.map(annotation => (
                    <div
                      key={annotation._id}
                      className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          Page {annotation.pageNumber}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatDate(annotation.createdAt)}
                        </span>
                      </div>

                      <div className="mb-2">
                        <div className="text-xs text-muted-foreground mb-1">
                          Selected Text:
                        </div>
                        <div className="text-xs bg-muted/50 p-2 rounded mb-2 max-h-16 overflow-y-auto">
                          {annotation.selectedText}
                        </div>
                      </div>

                      {editingAnnotation === annotation._id ? (
                        <div className="space-y-2">
                          <textarea
                            value={annotation.note}
                            onChange={e => {
                              setAnnotations(prev =>
                                prev.map(ann =>
                                  ann._id === annotation._id
                                    ? { ...ann, note: e.target.value }
                                    : ann
                                )
                              );
                            }}
                            className="w-full p-2 text-sm border rounded resize-none"
                            rows={3}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() =>
                                handleUpdateAnnotation(
                                  annotation._id,
                                  annotation.note
                                )
                              }
                            >
                              Save
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => setEditingAnnotation(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="text-sm mb-2">{annotation.note}</p>
                      )}

                      <div className="flex gap-1 mt-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingAnnotation(annotation._id)}
                          className="h-6 px-2"
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAnnotation(annotation._id)}
                          className="h-6 px-2 text-destructive"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
