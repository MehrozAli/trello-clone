import { z } from "zod";
import type { Card } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { UpdateCard } from "./schema";

export type InputType = z.input<typeof UpdateCard>;
export type ParsedInput = z.output<typeof UpdateCard>;
export type ReturnType = ActionState<InputType, Card>;
