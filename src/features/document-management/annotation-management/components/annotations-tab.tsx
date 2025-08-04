import { MessageSquare, Loader2 } from "lucide-react";

import { Annotation } from "../types";

import { AnnotationItem } from "./annotation-item";

interface AnnotationsTabProps {
  annotations: Annotation[];
  isLoadingAnnotations: boolean;
  editingAnnotation: string | null;
  onUpdateNote: (annotationId: string, note: string) => void;
  onSave: (annotationId: string, note: string) => Promise<void>;
  onCancel: () => void;
  onEdit: (annotationId: string) => void;
  onDelete: (annotationId: string) => Promise<void>;
}

export function AnnotationsTab({
  annotations,
  isLoadingAnnotations,
  editingAnnotation,
  onUpdateNote,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: AnnotationsTabProps) {
  return (
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
            <AnnotationItem
              key={annotation._id}
              annotation={annotation}
              isEditing={editingAnnotation === annotation._id}
              onUpdateNote={onUpdateNote}
              onSave={onSave}
              onCancel={onCancel}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}
