"use client";

import { Button } from "@/components/ui/button";

export default function DashboardError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 pt-32 text-center" role="alert">
      <h1 className="text-2xl">Something went wrong</h1>
      <p className="text-sm text-muted-foreground">
        The page could not be loaded. Your boards are safe; try again in a moment.
      </p>
      <Button variant="primary" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
