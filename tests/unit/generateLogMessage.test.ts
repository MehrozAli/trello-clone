import { describe, expect, it } from "vitest";

import type { AuditLog } from "@/lib/generated/prisma/client";
import { generateAuditLog } from "@/lib/generateLogMessage";

const log = (overrides: Partial<AuditLog>): AuditLog => ({
  id: "log-1",
  orgId: "org_a",
  action: "CREATE",
  entityId: "card-1",
  entityType: "Card",
  entityTitle: "Write tests",
  userId: "user_1",
  userImage: "",
  userName: "Test User",
  createdAt: new Date(),
  updatedAt: new Date(),
  ...overrides,
});

describe("generateAuditLog", () => {
  it.each([
    ["CREATE", 'created card "Write tests"'],
    ["UPDATE", 'updated card "Write tests"'],
    ["DELETE", 'deleted card "Write tests"'],
  ] as const)("describes a %s", (action, expected) => {
    expect(generateAuditLog(log({ action }))).toBe(expected);
  });

  it("lower-cases the entity type", () => {
    expect(generateAuditLog(log({ entityType: "BOARD", entityTitle: "Q3" }))).toBe(
      'created board "Q3"'
    );
  });
});
