import { z } from "zod";
import type { Card } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { UpdateCardOrder } from "./schema";

export type InputType = z.input<typeof UpdateCardOrder>;
export type ParsedInput = z.output<typeof UpdateCardOrder>;
export type ReturnType = ActionState<InputType, Card[]>;
