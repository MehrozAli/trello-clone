"use client";

import { Copy, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { toast } from "sonner";

import { CardWithList } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { copyCard } from "@/actions/copyCard";
import { deleteCard } from "@/actions/deleteCard";
import { useCardModal } from "@/hooks/useCardModal";

interface ActionsProps {
  card: CardWithList;
}

export const Actions = ({ card }: ActionsProps) => {
  const params = useParams();
  const cardModal = useCardModal();

  const { execute: executeCopyCard, loading: isLoadingCopy } = useAction(
    copyCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" copied!`);
        cardModal.onClose();
      },
      onError: (err) => toast.error(err),
    }
  );
  const { execute: executeDeleteCard, loading: isLoadingDelete } = useAction(
    deleteCard,
    {
      onSuccess: (data) => {
        toast.success(`Card "${data.title}" deleted!`);
        cardModal.onClose();
      },
      onError: (err) => toast.error(err),
    }
  );

  const onCopy = () => {
    const boardId = params.boardId as string;

    executeCopyCard({
      id: card.id,
      boardId,
    });
  };

  const onDelete = () => {
    const boardId = params.boardId as string;

    executeDeleteCard({
      id: card.id,
      boardId,
    });
  };

  return (
    <div className="space-y-2 mt-2">
      <p className="text-xs font-semibold">Actions</p>

      <Button
        onClick={onCopy}
        disabled={isLoadingCopy}
        variant="gray"
        size="inline"
      >
        <Copy className="w-4 h-4 mr-2" /> Copy
      </Button>

      <Button
        onClick={onDelete}
        disabled={isLoadingDelete}
        variant="gray"
        size="inline"
      >
        <Trash className="w-4 h-4 mr-2" /> Delete
      </Button>
    </div>
  );
};

Actions.Skeleton = function ActionsSkeleton() {
  return (
    <div className="space-y-2 mt-2">
      <Skeleton className="w-20 h-4 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
      <Skeleton className="w-full h-8 bg-neutral-200" />
    </div>
  );
};
