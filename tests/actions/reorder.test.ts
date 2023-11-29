import { beforeEach, describe, expect, it } from "vitest";

import { updateCardOrder } from "@/actions/updateCardOrder";
import { updateListOrder } from "@/actions/updateListOrder";
import { db } from "@/lib/db";

import { signInAs } from "../mocks/clerk";
import { createBoard, createCard, createList, resetDb } from "../helpers/db";

const ordersOf = async (listId: string) =>
  (await db.card.findMany({ where: { listId }, orderBy: { order: "asc" } })).map(
    (card) => [card.title, card.order]
  );

describe("updateCardOrder", () => {
  beforeEach(async () => {
    await resetDb();
    signInAs("user_1", "org_a");
  });

  it("moves a card across lists and keeps both lists contiguous", async () => {
    const board = await createBoard("org_a");
    const todo = await createList(board.id, "Todo", 0);
    const done = await createList(board.id, "Done", 1);
    const [a, b] = [await createCard(todo.id, "a", 0), await createCard(todo.id, "b", 1)];
    await createCard(todo.id, "c", 2);
    const d = await createCard(done.id, "d", 0);

    // The old client only sent the destination list; the source must still be renumbered.
    const result = await updateCardOrder({
      boardId: board.id,
      items: [
        { id: b.id, listId: done.id, order: 0 },
        { id: d.id, listId: done.id, order: 1 },
      ],
    });

    expect(result.error).toBeUndefined();
    expect(await ordersOf(todo.id)).toEqual([["a", 0], ["c", 1]]);
    expect(await ordersOf(done.id)).toEqual([["b", 0], ["d", 1]]);
    expect((await db.card.findUniqueOrThrow({ where: { id: a.id } })).listId).toBe(todo.id);
  });

  it("refuses to move a card into a list owned by another org", async () => {
    const board = await createBoard("org_a");
    const list = await createList(board.id, "Mine", 0);
    const card = await createCard(list.id, "secret", 0);
    const foreignBoard = await createBoard("org_b");
    const foreignList = await createList(foreignBoard.id, "Theirs", 0);

    const result = await updateCardOrder({
      boardId: board.id,
      items: [{ id: card.id, listId: foreignList.id, order: 0 }],
    });

    expect(result.error).toBe("Cards not found on this board");
    expect((await db.card.findUniqueOrThrow({ where: { id: card.id } })).listId).toBe(list.id);
  });

  it("refuses cards that sit on another board of the same org", async () => {
    const board = await createBoard("org_a");
    const list = await createList(board.id, "Here", 0);
    const otherBoard = await createBoard("org_a", "Other");
    const otherList = await createList(otherBoard.id, "There", 0);
    const stray = await createCard(otherList.id, "stray", 0);

    const result = await updateCardOrder({
      boardId: board.id,
      items: [{ id: stray.id, listId: list.id, order: 0 }],
    });

    expect(result.error).toBe("Cards not found on this board");
    expect((await db.card.findUniqueOrThrow({ where: { id: stray.id } })).listId).toBe(otherList.id);
  });

  it("rejects the same card twice in one request", async () => {
    const [boardId, cardId, listId] = [crypto.randomUUID(), crypto.randomUUID(), crypto.randomUUID()];
    const result = await updateCardOrder({
      boardId,
      items: [
        { id: cardId, listId, order: 0 },
        { id: cardId, listId, order: 1 },
      ],
    });

    expect(result.fieldErrors?.items).toEqual(["Each card may appear only once"]);
  });
});

describe("updateListOrder", () => {
  beforeEach(async () => {
    await resetDb();
    signInAs("user_1", "org_a");
  });

  it("reorders lists on the board", async () => {
    const board = await createBoard("org_a");
    const first = await createList(board.id, "First", 0);
    const second = await createList(board.id, "Second", 1);

    const result = await updateListOrder({
      boardId: board.id,
      items: [
        { id: second.id, order: 0 },
        { id: first.id, order: 1 },
      ],
    });

    expect(result.error).toBeUndefined();
    const lists = await db.list.findMany({ where: { boardId: board.id }, orderBy: { order: "asc" } });
    expect(lists.map((l) => l.title)).toEqual(["Second", "First"]);
  });

  it("leaves lists of other boards and orgs untouched", async () => {
    const board = await createBoard("org_a");
    const mine = await createList(board.id, "Mine", 0);
    const otherBoard = await createBoard("org_a", "Other");
    const otherList = await createList(otherBoard.id, "Other", 5);
    const foreign = await createList((await createBoard("org_b")).id, "Foreign", 7);

    const result = await updateListOrder({
      boardId: board.id,
      items: [
        { id: mine.id, order: 0 },
        { id: otherList.id, order: 1 },
        { id: foreign.id, order: 2 },
      ],
    });

    expect(result.error).toBe("Lists not found on this board");
    expect((await db.list.findUniqueOrThrow({ where: { id: otherList.id } })).order).toBe(5);
    expect((await db.list.findUniqueOrThrow({ where: { id: foreign.id } })).order).toBe(7);
  });
});
