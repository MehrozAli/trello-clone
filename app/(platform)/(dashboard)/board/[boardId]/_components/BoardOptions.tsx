"use client";

import { Button } from "@/components/ui/button";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { deleteBoard } from "@/actions/delete-board";
import { useAction } from "@/hooks/useAction";

interface BoardOptionsProps {
  boardId: string;
}

export const BoardOptions = ({ boardId }: BoardOptionsProps) => {
  const { execute, loading } = useAction(deleteBoard, {
    onError: (err) => toast.error(err),
  });

  const onDelete = () => {
    execute({ id: boardId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="transparent">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          Board actions
        </div>

        <PopoverClose asChild>
          <Button
            variant="ghost"
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>

        <Button
          variant="ghost"
          onClick={onDelete}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          disabled={loading}
        >
          Delete this board
        </Button>
      </PopoverContent>
    </Popover>
  );
};
