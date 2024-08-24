"use client";

import { ListWithCards } from "@/types";
import { ListForm } from "./ListForm";

interface ListContainerProps {
  boardId: string;
  lists: ListWithCards[];
}

export const ListContainer = ({ boardId, lists }: ListContainerProps) => {
  return (
    <ol>
      <ListForm />
      
      <div className="flex shrink-0 w-1" />
    </ol>
  )
};
