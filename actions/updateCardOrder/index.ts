"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/createSafeAction";

import { UpdateCardOrder } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { boardId, items } = data;
  let updatedCards;

  try {
    updatedCards = await db.$transaction(async (tx) => {
      const boardLists = await tx.list.findMany({
        where: { boardId, board: { orgId } },
        select: { id: true },
      });
      const boardListIds = boardLists.map((list) => list.id);

      // Both the cards and their target lists must live on this board, in
      // the caller's org; otherwise a card could be moved into another org.
      if (items.some((item) => !boardListIds.includes(item.listId))) {
        return null;
      }

      const currentCards = await tx.card.findMany({
        where: { id: { in: items.map((item) => item.id) }, listId: { in: boardListIds } },
        select: { id: true, listId: true },
      });

      if (currentCards.length !== items.length) {
        return null;
      }

      for (const item of items) {
        await tx.card.update({
          where: { id: item.id },
          data: { order: item.order, listId: item.listId },
        });
      }

      // Renumber every list the move touched, including the list a card left,
      // so orders stay contiguous even if the client sent a partial list.
      const touchedListIds = [
        ...new Set([
          ...items.map((item) => item.listId),
          ...currentCards.map((card) => card.listId),
        ]),
      ];
      const touchedCards = await tx.card.findMany({
        where: { listId: { in: touchedListIds } },
        orderBy: [{ listId: "asc" }, { order: "asc" }, { createdAt: "asc" }],
      });

      const positionInList = new Map<string, number>();
      const renumbered = [];

      for (const card of touchedCards) {
        const order = positionInList.get(card.listId) ?? 0;
        positionInList.set(card.listId, order + 1);

        renumbered.push(
          card.order === order
            ? card
            : await tx.card.update({ where: { id: card.id }, data: { order } })
        );
      }

      return renumbered;
    });
  } catch {
    return { error: "Failed to re-order" };
  }

  if (!updatedCards) {
    return { error: "Cards not found on this board" };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: updatedCards };
};

export const updateCardOrder = createSafeAction(UpdateCardOrder, handler);
