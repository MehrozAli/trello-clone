"use client";

import { ElementRef, useRef, useState } from "react";
import { Board } from "@prisma/client";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/Form/FormInput";
import { updateBoard } from "@/actions/updateBoard";
import { useAction } from "@/hooks/useAction";

interface BoardTitleFormProps {
  board: Board;
}

export const BoardTitleForm = ({ board }: BoardTitleFormProps) => {
  const { execute } = useAction(updateBoard, {
    onSuccess: (data) => {
      toast.success(`Board ${data.title} updated`);

      setTitle(data.title);
      disableEditing();
    },
    onError: (err) => toast.error(err),
  });

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(board.title);

  const disableEditing = () => setIsEditing(false);
  const enableEditing = () => {
    setIsEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
      inputRef.current?.select();
    });
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;

    execute({ title, id: board.id });
  };
  const onBlur = () => formRef.current?.requestSubmit();

  if (isEditing) {
    return (
      <form
        className="flex items-center gap-x-2"
        ref={formRef}
        action={onSubmit}
      >
        <FormInput
          id="title"
          ref={inputRef}
          onBlur={onBlur}
          defaultValue={title}
          className="text-lg font-bold px-[7px] py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none"
        />
      </form>
    );
  }

  return (
    <Button
      className="font-bold text-lg h-auto w-auto p-1 px-2"
      variant="transparent"
      onClick={enableEditing}
    >
      {title}
    </Button>
  );
};
