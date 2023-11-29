import { describe, expect, it } from "vitest";

import { CreateBoard } from "@/actions/createBoard/schema";
import { UpdateCard } from "@/actions/updateCard/schema";
import { coverImage, entityId, titleField } from "@/lib/schemas";

const cover = (parts: Partial<Record<"id" | "thumb" | "full" | "link" | "user", string>> = {}) =>
  [
    parts.id ?? "harbour",
    parts.thumb ?? "/covers/harbour.svg",
    parts.full ?? "/covers/harbour.svg",
    parts.link ?? "/covers/harbour.svg",
    parts.user ?? "Taskify",
  ].join("|");

describe("coverImage", () => {
  it("accepts a bundled cover and maps it to board fields", () => {
    expect(coverImage.parse(cover())).toEqual({
      imageId: "harbour",
      imageThumbUrl: "/covers/harbour.svg",
      imageFullUrl: "/covers/harbour.svg",
      imageLinkHtml: "/covers/harbour.svg",
      imageUserName: "Taskify",
    });
  });

  it("accepts Unsplash photos", () => {
    const value = cover({
      id: "Xq-1",
      thumb: "https://images.unsplash.com/photo-1?w=200",
      full: "https://images.unsplash.com/photo-1",
      link: "https://unsplash.com/photos/Xq-1",
      user: "Jane Doe",
    });

    expect(coverImage.safeParse(value).success).toBe(true);
  });

  it.each([
    ["an arbitrary host", cover({ full: "https://tracker.example/pixel.gif" })],
    ["a CSS breakout", cover({ full: "/covers/a.svg) ; background: red" })],
    ["a javascript: link", cover({ link: "javascript:alert(1)" })],
    ["too few parts", "harbour|/covers/harbour.svg"],
    ["an empty credit", cover({ user: " " })],
  ])("rejects %s", (_label, value) => {
    expect(coverImage.safeParse(value).success).toBe(false);
  });
});

describe("field rules", () => {
  it("trims titles before checking length", () => {
    const title = titleField(3, 10);

    expect(title.parse("  Plan  ")).toBe("Plan");
    expect(title.safeParse("  a  ").success).toBe(false);
    expect(title.safeParse("x".repeat(11)).success).toBe(false);
  });

  it("only accepts UUIDs as ids", () => {
    expect(entityId.safeParse(crypto.randomUUID()).success).toBe(true);
    expect(entityId.safeParse("1 OR 1=1").success).toBe(false);
  });

  it("reports a missing cover on the image field", () => {
    const result = CreateBoard.safeParse({ title: "Roadmap", image: null });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0]).toMatchObject({ path: ["image"], message: "Image is required" });
  });

  it("requires something to change on a card", () => {
    const ids = { id: crypto.randomUUID(), boardId: crypto.randomUUID() };

    expect(UpdateCard.safeParse(ids).success).toBe(false);
    expect(UpdateCard.safeParse({ ...ids, title: "New name" }).success).toBe(true);
  });
});
