import { z } from "zod";
import type { List } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { CreateList } from "./schema";

export type InputType = z.input<typeof CreateList>;
export type ParsedInput = z.output<typeof CreateList>;
export type ReturnType = ActionState<InputType, List>;
