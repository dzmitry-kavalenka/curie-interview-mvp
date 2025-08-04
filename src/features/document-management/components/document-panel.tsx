"use client";

import { FileText } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

import { SummaryTab } from "../ai-summarization/components/summary-tab";
import { useSummary } from "../ai-summarization/hooks";
import { AnnotationsTab } from "../annotation-management/components";
import { useAnnotations } from "../annotation-management/hooks";

import { DocumentHeader } from "./document-header";

interface DocumentPanelProps {
  fileUrl?: string;
  fileId?: string;
  refreshTrigger?: number;
}

const tabs = [
  {
    label: "Summary",
    value: "summary",
  },
  {
    label: "Notes",
    value: "annotations",
  },
];

export function DocumentPanel({
  fileUrl,
  fileId,
  refreshTrigger,
}: DocumentPanelProps) {
  const { summary, isGenerating, generateSummary } = useSummary();

  const {
    annotations,
    isLoadingAnnotations,
    editingAnnotation,
    setEditingAnnotation,
    handleUpdateAnnotation,
    handleDeleteAnnotation,
    updateAnnotationNote,
  } = useAnnotations(fileId, refreshTrigger);

  return (
    <div className="flex flex-col h-full">
      <DocumentHeader />

      <Tabs defaultValue="summary" className="flex-1 flex flex-col">
        <TabsList className="grid w-full grid-cols-3 p-1">
          {tabs.map(tab => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="flex-1 overflow-auto">
          <TabsContent value="summary" className="h-full">
            <SummaryTab
              summary={summary}
              isGenerating={isGenerating}
              fileUrl={fileUrl}
              onGenerateSummary={generateSummary}
            />
          </TabsContent>

          <TabsContent value="annotations" className="h-full">
            <AnnotationsTab
              annotations={annotations}
              isLoadingAnnotations={isLoadingAnnotations}
              editingAnnotation={editingAnnotation}
              onUpdateNote={updateAnnotationNote}
              onSave={handleUpdateAnnotation}
              onCancel={() => setEditingAnnotation(null)}
              onEdit={setEditingAnnotation}
              onDelete={handleDeleteAnnotation}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}
