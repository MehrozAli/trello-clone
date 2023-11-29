"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/createSafeAction";

import { UpdateListOrder } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { boardId, items } = data;
  let lists;

  try {
    lists = await db.$transaction(async (tx) => {
      const owned = await tx.list.count({
        where: {
          id: { in: items.map((item) => item.id) },
          boardId,
          board: { orgId },
        },
      });

      if (owned !== items.length) {
        return null;
      }

      return Promise.all(
        items.map((item) =>
          tx.list.update({ where: { id: item.id }, data: { order: item.order } })
        )
      );
    });
  } catch {
    return { error: "Failed to re-order" };
  }

  if (!lists) {
    return { error: "Lists not found on this board" };
  }

  revalidatePath(`/board/${boardId}`);

  return { data: lists };
};

export const updateListOrder = createSafeAction(UpdateListOrder, handler);
