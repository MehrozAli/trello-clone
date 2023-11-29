"use client";

import { Ellipsis, X } from "lucide-react";
import { toast } from "sonner";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { deleteBoard } from "@/actions/deleteBoard";
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
        <Button className="h-auto w-auto p-2" variant="transparent" aria-label="Board actions">
          <Ellipsis className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="px-0 py-3" side="bottom" align="start">
        <div className="text-sm font-medium text-center text-muted-foreground pb-4">
          Board actions
        </div>

        <PopoverClose asChild>
          <Button
            aria-label="Close"
            variant="ghost"
            className="h-auto w-auto p-2 absolute top-2 right-2 text-muted-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
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
