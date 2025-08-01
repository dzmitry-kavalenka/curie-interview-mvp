export default async function DocumentPage({
  params,
}: {
  params: Promise<{ file: string }>;
}) {
  const { file } = await params;

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">PDF Document</h1>
        <p className="text-muted-foreground mb-4">Filename: {file}</p>
        <iframe
          src={`/api/files/${file}`}
          className="w-full max-w-4xl h-96 border rounded-lg"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
}
