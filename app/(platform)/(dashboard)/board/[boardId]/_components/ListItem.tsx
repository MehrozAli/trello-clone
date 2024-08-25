"use client";

import { ElementRef, useRef, useState } from "react";

import { ListWithCards } from "@/types";

import { ListWrapper } from "./ListWrapper";
import { ListHeader } from "./ListHeader";
import { CardForm } from "./CardForm";

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
    <ListWrapper>
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        <ListHeader onAddCard={enableEditing} list={list} />
        <CardForm
          listId={list.id}
          ref={textareaRef}
          isEditing={isEditing}
          enableEditing={enableEditing}
          disableEditing={disableEditing}
        />
      </div>
    </ListWrapper>
  );
};
