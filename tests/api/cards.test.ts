import { beforeEach, describe, expect, it } from "vitest";

import { GET } from "@/app/api/cards/[id]/route";

import { signInAs, signOut } from "../mocks/clerk";
import { createBoard, createCard, createList, resetDb } from "../helpers/db";

const get = (id: string) =>
  GET(new Request(`http://localhost/api/cards/${id}`), { params: Promise.resolve({ id }) });

describe("GET /api/cards/:id", () => {
  beforeEach(async () => {
    await resetDb();
    signInAs("user_1", "org_a");
  });

  it("returns the card with its list title", async () => {
    const list = await createList((await createBoard("org_a")).id, "Doing", 0);
    const card = await createCard(list.id, "Ship it", 0);

    const response = await get(card.id);

    expect(response.status).toBe(200);
    expect(await response.json()).toMatchObject({ title: "Ship it", list: { title: "Doing" } });
  });

  it("answers 404 for a card in another org", async () => {
    const list = await createList((await createBoard("org_b")).id, "Theirs", 0);
    const card = await createCard(list.id, "Private", 0);

    expect((await get(card.id)).status).toBe(404);
  });

  it("answers 401 when signed out", async () => {
    signOut();

    expect((await get(crypto.randomUUID())).status).toBe(401);
  });
});
