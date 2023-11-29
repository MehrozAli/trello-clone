import { z } from "zod";

export type FieldErrors<T> = {
  [K in keyof T]?: string[];
};

export type ActionState<TInput, TOutput> = {
  fieldErrors?: FieldErrors<TInput>;
  error?: string | null;
  data?: TOutput;
};

/**
 * Wraps a server action so it only ever sees parsed data. The action takes
 * the schema's input type (what the form sends) and the handler receives its
 * output type (after trims and transforms).
 */
export const createSafeAction = <TSchema extends z.ZodType, TOutput>(
  schema: TSchema,
  handler: (
    validatedData: z.output<TSchema>
  ) => Promise<ActionState<z.input<TSchema>, TOutput>>
) => {
  return async (
    data: z.input<TSchema>
  ): Promise<ActionState<z.input<TSchema>, TOutput>> => {
    const validationResult = schema.safeParse(data);

    if (!validationResult.success) {
      return {
        fieldErrors: z.flattenError(validationResult.error)
          .fieldErrors as FieldErrors<z.input<TSchema>>,
      };
    }

    return handler(validationResult.data);
  };
};
