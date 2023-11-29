"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/lib/generated/prisma/enums";

import { ParsedInput, ReturnType } from "./types";
import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/createSafeAction";
import { CreateBoard } from "./schema";
import { createAuditLog } from "@/lib/createAuditLog";
import { claimBoardSlot } from "@/lib/orgLimit";
import { checkSubscription } from "@/lib/subscription";
import { BOARD_LIMIT_ERROR, MAX_FREE_BOARDS } from "@/constants/boards";

const handler = async (data: ParsedInput): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Not authenticated" };
  }

  const { title, image } = data;
  let board;

  const isPro = await checkSubscription();

  try {
    board = await db.$transaction(async (tx) => {
      const claimed = await claimBoardSlot(tx, orgId, isPro ? null : MAX_FREE_BOARDS);

      if (!claimed) {
        return null;
      }

      return tx.board.create({
        data: { title, orgId, ...image },
      });
    });

    if (!board) {
      return { error: BOARD_LIMIT_ERROR };
    }

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.CREATE,
    });
  } catch {
    return {
      error: "Failed to create new board",
    };
  }

  revalidatePath(`/board/${board.id}`);

  return { data: board };
};

export const createBoard = createSafeAction(CreateBoard, handler);
