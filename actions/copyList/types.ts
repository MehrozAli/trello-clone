import { z } from "zod";
import type { List } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { CopyList } from "./schema";

export type InputType = z.input<typeof CopyList>;
export type ParsedInput = z.output<typeof CopyList>;
export type ReturnType = ActionState<InputType, List>;
