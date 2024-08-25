"use client";

import { ListWithCards } from "@/types";

import { ListWrapper } from "./ListWrapper";
import { ListHeader } from "./ListHeader";

interface ListItemProps {
  index: number;
  list: ListWithCards;
}

export const ListItem = ({ index, list }: ListItemProps) => {
  return (
    <ListWrapper>
      <div className="w-full rounded-md bg-[#f1f2f4] shadow-md pb-2">
        <ListHeader list={list} />
      </div>
    </ListWrapper>
  );
};
