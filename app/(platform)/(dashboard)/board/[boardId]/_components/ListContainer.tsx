"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { updateListOrder } from "@/actions/updateListOrder";
import { updateCardOrder } from "@/actions/updateCardOrder";
import { useAction } from "@/hooks/useAction";

import { ListForm } from "./ListForm";
import { ListItem } from "./ListItem";
import { toast } from "sonner";

interface ListContainerProps {
  boardId: string;
  lists: ListWithCards[];
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
}

export const ListContainer = ({ boardId, lists }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(lists);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => toast.success("List reordered"),
    onError: (err) => toast.error(err),
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => toast.success("Card reordered"),
    onError: (err) => toast.error(err),
  });

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;

    if (!destination) {
      return;
    }

    // If dropped in the same position
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    // If a list is moved
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, idx) => ({ ...item, order: idx })
      );

      setOrderedData(items);
      executeUpdateListOrder({ items, boardId });
    }

    // If a card is moved
    if (type === "card") {
      let newOrderedData = [...orderedData];

      // source & destination list
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destinationList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destinationList) {
        return;
      }

      // Check if cards exists on the sourceList
      if (!sourceList.cards) {
        sourceList.cards = [];
      }

      // Check if cards exists on the destinationList
      if (!destinationList.cards) {
        destinationList.cards = [];
      }

      // If card is moved within the same list
      if (source.droppableId === destination.droppableId) {
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, idx) => {
          card.order = idx;
        });
        sourceList.cards = reorderedCards;

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({ boardId, items: reorderedCards });
      } else {
        // Remove card from the sourceList
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // Assign the new listId to the moved card
        movedCard.listId = destination.droppableId;

        // Add the card to the destination list
        destinationList.cards.splice(destination.index, 0, movedCard);

        // Update the order of source & destination lists
        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        destinationList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({ boardId, items: destinationList.cards });
      }
    }
  };

  useEffect(() => {
    setOrderedData(lists);
  }, [lists]);

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="lists" type="list" direction="horizontal">
        {(provided) => {
          return (
            <ol
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="flex gap-x-3 h-full"
            >
              {orderedData.map((list, idx) => (
                <ListItem key={list.id} index={idx} list={list} />
              ))}

              {provided.placeholder}
              <ListForm />

              <div className="flex-shrink-0 w-1" />
            </ol>
          );
        }}
      </Droppable>
    </DragDropContext>
  );
};
