"use client";

import { useState } from "react";
import { UploadArea } from "@/components/upload-area";

export default function Home() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-2">PDF Upload</h1>
        <p className="text-muted-foreground text-lg">
          Upload your PDF file to start a research
        </p>
      </div>

      <UploadArea
        onFileSelect={(file) => {
          setUploadedFile(file);
        }}
      />

      {uploadedFile && (
        <div className="mt-6 text-center">
          <p className="text-green-600 font-medium">
            PDF uploaded successfully! Ready for processing.
          </p>
        </div>
      )}
    </div>
  );
}
