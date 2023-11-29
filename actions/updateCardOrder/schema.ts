import { z } from "zod";

export const UpdateCardOrder = z.object({
  boardId: z.string().min(1),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number().int().min(0),
        listId: z.string().min(1),
      })
    )
    .min(1)
    .max(500)
    .refine((items) => new Set(items.map((item) => item.id)).size === items.length, {
      error: "Each card may appear only once",
    }),
});
