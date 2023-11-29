"use client";

import { ElementRef, useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";

import { ListWithCards } from "@/types";
import { cn } from "@/lib/utils";

import { ListHeader } from "./ListHeader";
import { CardForm } from "./CardForm";
import { CardItem } from "./CardItem";

interface ListItemProps {
  index: number;
  list: ListWithCards;
}

export const ListItem = ({ index, list }: ListItemProps) => {
  const textareaRef = useRef<ElementRef<"textarea">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  };

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textareaRef.current?.focus();
    });
  };

  return (
    <Draggable draggableId={list.id} index={index}>
      {(provided) => {
        return (
          <li
            {...provided.draggableProps}
            ref={provided.innerRef}
            className="shrink-0 h-full w-[272px] select-none"
          >
            <div
              {...provided.dragHandleProps}
              className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2"
            >
              <ListHeader onAddCard={enableEditing} list={list} />

              <Droppable droppableId={list.id} type="card">
                {(provided) => {
                  return (
                    <ol
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={cn("mx-1 px-1 py-0.5 flex flex-col gap-y-2", {
                        "mt-2": list.cards.length === 0,
                      })}
                    >
                      {list.cards.map((card, idx) => (
                        <CardItem index={idx} key={card.id} card={card} />
                      ))}

                      {provided.placeholder}
                    </ol>
                  );
                }}
              </Droppable>

              <CardForm
                listId={list.id}
                ref={textareaRef}
                isEditing={isEditing}
                enableEditing={enableEditing}
                disableEditing={disableEditing}
              />
            </div>
          </li>
        );
      }}
    </Draggable>
  );
};
