import { formatMarkdown } from "@/shared/utils/markdown-utils";

interface SummarySectionProps {
  title: string;
  content: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}

export function SummarySection({
  title,
  content,
  icon: Icon,
  color,
}: SummarySectionProps) {
  if (!content) return null;

  return (
    <div
      className={`p-4 border border-${color}-200 rounded-xl bg-gradient-to-br from-${color}-50 to-${color}-100/50 shadow-sm hover:shadow-md transition-all duration-200`}
    >
      <h4
        className={`font-semibold text-sm mb-3 flex items-center gap-2 text-${color}-700`}
      >
        <Icon className="h-4 w-4" />
        {title}
      </h4>
      <div
        className={`text-sm text-${color}-900/80 leading-relaxed`}
        dangerouslySetInnerHTML={{
          __html: formatMarkdown(content, `bg-${color}-500`),
        }}
      />
    </div>
  );
}
