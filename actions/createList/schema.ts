import { z } from "zod";

export const CreateList = z.object({
  title: z
    .string({ error: "Title is required" })
    .min(2, { message: "Title is too short" }),
  boardId: z.string(),
});
