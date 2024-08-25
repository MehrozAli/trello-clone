"use client";

import { useState, useRef, ElementRef } from "react";
import { List } from "@prisma/client";
import { useEventListener } from "usehooks-ts";
import { toast } from "sonner";

import { FormInput } from "@/components/Form/FormInput";
import { useAction } from "@/hooks/useAction";
import { updateList } from "@/actions/updateList";
import { ListOptions } from "./ListOptions";

interface ListHeaderProps {
  list: List;
}

export const ListHeader = ({ list }: ListHeaderProps) => {
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [title, setTitle] = useState(list.title);
  const [isEditing, setIsEditing] = useState(false);

  const { execute } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} updated`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (err) => toast.error(err),
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };
  const disableEditing = () => setIsEditing(false);

  const handleSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const id = formData.get("id") as string;
    const boardId = formData.get("boardId") as string;

    if (title === list.title) {
      return disableEditing();
    }

    execute({ title, id, boardId });
  };

  const onBlur = () => {
    formRef.current?.requestSubmit();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      formRef.current?.requestSubmit();
    }
  };
  useEventListener("keydown", onKeyDown);

  return (
    <div className="pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2">
      {isEditing ? (
        <form ref={formRef} action={handleSubmit} className="flex-1 px-[2px]">
          <input type="hidden" id="id" name="id" value={list.id} />
          <input
            type="hidden"
            id="boardId"
            name="boardId"
            value={list.boardId}
          />

          <FormInput
            ref={inputRef}
            id="title"
            placeholder="Enter list title"
            defaultValue={title}
            onBlur={onBlur}
            className="text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-white"
          />

          <button type="submit" hidden />
        </form>
      ) : (
        <div
          onClick={enableEditing}
          className="w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent"
        >
          {title}
        </div>
      )}

      <ListOptions list={list} onAddCard={() => {}} />
    </div>
  );
};
