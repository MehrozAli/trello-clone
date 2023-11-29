import { z } from "zod";
import type { Card } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { CreateCard } from "./schema";

export type InputType = z.input<typeof CreateCard>;
export type ParsedInput = z.output<typeof CreateCard>;
export type ReturnType = ActionState<InputType, Card>;
