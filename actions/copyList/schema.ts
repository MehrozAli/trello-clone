import { z } from "zod";

import { entityId } from "@/lib/schemas";

export const CopyList = z.object({
  id: entityId,
  boardId: entityId,
});
