import { describe, expect, it, vi } from "vitest";
import { z } from "zod";

import { createSafeAction } from "@/lib/createSafeAction";

const schema = z.object({ title: z.string().min(3, "Title is too short") });

describe("createSafeAction", () => {
  it("returns field errors and skips the handler on invalid input", async () => {
    const handler = vi.fn();
    const action = createSafeAction(schema, handler);

    const result = await action({ title: "ab" });

    expect(result.fieldErrors).toEqual({ title: ["Title is too short"] });
    expect(handler).not.toHaveBeenCalled();
  });

  it("passes parsed data to the handler", async () => {
    const action = createSafeAction(schema, async (data) => ({ data: data.title }));

    await expect(action({ title: "Launch" })).resolves.toEqual({ data: "Launch" });
  });
});
