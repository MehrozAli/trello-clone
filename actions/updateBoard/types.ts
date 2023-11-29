import { z } from "zod";
import type { Board } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { UpdateBoard } from "./schema";

export type InputType = z.input<typeof UpdateBoard>;
export type ParsedInput = z.output<typeof UpdateBoard>;
export type ReturnType = ActionState<InputType, Board>;
