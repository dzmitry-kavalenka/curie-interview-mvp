import { FileText, Clock, Edit, Trash2 } from "lucide-react";

import { Button } from "@/shared/components/ui/button";

import { Annotation } from "../types";
import { formatDate } from "../utils";

interface AnnotationItemProps {
  annotation: Annotation;
  isEditing: boolean;
  onUpdateNote: (annotationId: string, note: string) => void;
  onSave: (annotationId: string, note: string) => Promise<void>;
  onCancel: () => void;
  onEdit: (annotationId: string) => void;
  onDelete: (annotationId: string) => Promise<void>;
}

export function AnnotationItem({
  annotation,
  isEditing,
  onUpdateNote,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: AnnotationItemProps) {
  return (
    <div className="p-3 border border-border rounded-lg hover:bg-muted/30 transition-colors">
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
        <div className="text-xs text-muted-foreground mb-1">Selected Text:</div>
        <div className="text-xs bg-muted/50 p-2 rounded mb-2 max-h-16 overflow-y-auto">
          {annotation.selectedText}
        </div>
      </div>

      {isEditing ? (
        <div className="space-y-2">
          <textarea
            value={annotation.note}
            onChange={e => onUpdateNote(annotation._id, e.target.value)}
            className="w-full p-2 text-sm border rounded resize-none"
            rows={3}
          />
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={() => onSave(annotation._id, annotation.note)}
            >
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={onCancel}>
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
          onClick={() => onEdit(annotation._id)}
          className="h-6 px-2"
        >
          <Edit className="h-3 w-3" />
        </Button>
        <Button
          size="sm"
          variant="ghost"
          onClick={() => onDelete(annotation._id)}
          className="h-6 px-2 text-destructive"
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );
}
