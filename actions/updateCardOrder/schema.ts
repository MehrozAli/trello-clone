import { z } from "zod";

import { entityId } from "@/lib/schemas";

export const UpdateCardOrder = z.object({
  boardId: entityId,
  items: z
    .array(
      z.object({
        id: entityId,
        order: z.number().int().min(0),
        listId: entityId,
      })
    )
    .min(1)
    .max(500)
    .refine((items) => new Set(items.map((item) => item.id)).size === items.length, {
      error: "Each card may appear only once",
    }),
});
