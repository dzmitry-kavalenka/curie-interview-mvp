import { FileIcon } from "lucide-react";

interface EmptyStateProps {
  title?: string;
  message?: string;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

export function EmptyState({
  title = "No items found",
  message = "There are no items to display at the moment.",
  icon: Icon = FileIcon,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 h-full ${className}`}
    >
      <div className="bg-gray-100 rounded-full p-4 mb-4">
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
      <h3 className="font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-500 text-sm text-center max-w-sm">{message}</p>
    </div>
  );
}
