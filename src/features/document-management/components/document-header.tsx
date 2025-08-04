import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/shared/components/ui/button";

export function DocumentHeader() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  return (
    <div className="p-4 border-b border-border bg-background sticky top-0 z-10">
      <div className="flex items-center gap-3 mb-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleBack}
          className="h-8 w-8 p-0 hover:bg-muted"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h2 className="font-semibold text-lg truncate">Document Viewer</h2>
      </div>
      <p className="text-sm text-muted-foreground">Interactive PDF Analysis</p>
    </div>
  );
}
