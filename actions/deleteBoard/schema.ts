import { z } from "zod";

import { entityId } from "@/lib/schemas";

export const DeleteBoard = z.object({
  id: entityId,
});
