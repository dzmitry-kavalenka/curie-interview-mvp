"use client";

import { useEffect, useState } from "react";

import { DocumentPanel } from "@/features/document-management/components/document-panel";
import { PdfViewer } from "@/features/document-management/components/pdf-viewer";
import { ResizablePanel } from "@/shared/components/layout/resizable-panel";

export default function DocumentPage({
  params,
}: {
  params: Promise<{ file: string }>;
}) {
  const [file, setFile] = useState<string>("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const getParams = async () => {
      const { file: fileParam } = await params;
      setFile(fileParam);
    };
    getParams();
  }, [params]);

  // Extract file info from params
  const fileId = file;
  const fileName = file; // You might want to get the actual filename from the database
  const fileUrl = `/api/files/${file}`;

  const handleAnnotationCreated = () => {
    // Trigger a refresh of the annotations list
    setRefreshTrigger(prev => prev + 1);
    console.log("Annotation created!");
  };

  if (!file) {
    return <div>Loading...</div>;
  }

  return (
    <ResizablePanel
      defaultWidth={320}
      minWidth={240}
      maxWidth={600}
      sidePanel={
        <DocumentPanel
          fileUrl={fileUrl}
          fileId={fileId}
          refreshTrigger={refreshTrigger}
        />
      }
    >
      <PdfViewer
        fileUrl={fileUrl}
        fileId={fileId}
        fileName={fileName}
        onAnnotationCreated={handleAnnotationCreated}
      />
    </ResizablePanel>
  );
}
