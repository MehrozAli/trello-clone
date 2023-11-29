import { z } from "zod";

import { entityId } from "@/lib/schemas";

export const DeleteCard = z.object({
  id: entityId,
  boardId: entityId,
});
