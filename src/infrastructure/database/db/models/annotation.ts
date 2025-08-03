import mongoose, { Schema, Document } from "mongoose";

export interface IAnnotation extends Document {
  fileId: string;
  fileName: string;
  pageNumber: number;
  selectedText: string;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

const AnnotationSchema = new Schema<IAnnotation>(
  {
    fileId: {
      type: String,
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    pageNumber: {
      type: Number,
      required: true,
    },
    selectedText: {
      type: String,
      required: true,
      trim: true,
    },
    note: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for efficient queries
AnnotationSchema.index({ fileId: 1, pageNumber: 1 });

export const Annotation = mongoose.model<IAnnotation>(
  "Annotation",
  AnnotationSchema
);
