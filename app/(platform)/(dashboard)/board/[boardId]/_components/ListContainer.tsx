"use client";

import { useEffect, useState } from "react";

import { ListWithCards } from "@/types";
import { ListForm } from "./ListForm";
import { ListItem } from "./ListItem";

interface ListContainerProps {
  boardId: string;
  lists: ListWithCards[];
}

export const ListContainer = ({ boardId, lists }: ListContainerProps) => {
  const [orderedData, setOrderedData] = useState(lists);

  useEffect(() => {
    setOrderedData(lists);
  }, [lists]);

  return (
    <ol className="flex gap-x-3 h-full">
      {orderedData.map((list, idx) => (
        <ListItem key={list.id} index={idx} list={list} />
      ))}

      <ListForm />

      <div className="flex-shrink-0 w-1" />
    </ol>
  );
};
