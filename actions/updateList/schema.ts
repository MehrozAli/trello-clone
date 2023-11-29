import { z } from "zod";

import { entityId, titleField } from "@/lib/schemas";

export const UpdateList = z.object({
  title: titleField(2, 60),
  id: entityId,
  boardId: entityId,
});
