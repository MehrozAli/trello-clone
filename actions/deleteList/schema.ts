import { z } from "zod";

import { entityId } from "@/lib/schemas";

export const DeleteList = z.object({
  id: entityId,
  boardId: entityId,
});
