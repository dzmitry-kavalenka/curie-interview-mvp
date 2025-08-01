import { PdfViewer } from "@/components/pdf-viewer";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ file: string }>;
}) {
  const { file } = await params;

  return <PdfViewer fileUrl={`/api/files/${file}`} />;
}
