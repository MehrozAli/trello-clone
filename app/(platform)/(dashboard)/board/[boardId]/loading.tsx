import { Skeleton } from "@/components/ui/skeleton";

export default function BoardLoading() {
  return (
    <div className="flex gap-3 p-4 pt-32" aria-busy="true" aria-label="Loading board">
      {[3, 2, 4].map((cards, list) => (
        <div key={list} className="w-[272px] shrink-0 space-y-2 rounded-lg bg-secondary p-2">
          <Skeleton className="h-5 w-24 bg-muted" />
          {Array.from({ length: cards }, (_, card) => (
            <Skeleton key={card} className="h-9 w-full bg-card" />
          ))}
        </div>
      ))}
    </div>
  );
}
