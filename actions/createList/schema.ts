import { z } from "zod";

import { entityId, titleField } from "@/lib/schemas";

export const CreateList = z.object({
  title: titleField(2, 60),
  boardId: entityId,
});
