// Utility function to extract sections from markdown response
export function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(
    `## ${sectionName}\\s*\\n([\\s\\S]*?)(?=\\n## |$)`,
    "i"
  );
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

// Simple markdown formatter
export function formatMarkdown(text: string, color: string): string {
  return text
    .replace(/\n/g, "<br>")
    .replace(
      /^- (.+)$/g,
      `<div class="flex items-start gap-3 mb-2"><span class="w-2 h-2 ${color} rounded-full mt-2 flex-shrink-0"></span><span>$1</span></div>`
    )
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>")
    .replace(/"/g, "&quot;");
}
