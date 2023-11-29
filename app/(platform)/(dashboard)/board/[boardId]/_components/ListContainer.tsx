"use client";

import { useState } from "react";
import { DragDropContext, Droppable, type DropResult } from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { updateListOrder } from "@/actions/updateListOrder";
import { updateCardOrder } from "@/actions/updateCardOrder";
import { useAction } from "@/hooks/useAction";
import { moveCard, reorderLists } from "@/lib/reorder";

import { ListForm } from "./ListForm";
import { ListItem } from "./ListItem";
import { toast } from "sonner";

interface ListContainerProps {
  boardId: string;
  lists: ListWithCards[];
}

export const ListContainer = ({ boardId, lists }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(lists);
  const [serverLists, setServerLists] = useState(lists);

  // Take fresh server data after revalidation without an effect round-trip.
  if (lists !== serverLists) {
    setServerLists(lists);
    setOrderedData(lists);
  }

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => toast.success("List reordered"),
    onError: (err) => {
      toast.error(err);
      setOrderedData(serverLists);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => toast.success("Card reordered"),
    onError: (err) => {
      toast.error(err);
      setOrderedData(serverLists);
    },
  });

  const onDragEnd = ({ destination, source, type }: DropResult) => {
    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    if (type === "list") {
      const items = reorderLists(orderedData, source.index, destination.index);

      setOrderedData(items);
      executeUpdateListOrder({
        boardId,
        items: items.map(({ id, order }) => ({ id, order })),
      });
      return;
    }

    if (type === "card") {
      const moved = moveCard(orderedData, source, destination);

      if (!moved) {
        return;
      }

      setOrderedData(moved.lists);
      executeUpdateCardOrder({ boardId, items: moved.changed });
    }
  };

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
