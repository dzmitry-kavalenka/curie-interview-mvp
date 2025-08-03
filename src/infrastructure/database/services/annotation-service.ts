import { logger } from "@/shared/utils/logger";

import { Annotation, IAnnotation } from "../db/models/annotation";

export interface CreateAnnotationData {
  fileId: string;
  fileName: string;
  pageNumber: number;
  selectedText: string;
  note: string;
}

export interface UpdateAnnotationData {
  note?: string;
}

export class AnnotationService {
  static async createAnnotation(
    data: CreateAnnotationData
  ): Promise<IAnnotation> {
    try {
      const annotation = new Annotation({
        ...data,
      });

      const savedAnnotation = await annotation.save();
      logger.info("Annotation created:", savedAnnotation._id);
      return savedAnnotation;
    } catch (error) {
      logger.error("Error creating annotation:", error);
      throw new Error("Failed to create annotation");
    }
  }

  static async getAnnotationsByFile(fileId: string): Promise<IAnnotation[]> {
    try {
      const annotations = await Annotation.find({ fileId })
        .sort({ pageNumber: 1, createdAt: -1 })
        .exec();

      return annotations;
    } catch (error) {
      logger.error("Error fetching annotations:", error);
      throw new Error("Failed to fetch annotations");
    }
  }

  static async getAnnotationsByFileAndPage(
    fileId: string,
    pageNumber: number
  ): Promise<IAnnotation[]> {
    try {
      const annotations = await Annotation.find({ fileId, pageNumber })
        .sort({ createdAt: -1 })
        .exec();

      return annotations;
    } catch (error) {
      logger.error("Error fetching annotations by page:", error);
      throw new Error("Failed to fetch annotations");
    }
  }

  static async updateAnnotation(
    annotationId: string,
    data: UpdateAnnotationData
  ): Promise<IAnnotation> {
    try {
      const annotation = await Annotation.findByIdAndUpdate(
        annotationId,
        { ...data },
        { new: true, runValidators: true }
      );

      if (!annotation) {
        throw new Error("Annotation not found");
      }

      logger.info("Annotation updated:", annotationId);
      return annotation;
    } catch (error) {
      logger.error("Error updating annotation:", error);
      throw new Error("Failed to update annotation");
    }
  }

  static async deleteAnnotation(annotationId: string): Promise<void> {
    try {
      const result = await Annotation.findByIdAndDelete(annotationId);

      if (!result) {
        throw new Error("Annotation not found");
      }

      logger.info("Annotation deleted:", annotationId);
    } catch (error) {
      logger.error("Error deleting annotation:", error);
      throw new Error("Failed to delete annotation");
    }
  }

  static async getAnnotationById(
    annotationId: string
  ): Promise<IAnnotation | null> {
    try {
      const annotation = await Annotation.findById(annotationId);
      return annotation;
    } catch (error) {
      logger.error("Error fetching annotation:", error);
      throw new Error("Failed to fetch annotation");
    }
  }
}
