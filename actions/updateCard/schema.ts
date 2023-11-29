import { z } from "zod";

import { entityId, titleField } from "@/lib/schemas";

export const UpdateCard = z
  .object({
    title: titleField(2, 120).optional(),
    id: entityId,
    boardId: entityId,
    description: z
      .string({ error: "Description is required" })
      .trim()
      .min(3, { error: "Description is too short" })
      .max(5000, { error: "Description must be 5000 characters or fewer" })
      .optional(),
  })
  .refine((data) => data.title !== undefined || data.description !== undefined, {
    error: "Nothing to update",
    path: ["title"],
  });
