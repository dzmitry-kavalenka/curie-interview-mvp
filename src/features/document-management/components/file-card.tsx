import { formatDistanceToNow } from "date-fns";
import { FileText, Clock, Trash2, Eye } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

interface UploadRecord {
  _id: string;
  filename: string;
  originalName: string;
  size: number;
  type: string;
  path: string;
  uploadedAt: string;
  filePath: string;
}

interface SummaryRecord {
  _id: string;
  filename: string;
  summary: string;
  fileSize: number;
  textLength: number;
  processingTime?: number;
  createdAt: string;
}

interface FileWithSummary {
  upload: UploadRecord;
  summary: SummaryRecord | null;
}

interface FileCardProps {
  file: FileWithSummary;
  onSelect: (filename: string) => void;
  onDelete: (filename: string) => void;
  isSelected: boolean;
}

export function FileCard({
  file,
  onSelect,
  onDelete,
  isSelected,
}: FileCardProps) {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const formatProcessingTime = (ms?: number) => {
    if (!ms) return "N/A";
    return `${ms}ms`;
  };

  return (
    <div
      className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md ${
        isSelected
          ? "border-blue-500 bg-blue-50 shadow-md"
          : "border-gray-200 bg-white hover:border-gray-300"
      }`}
      onClick={() => onSelect(file.upload.filename)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <h4 className="font-medium text-gray-900 truncate">
              {file.upload.originalName}
            </h4>
          </div>

          <div className="space-y-1 text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3" />
              <span>
                Uploaded {formatDistanceToNow(new Date(file.upload.uploadedAt))}{" "}
                ago
              </span>
            </div>
            <div>Size: {formatFileSize(file.upload.size)}</div>
          </div>

          {file.summary && (
            <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-md">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium text-green-800">
                  AI Summary Available
                </span>
              </div>
              <div className="text-xs text-green-700">
                Processing time:{" "}
                {formatProcessingTime(file.summary.processingTime)}
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2 ml-4">
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onSelect(file.upload.filename);
            }}
            className="h-8 w-8 p-0"
          >
            <Eye className="h-4 w-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(file.upload.filename);
            }}
            className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
