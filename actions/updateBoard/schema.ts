import { z } from "zod";

import { entityId, titleField } from "@/lib/schemas";

export const UpdateBoard = z.object({
  title: titleField(3, 60),
  id: entityId,
});
