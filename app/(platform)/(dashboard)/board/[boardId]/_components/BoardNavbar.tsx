import type { Board } from "@/lib/generated/prisma/client";

import { BoardTitleForm } from "./BoardTitleForm";
import { BoardOptions } from "./BoardOptions";

interface BoardNavbarProps {
  board: Board;
}

export const BoardNavbar = async ({ board }: BoardNavbarProps) => {
  return (
    <div className="w-full h-14 z-[40] bg-foreground/60 backdrop-blur-sm fixed top-14 flex items-center px-4 md:px-6 gap-x-4 text-primary-foreground">
      <BoardTitleForm board={board} />

      <div className="ml-auto">
        <BoardOptions boardId={board.id} />
      </div>
    </div>
  );
};
