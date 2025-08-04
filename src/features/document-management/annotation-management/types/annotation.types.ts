export interface Annotation {
  _id: string;
  fileId: string;
  fileName: string;
  pageNumber: number;
  selectedText: string;
  note: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAnnotationRequest {
  fileId: string;
  fileName: string;
  pageNumber: number;
  selectedText: string;
  note: string;
}

export interface UpdateAnnotationRequest {
  note: string;
}

export interface AnnotationResponse {
  annotations: Annotation[];
}

export interface SingleAnnotationResponse {
  annotation: Annotation;
}
