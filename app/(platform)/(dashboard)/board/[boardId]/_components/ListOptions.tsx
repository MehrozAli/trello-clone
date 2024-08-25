"use client";

import { List } from "@prisma/client";
import { MoreHorizontal, X } from "lucide-react";
import { toast } from "sonner";
import { ElementRef, useRef } from "react";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { FormSubmit } from "@/components/Form/FormSubmit";
import { Separator } from "@/components/ui/separator";
import { useAction } from "@/hooks/useAction";
import { deleteList } from "@/actions/deleteList";
import { copyList } from "@/actions/copyList";

interface ListOptionsProps {
  list: List;
  onAddCard(): void;
}

export const ListOptions = ({ list, onAddCard }: ListOptionsProps) => {
  const closeRef = useRef<ElementRef<"button">>(null);

  const { execute: executeDelete } = useAction(deleteList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} deleted!`);

      closeRef.current?.click();
    },
    onError: (err) => toast.error(err),
  });

  const { execute: executeCopy } = useAction(copyList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} copied!`);

      closeRef.current?.click();
    },
    onError: (err) => toast.error(err),
  });

  const onDelete = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeDelete({ id, boardId });
  };

  const onCopy = (formData: FormData) => {
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    executeCopy({ id, boardId });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="h-auto w-auto p-2" variant="ghost">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="px-0 py-3" align="start" side="bottom">
        <div className="text-sm font-medium text-center text-neutral-600 pb-4">
          List actions
        </div>

        <PopoverClose ref={closeRef} asChild>
          <Button
            className="h-auto w-auto p-2 absolute top-2 right-2 text-neutral-600"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>

        <Button
          onClick={onAddCard}
          className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
          variant="ghost"
        >
          Add card...
        </Button>

        <form action={onCopy}>
          <input name="id" id="id" value={list.id} hidden />
          <input name="boardId" id="boardId" value={list.boardId} hidden />

          <FormSubmit
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant="ghost"
          >
            Copy list...
          </FormSubmit>
        </form>

        <Separator />

        <form action={onDelete}>
          <input name="id" id="id" value={list.id} hidden />
          <input name="boardId" id="boardId" value={list.boardId} hidden />

          <FormSubmit
            className="rounded-none w-full h-auto p-2 px-5 justify-start font-normal text-sm"
            variant="ghost"
          >
            Delete this list
          </FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
