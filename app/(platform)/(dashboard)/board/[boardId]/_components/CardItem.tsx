"use client";

import { Card } from "@prisma/client";
import { Draggable } from "@hello-pangea/dnd";

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
            className="truncate border-2 border-transparent hover:hover-black py-2 px-3 text-sm bg-white rounded-md shadow-sm"
            role="button"
            onClick={() => cardModal.onOpen(card.id)}
          >
            {card.title}
          </div>
        );
      }}
    </Draggable>
  );
};
