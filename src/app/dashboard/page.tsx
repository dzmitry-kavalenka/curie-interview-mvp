"use client";

import { FileText, Upload, History } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { UploadArea } from "@/features/document-management/components/upload-area";
import { UploadHistory } from "@/features/document-management/document-history/components/upload-history";
import { ResizablePanel } from "@/shared/components/layout/resizable-panel";

export default function Dashboard() {
  const router = useRouter();
  const [fileCount, setFileCount] = useState(0);

  const handleFileSelect = (filename: string) => {
    router.push(`/files/${filename}`);
  };

  const handleFileCountUpdate = (count: number) => {
    setFileCount(count);
  };

  return (
    <ResizablePanel
      defaultWidth={400}
      minWidth={300}
      maxWidth={600}
      sidePanel={
        <div className="h-full flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-center gap-2 mb-1">
              <History className="h-5 w-5 text-gray-600" />
              <h2 className="text-lg font-semibold text-gray-900">
                Upload History
              </h2>
            </div>
            <p className="text-sm text-gray-500">
              {fileCount === 0
                ? "No files uploaded yet"
                : `${fileCount} file${fileCount !== 1 ? "s" : ""} uploaded`}
            </p>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-hidden">
            <UploadHistory
              onFileSelect={handleFileSelect}
              onFileCountUpdate={handleFileCountUpdate}
            />
          </div>
        </div>
      }
    >
      {/* Main Content - Upload Area */}
      <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <Upload className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              PDF Upload
            </h1>
            <p className="text-gray-600 text-lg">
              Upload your PDF file to start a research
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <UploadArea
              onFileSelect={file => {
                router.push(`/files/${file.filename}`);
              }}
            />
          </div>

          {/* Quick Tips */}
          <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Quick Tips
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Supported format: PDF files only</li>
              <li>• Maximum file size: 5MB</li>
              <li>• Maximum files: 5 (MVP limit)</li>
              <li>• AI summaries are generated automatically</li>
              <li>• View your upload history on the right panel</li>
            </ul>
          </div>
        </div>
      </div>
    </ResizablePanel>
  );
}
