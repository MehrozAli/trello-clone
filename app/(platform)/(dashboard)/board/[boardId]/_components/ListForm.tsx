"use client";

import { Plus, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useState, useRef, ElementRef } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { FormInput } from "@/components/Form/FormInput";
import { useAction } from "@/hooks/useAction";
import { createList } from "@/actions/createList";

import { ListWrapper } from "./ListWrapper";
import { FormSubmit } from "@/components/Form/FormSubmit";

export const ListForm = () => {
  const params = useParams();
  const router = useRouter();

  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);

  const [editing, setEditing] = useState(false);

  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List ${data.title} created`);

      setEditing(false);
      router.refresh();
    },
    onError: (err) => toast.error(err),
  });

  const enableEditing = () => {
    setEditing(true);

    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      setEditing(false);
    }
  };

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const boardId = formData.get("boardId") as string;

    execute({ title, boardId });
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, () => setEditing(false));

  if (editing) {
    return (
      <ListWrapper>
        <form
          ref={formRef}
          className="w-full rounded-md p-3 bg-white space-y-4 shadow-md"
          action={onSubmit}
        >
          <FormInput
            ref={inputRef}
            errors={fieldErrors}
            id="title"
            className="text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition"
            placeholder="Enter list title"
          />

          <input type="hidden" name="boardId" value={params.boardId} />

          <div className="flex items-center gap-x-1">
            <FormSubmit>Add list</FormSubmit>

            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </form>
      </ListWrapper>
    );
  }

  return (
    <ListWrapper>
      <Button
        onClick={enableEditing}
        className="w-full rounded-md bg-white/80 hover:bg-white/50 transition p-3 flex gap-2 items-center font-medium text-ms"
      >
        <Plus className="h-4 w-4" />
        Add a list
      </Button>
    </ListWrapper>
  );
};
