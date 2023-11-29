import { beforeEach, describe, expect, it, vi } from "vitest";

import { createBoard } from "@/actions/createBoard";
import { deleteBoard } from "@/actions/deleteBoard";
import { BOARD_LIMIT_ERROR, MAX_FREE_BOARDS } from "@/constants/boards";
import { db } from "@/lib/db";

import { signInAs } from "../mocks/clerk";
import { COVER, createBoard as seedBoard, makePro, resetDb } from "../helpers/db";

vi.mock("next/navigation", () => ({ redirect: vi.fn() }));

const limitFor = async (orgId: string) =>
  (await db.orgLimit.findUnique({ where: { orgId } }))?.count ?? 0;

describe("createBoard limit", () => {
  beforeEach(async () => {
    await resetDb();
    signInAs("user_1", "org_a");
  });

  it("lets exactly MAX_FREE_BOARDS through when requests race", async () => {
    const results = await Promise.all(
      Array.from({ length: MAX_FREE_BOARDS + 3 }, (_, i) =>
        createBoard({ title: `Board ${i}`, image: COVER })
      )
    );

    expect(results.filter((r) => r.data)).toHaveLength(MAX_FREE_BOARDS);
    expect(results.filter((r) => r.error === BOARD_LIMIT_ERROR)).toHaveLength(3);
    expect(await db.board.count({ where: { orgId: "org_a" } })).toBe(MAX_FREE_BOARDS);
    expect(await limitFor("org_a")).toBe(MAX_FREE_BOARDS);
  });

  it("lets Pro orgs past the limit but still counts their boards", async () => {
    await makePro("org_a");

    for (let i = 0; i < MAX_FREE_BOARDS + 2; i++) {
      expect((await createBoard({ title: `Board ${i}`, image: COVER })).data).toBeDefined();
    }

    expect(await limitFor("org_a")).toBe(MAX_FREE_BOARDS + 2);
  });

  it("frees a slot when a board is deleted", async () => {
    const boards = [];
    for (let i = 0; i < MAX_FREE_BOARDS; i++) {
      boards.push((await createBoard({ title: `Board ${i}`, image: COVER })).data!);
    }
    expect((await createBoard({ title: "One more", image: COVER })).error).toBe(BOARD_LIMIT_ERROR);

    await deleteBoard({ id: boards[0].id });

    expect(await limitFor("org_a")).toBe(MAX_FREE_BOARDS - 1);
    expect((await createBoard({ title: "One more", image: COVER })).data).toBeDefined();
  });
});

describe("deleteBoard", () => {
  beforeEach(async () => {
    await resetDb();
    signInAs("user_1", "org_a");
  });

  it("cannot delete another org's board", async () => {
    const foreign = await seedBoard("org_b");

    const result = await deleteBoard({ id: foreign.id });

    expect(result.error).toBe("Failed to delete");
    expect(await db.board.count({ where: { id: foreign.id } })).toBe(1);
  });
});
