import { z } from "zod";
import type { List } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { DeleteList } from "./schema";

export type InputType = z.infer<typeof DeleteList>;
export type ReturnType = ActionState<InputType, List>;
