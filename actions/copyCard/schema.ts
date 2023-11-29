import { z } from "zod";

import { entityId } from "@/lib/schemas";

export const CopyCard = z.object({
  id: entityId,
  boardId: entityId,
});
