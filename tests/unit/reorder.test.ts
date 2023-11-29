import { describe, expect, it } from "vitest";

import { moveCard, reorderLists } from "@/lib/reorder";
import type { ListWithCards } from "@/types";

const at = new Date("2026-01-01T00:00:00Z");
const card = (id: string, listId: string, order: number) => ({
  id,
  listId,
  order,
  title: id,
  description: null,
  createdAt: at,
  updatedAt: at,
});
const list = (id: string, order: number, cardIds: string[]): ListWithCards => ({
  id,
  order,
  title: id,
  boardId: "board-1",
  createdAt: at,
  updatedAt: at,
  cards: cardIds.map((cardId, index) => card(cardId, id, index)),
});

const board = () => [list("todo", 0, ["a", "b", "c"]), list("done", 1, ["d"])];

describe("moveCard", () => {
  it("reorders within one list and reports only that list", () => {
    const lists = board();
    const result = moveCard(lists, { droppableId: "todo", index: 0 }, { droppableId: "todo", index: 2 });

    expect(result?.lists[0].cards.map((c) => c.id)).toEqual(["b", "c", "a"]);
    expect(result?.changed).toEqual([
      { id: "b", listId: "todo", order: 0 },
      { id: "c", listId: "todo", order: 1 },
      { id: "a", listId: "todo", order: 2 },
    ]);
  });

  it("moves between lists and renumbers both of them", () => {
    const result = moveCard(board(), { droppableId: "todo", index: 1 }, { droppableId: "done", index: 0 });

    expect(result?.lists[0].cards.map((c) => [c.id, c.order])).toEqual([["a", 0], ["c", 1]]);
    expect(result?.lists[1].cards.map((c) => [c.id, c.listId, c.order])).toEqual([
      ["b", "done", 0],
      ["d", "done", 1],
    ]);
    expect(result?.changed).toHaveLength(4);
  });

  it("does not mutate the lists it was given", () => {
    const lists = board();
    const snapshot = structuredClone(lists);

    moveCard(lists, { droppableId: "todo", index: 0 }, { droppableId: "done", index: 1 });

    expect(lists).toEqual(snapshot);
  });

  it("returns null for an unknown list or index", () => {
    expect(moveCard(board(), { droppableId: "nope", index: 0 }, { droppableId: "done", index: 0 })).toBeNull();
    expect(moveCard(board(), { droppableId: "todo", index: 9 }, { droppableId: "done", index: 0 })).toBeNull();
  });
});

describe("reorderLists", () => {
  it("moves a list and rewrites every order", () => {
    const result = reorderLists(board(), 1, 0);

    expect(result.map((l) => [l.id, l.order])).toEqual([["done", 0], ["todo", 1]]);
  });
});
