import { z } from "zod";
import type { List } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { UpdateList } from "./schema";

export type InputType = z.infer<typeof UpdateList>;
export type ReturnType = ActionState<InputType, List>;
