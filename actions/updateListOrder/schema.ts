import { z } from "zod";

export const UpdateListOrder = z.object({
  boardId: z.string().min(1),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        order: z.number().int().min(0),
      })
    )
    .min(1)
    .max(200)
    .refine((items) => new Set(items.map((item) => item.id)).size === items.length, {
      error: "Each list may appear only once",
    }),
});
