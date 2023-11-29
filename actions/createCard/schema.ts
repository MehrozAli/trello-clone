import { z } from "zod";

import { entityId, titleField } from "@/lib/schemas";

export const CreateCard = z.object({
  title: titleField(2, 120),
  boardId: entityId,
  listId: entityId,
});
