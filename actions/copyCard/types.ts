import { z } from "zod";
import type { Card } from "@/lib/generated/prisma/client";

import { ActionState } from "@/lib/createSafeAction";
import { CopyCard } from "./schema";

export type InputType = z.input<typeof CopyCard>;
export type ParsedInput = z.output<typeof CopyCard>;
export type ReturnType = ActionState<InputType, Card>;
