"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { ACTION, ENTITY_TYPE } from "@/lib/generated/prisma/enums";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { createSafeAction } from "@/lib/createSafeAction";
import { createAuditLog } from "@/lib/createAuditLog";
import { releaseBoardSlot } from "@/lib/orgLimit";

import { DeleteBoard } from "./schema";
import { InputType, ReturnType } from "./types";

const handler = async (data: InputType): Promise<ReturnType> => {
  const { userId, orgId } = await auth();

  if (!userId || !orgId) {
    return { error: "Unauthorized" };
  }

  const { id } = data;
  let board;

  try {
    board = await db.$transaction(async (tx) => {
      const deleted = await tx.board.delete({ where: { id, orgId } });
      await releaseBoardSlot(tx, orgId);

      return deleted;
    });

    await createAuditLog({
      entityTitle: board.title,
      entityId: board.id,
      entityType: ENTITY_TYPE.BOARD,
      action: ACTION.DELETE,
    });
  } catch {
    return { error: "Failed to delete" };
  }

  revalidatePath(`/organization/${orgId}`);
  redirect(`/organization/${orgId}`);
};

export const deleteBoard = createSafeAction(DeleteBoard, handler);
