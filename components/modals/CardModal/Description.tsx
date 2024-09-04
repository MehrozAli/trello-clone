"use client";

import { useParams } from "next/navigation";
import { useState, useRef, ElementRef } from "react";
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
  useOnClickOutside(formRef, disableEditing);

  return (
    <div className="flex items-start gap-x-3 w-full">
      <AlignLeft className="h-5 w-5 mt-0.5 text-neutral-700" />

      <div className="w-full">
        <p className="font-semibold text-neutral-700 mb-2">Description</p>

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
          <div
            onClick={enableEditing}
            className="min-h-[78px] bg-neutral-200 text-sm font-medium py-3 px-3.5 rounded-md"
            role="button"
          >
            {card.description || "Add a more detailed description"}
          </div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className="flex items-start gap-x-3 w-full">
      <Skeleton className="h-6 w-6 bg-neutral-200" />

      <div className="w-full">
        <Skeleton className="bg-neutral-200 w-24 h-6 mb-2" />
        <Skeleton className="bg-neutral-200 w-full h-[78px]" />
      </div>
    </div>
  );
};
