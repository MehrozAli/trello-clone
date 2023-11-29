import { z } from "zod";

import { entityId } from "@/lib/schemas";

export const UpdateListOrder = z.object({
  boardId: entityId,
  items: z
    .array(
      z.object({
        id: entityId,
        order: z.number().int().min(0),
      })
    )
    .min(1)
    .max(200)
    .refine((items) => new Set(items.map((item) => item.id)).size === items.length, {
      error: "Each list may appear only once",
    }),
});
