import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";

import { logger } from "@/shared/utils/logger";

import {
  getAnnotationsAction,
  updateAnnotationAction,
  deleteAnnotationAction,
} from "../actions";
import { Annotation } from "../types";

export function useAnnotations(fileId?: string, refreshTrigger?: number) {
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isLoadingAnnotations, setIsLoadingAnnotations] = useState(false);
  const [editingAnnotation, setEditingAnnotation] = useState<string | null>(
    null
  );

  const loadAnnotations = useCallback(async () => {
    if (!fileId) return;

    setIsLoadingAnnotations(true);
    try {
      const data = await getAnnotationsAction(fileId);
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

  const handleUpdateAnnotation = async (annotationId: string, note: string) => {
    try {
      const data = await updateAnnotationAction(annotationId, note);
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
      await deleteAnnotationAction(annotationId);
      setAnnotations(prev => prev.filter(ann => ann._id !== annotationId));
      toast.success("Annotation deleted successfully!");
    } catch (error) {
      logger.error("Error deleting annotation:", error);
      toast.error("Failed to delete annotation");
    }
  };

  const updateAnnotationNote = (annotationId: string, note: string) => {
    setAnnotations(prev =>
      prev.map(ann => (ann._id === annotationId ? { ...ann, note } : ann))
    );
  };

  return {
    annotations,
    isLoadingAnnotations,
    editingAnnotation,
    setEditingAnnotation,
    handleUpdateAnnotation,
    handleDeleteAnnotation,
    updateAnnotationNote,
  };
}
