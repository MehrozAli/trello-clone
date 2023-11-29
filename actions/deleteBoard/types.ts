import { z } from "zod";
import type { Board } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { DeleteBoard } from "./schema";

export type InputType = z.input<typeof DeleteBoard>;
export type ParsedInput = z.output<typeof DeleteBoard>;
export type ReturnType = ActionState<InputType, Board>;
