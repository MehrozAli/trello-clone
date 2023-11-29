import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <h1 className="text-3xl">Not found</h1>
      <p className="text-sm text-muted-foreground">
        This board or page does not exist, or it belongs to another workspace.
      </p>
      <Button variant="primary" asChild>
        <Link href="/">Back to Taskify</Link>
      </Button>
    </div>
  );
}
