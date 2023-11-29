import { z } from "zod";
import type { Card } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { DeleteCard } from "./schema";

export type InputType = z.input<typeof DeleteCard>;
export type ParsedInput = z.output<typeof DeleteCard>;
export type ReturnType = ActionState<InputType, Card>;
