"use client";

import { ElementRef, PropsWithChildren, useRef } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  Popover,
  PopoverClose,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { createBoard } from "@/actions/createBoard";
import { useStripeModal } from "@/hooks/useStripeModal";
import { BOARD_LIMIT_ERROR } from "@/constants/boards";

import { FormInput } from "./FormInput";
import { FormSubmit } from "./FormSubmit";
import { FormPicker } from "./FormPicker";

interface FormPopoverProps {
  side?: "left" | "right" | "top" | "bottom";
  sideOffset?: number;
  align?: "start" | "center" | "end";
}

export const FormPopover = ({
  children,
  side = "bottom",
  sideOffset = 0,
  align,
}: PropsWithChildren<FormPopoverProps>) => {
  const router = useRouter();
  const closeRef = useRef<ElementRef<"button">>(null);
  const stripeModal = useStripeModal();

  const { execute, fieldErrors } = useAction(createBoard, {
    onSuccess: (data) => {
      toast.success("Board created!");
      closeRef.current?.click();

      router.push(`/board/${data.id}`);
    },
    onError: (error) => {
      toast.error(error);

      if (error === BOARD_LIMIT_ERROR) {
        stripeModal.onOpen();
      }
    },
  });

  const onSubmit = (formData: FormData) => {
    const title = formData.get("title") as string;
    const image = formData.get("image") as string;

    execute({ title, image });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>

      <PopoverContent
        align={align}
        className="w-80 pt-3"
        side={side}
        sideOffset={sideOffset}
      >
        <h2 className="text-base text-center pb-4">Create board</h2>

        <PopoverClose ref={closeRef} asChild>
          <Button
            aria-label="Close"
            className="h-auto w-auto p-2 absolute top-2 right-2 text-muted-foreground"
            variant="ghost"
          >
            <X className="h-4 w-4" />
          </Button>
        </PopoverClose>

        <form action={onSubmit} className="space-y-4">
          <div className="space-y-4">
            <FormPicker id="image" errors={fieldErrors} />
            <FormInput
              id="title"
              label="Board title"
              type="text"
              errors={fieldErrors}
            />
          </div>

          <FormSubmit className="w-full">Create</FormSubmit>
        </form>
      </PopoverContent>
    </Popover>
  );
};
