"use client";

import { forwardRef, useRef, KeyboardEventHandler, ElementRef } from "react";
import { useParams } from "next/navigation";
import { Plus, X } from "lucide-react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";

import { FormSubmit } from "@/components/Form/FormSubmit";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { createCard } from "@/actions/createCard";

interface CardFormProps {
  listId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = forwardRef<HTMLTextAreaElement, CardFormProps>(
  ({ listId, isEditing, enableEditing, disableEditing }, ref) => {
    const params = useParams();
    const formRef = useRef<ElementRef<"form">>(null);

    const { execute, fieldErrors } = useAction(createCard, {
      onSuccess: (data) => {
        toast.success(`Card ${data.title} created!`);
        formRef.current?.reset();
      },
      onError: (err) => toast.error(err),
    });

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        disableEditing();
      }
    };
    useEventListener("keydown", onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (
      e
    ) => {
      if (e.key == "Enter" && !e.shiftKey) {
        e.preventDefault();

        formRef.current?.requestSubmit();
      }
    };

    const onSubmit = (formData: FormData) => {
      const title = formData.get("title") as string;
      const listId = formData.get("listId") as string;
      const boardId = params.boardId as string;

      console.log(title);

      execute({
        title,
        listId,
        boardId,
      });
    };

    if (isEditing) {
      return (
        <form
          ref={formRef}
          action={onSubmit}
          className="m-1 py-0.5 px-1 space-y-4"
        >
          <FormTextarea
            id="title"
            onKeyDown={onTextareaKeyDown}
            ref={ref}
            placeholder="Enter a title for this card"
            errors={fieldErrors}
          />
          <input type="hidden" name="listId" id="listId" value={listId} />

          <div className="flex items-center gap-x-1">
            <FormSubmit>Add Card</FormSubmit>

            <Button onClick={disableEditing} size="sm" variant="ghost">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </form>
      );
    }

    return (
      <div className="pt-2 px-2">
        <Button
          onClick={enableEditing}
          className="h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm"
          variant="ghost"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add a card
        </Button>
      </div>
    );
  }
);

CardForm.displayName = "CardForm";
