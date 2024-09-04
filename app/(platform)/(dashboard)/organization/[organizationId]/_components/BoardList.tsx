import { HelpCircle, User2 } from "lucide-react";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Link from "next/link";

import { FormPopover } from "@/components/Form/FormPopover";
import { Hint } from "@/components/Hint";
import { db } from "@/lib/db";
import { Skeleton } from "@/components/ui/skeleton";
import { getAvailableCount } from "@/lib/orgLimit";
import { MAX_FREE_BOARDS } from "@/constants/boards";

export const BoardList = async () => {
  const { orgId } = auth();

  if (!orgId) {
    return redirect("/select-org");
  }

  const boards = await db.board.findMany({
    where: { orgId },
    orderBy: { createdAt: "desc" },
  });

  const availableCount = await getAvailableCount();

  return (
    <div className="space-y-4">
      <div className="flex items-center font-semibold text-neutral-700 text-lg">
        <User2 className="h-6 w-6 mr-2" />
        Your boards
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {boards.map((board) => (
          <Link
            className="group relative aspect-video bg-no-repeat bg-center bg-cover bg-sky-700 rounded-sm h-full w-full p-2 overflow-hidden"
            href={`/board/${board.id}`}
            key={board.id}
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
          >
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition" />
            <p className="relative font-semibold text-white">{board.title}</p>
          </Link>
        ))}

        <FormPopover side="right" sideOffset={10}>
          <div
            role="button"
            className="aspect-video relative h-full w-full bg-muted rounded-sm flex items-center justify-center flex-col gap-y-1 hover:opacity-75 transition"
          >
            <p className="text-sm">Create new board</p>
            <span className="text-xs">{`${
              MAX_FREE_BOARDS - availableCount
            } remaining`}</span>
            <Hint
              description={`Free workspaces can have upto 5 open boards. For unlimited boards, upgrade this workspace`}
              sideOffset={40}
            >
              <HelpCircle className="absolute bottom-2 right-2 h-[14px] w-[14px]" />
            </Hint>
          </div>
        </FormPopover>
      </div>
    </div>
  );
};

BoardList.Skeleton = function SkeletonBoardList() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
      <Skeleton className="aspect-video h-full w-full p-2" />
    </div>
  );
};
