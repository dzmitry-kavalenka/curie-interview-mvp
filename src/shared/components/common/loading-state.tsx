interface LoadingStateProps {
  message?: string;
  className?: string;
}

export function LoadingState({
  message = "Loading...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 h-full ${className}`}
    >
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-500 text-sm">{message}</p>
    </div>
  );
}
