import { z } from "zod";

import { ActionState } from "@/lib/createSafeAction";
import { StripeRedirect } from "./schema";

export type InputType = z.input<typeof StripeRedirect>;
export type ParsedInput = z.output<typeof StripeRedirect>;
export type ReturnType = ActionState<InputType, string>;
