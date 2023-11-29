"use client";

import { useParams } from "next/navigation";
import { useState, useRef, ElementRef, RefObject } from "react";
import { AlignLeft } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useEventListener, useOnClickOutside } from "usehooks-ts";

import { CardWithList } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { FormTextarea } from "@/components/Form/FormTextarea";
import { FormSubmit } from "@/components/Form/FormSubmit";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { updateCard } from "@/actions/updateCard";
import { toast } from "sonner";

interface DescriptionProps {
  card: CardWithList;
}

export const Description = ({ card }: DescriptionProps) => {
  const queryClient = useQueryClient();
  const params = useParams();

  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const formRef = useRef<ElementRef<"form">>(null);

  const [isEditing, setIsEditing] = useState(false);

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" updated!`);
      queryClient.invalidateQueries({
        queryKey: ["card", data.id],
      });
      queryClient.invalidateQueries({
        queryKey: ["card-logs", data.id],
      });
      disableEditing();
    },
    onError: (err) => toast.error(err),
  });

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  const onSubmit = (formData: FormData) => {
    const description = formData.get("description") as string;
    const boardId = params.boardId as string;

    execute({
      boardId,
      description,
      id: card.id,
    });
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef as RefObject<HTMLFormElement>, disableEditing);

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-foreground" />

      <div className="w-full">
        <p className="font-semibold text-foreground mb-2">Description</p>

        {isEditing ? (
          <form action={onSubmit} ref={formRef} className="space-y-2">
            <FormTextarea
              id="description"
              className="w-full mt-2"
              placeholder="Add a more detailed description"
              defaultValue={card.description || undefined}
              errors={fieldErrors}
              ref={textareaRef}
            />

            <div className="flex items-center gap-x-2">
              <FormSubmit>Save</FormSubmit>

              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={disableEditing}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <button
            type="button"
            onClick={enableEditing}
            className="block w-full min-h-[78px] whitespace-pre-wrap text-left bg-secondary text-sm py-3 px-3.5 rounded-md hover:bg-secondary/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {card.description || (
              <span className="text-muted-foreground">Add a more detailed description</span>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-secondary" />

      <div className="w-full">
        <Skeleton className="bg-secondary w-24 h-6 mb-2" />
        <Skeleton className="bg-secondary w-full h-[78px]" />
      </div>
    </div>
  );
};
