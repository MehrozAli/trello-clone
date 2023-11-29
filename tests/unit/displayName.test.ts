import { describe, expect, it } from "vitest";

import { displayName } from "@/lib/createAuditLog";

type User = Parameters<typeof displayName>[0];
const user = (fields: Partial<Record<string, unknown>>) =>
  ({ firstName: null, lastName: null, username: null, primaryEmailAddress: null, ...fields }) as unknown as User;

describe("displayName", () => {
  it("joins whichever name parts exist", () => {
    expect(displayName(user({ firstName: "Ada", lastName: "Lovelace" }))).toBe("Ada Lovelace");
    expect(displayName(user({ firstName: "Ada" }))).toBe("Ada");
  });

  it("falls back to username, then email, never 'null null'", () => {
    expect(displayName(user({ username: "ada" }))).toBe("ada");
    expect(displayName(user({ primaryEmailAddress: { emailAddress: "ada@example.com" } }))).toBe("ada@example.com");
    expect(displayName(user({}))).toBe("Someone");
  });
});
