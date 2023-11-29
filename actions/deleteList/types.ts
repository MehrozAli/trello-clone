import { z } from "zod";
import type { List } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { DeleteList } from "./schema";

export type InputType = z.input<typeof DeleteList>;
export type ParsedInput = z.output<typeof DeleteList>;
export type ReturnType = ActionState<InputType, List>;
