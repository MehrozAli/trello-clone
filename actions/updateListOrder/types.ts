import { z } from "zod";
import type { List } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { UpdateListOrder } from "./schema";

export type InputType = z.input<typeof UpdateListOrder>;
export type ParsedInput = z.output<typeof UpdateListOrder>;
export type ReturnType = ActionState<InputType, List[]>;
