"use client";

import type { Card } from "@/lib/generated/prisma/client";
import { Draggable } from "@hello-pangea/dnd";
import { AlignLeft } from "lucide-react";

import { useCardModal } from "@/hooks/useCardModal";

interface CardItemProps {
  index: number;
  card: Card;
}

export const CardItem = ({ card, index }: CardItemProps) => {
  const cardModal = useCardModal();

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => {
        return (
          <div
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            ref={provided.innerRef}
            className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm shadow-sm transition hover:border-primary/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            role="button"
            aria-label={`Open card ${card.title}`}
            onClick={() => cardModal.onOpen(card.id)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                cardModal.onOpen(card.id);
              }
            }}
          >
            <span className="truncate">{card.title}</span>
            {card.description ? (
              <AlignLeft className="ml-auto h-3.5 w-3.5 shrink-0 text-muted-foreground" aria-label="Has a description" />
            ) : null}
          </div>
        );
      }}
    </Draggable>
  );
};
