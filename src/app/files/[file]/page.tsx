import { PdfViewer } from "@/features/document-management/components/pdf-viewer";
import { DocumentPanel } from "@/features/document-management/components/document-panel";
import { ResizablePanel } from "@/shared/components/layout/resizable-panel";

export default async function DocumentPage({
  params,
}: {
  params: Promise<{ file: string }>;
}) {
  const { file } = await params;

  const fileUrl = `/api/files/${file}`;

  return (
    <ResizablePanel
      defaultWidth={320}
      minWidth={240}
      maxWidth={600}
      sidePanel={<DocumentPanel fileUrl={fileUrl} />}
    >
      <PdfViewer fileUrl={fileUrl} />
    </ResizablePanel>
  );
}
