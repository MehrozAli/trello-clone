import { beforeEach, describe, expect, it } from "vitest";

import { createList } from "@/actions/createList";
import { db } from "@/lib/db";

import { signInAs, signOut } from "../mocks/clerk";
import { createBoard, resetDb } from "../helpers/db";

describe("createList", () => {
  beforeEach(async () => {
    await resetDb();
    signInAs("user_1", "org_a");
  });

  it("appends a list to a board in the active org and logs it", async () => {
    const board = await createBoard("org_a");

    const first = await createList({ boardId: board.id, title: "Backlog" });
    const second = await createList({ boardId: board.id, title: "Doing" });

    expect(first.data?.order).toBe(1);
    expect(second.data?.order).toBe(2);
    expect(await db.auditLog.count({ where: { orgId: "org_a" } })).toBe(2);
  });

  it("refuses a board that belongs to another org", async () => {
    const board = await createBoard("org_b");

    const result = await createList({ boardId: board.id, title: "Sneaky" });

    expect(result.error).toBe("Board not found");
    expect(await db.list.count()).toBe(0);
  });

  it("refuses signed-out callers", async () => {
    signOut();
    const board = await createBoard("org_a");

    expect(await createList({ boardId: board.id, title: "Backlog" })).toEqual({
      error: "Unauthorized",
    });
  });
});
