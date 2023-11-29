import { CircleHelp, LayoutGrid } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Link from "next/link";

import { FormPopover } from "@/components/Form/FormPopover";
import { Hint } from "@/components/Hint";
import { db } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { getAvailableCount } from "@/lib/orgLimit";
import { MAX_FREE_BOARDS } from "@/constants/boards";
import { checkSubscription } from "@/lib/subscription";

export const BoardList = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const boards = await db.board.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
  });

  const availableCount = await getAvailableCount();
  const isPro = await checkSubscription();

  return (
    <div className="space-y-4">
      <h2 className="flex items-center text-xl text-foreground">
        <LayoutGrid className="h-5 w-5 mr-2 text-primary" aria-hidden />
        Boards
      </h2>

      {boards.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No boards yet. Create the first one to start adding lists and cards.
        </p>
      ) : null}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-primary rounded-lg h-full w-full overflow-hidden shadow-sm transition hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            href={`/board/${board.id}`}
            key={board.id}
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-foreground/10 to-transparent transition group-hover:from-foreground/90" />
            <p className="absolute bottom-2 left-3 right-3 truncate font-display text-lg text-primary-foreground">
              {board.title}
            </p>
          </Link>
        ))}

        <div className="relative">
          <FormPopover side="right" sideOffset={10}>
            <button
              type="button"
              className="aspect-video h-full w-full rounded-lg border-2 border-dashed border-input bg-card/60 flex items-center justify-center flex-col gap-y-1 transition hover:border-primary hover:bg-card focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <span className="text-sm font-medium">Create new board</span>
              <span className="text-xs text-muted-foreground">
                {isPro
                  ? "Unlimited"
                  : `${Math.max(0, MAX_FREE_BOARDS - availableCount)} remaining`}
              </span>
            </button>
          </FormPopover>

          <div className="absolute bottom-2 right-2">
            <Hint
              description={`Free workspaces can have up to ${MAX_FREE_BOARDS} boards. Upgrade the workspace for unlimited boards.`}
              sideOffset={40}
            >
              <CircleHelp className="h-[14px] w-[14px]" aria-label="About the board limit" />
            </Hint>
          </div>
        </div>
      </div>
    </div>
  );
};

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full rounded-lg" />
      <Skeleton className="aspect-video h-full w-full rounded-lg" />
      <Skeleton className="aspect-video h-full w-full rounded-lg" />
      <Skeleton className="aspect-video h-full w-full rounded-lg" />
      <Skeleton className="aspect-video h-full w-full rounded-lg" />
      <Skeleton className="aspect-video h-full w-full rounded-lg" />
      <Skeleton className="aspect-video h-full w-full rounded-lg" />
      <Skeleton className="aspect-video h-full w-full rounded-lg" />
    </div>
  );
};
