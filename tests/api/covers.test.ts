import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { GET } from "@/app/api/covers/route";
import { LOCAL_COVERS } from "@/lib/covers";

import { signInAs, signOut } from "../mocks/clerk";

const photo = {
  id: "abc",
  alt_description: "a lake at dawn",
  urls: { thumb: "https://images.unsplash.com/t", full: "https://images.unsplash.com/f" },
  links: { html: "https://unsplash.com/photos/abc" },
  user: { name: "Jane Doe" },
};

describe("GET /api/covers", () => {
  const fetchMock = vi.fn();

  beforeEach(() => {
    signInAs("user_1", "org_a");
    fetchMock.mockReset();
    vi.stubGlobal("fetch", fetchMock);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("serves the bundled covers without calling Unsplash when no key is set", async () => {
    vi.stubEnv("UNSPLASH_ACCESS_KEY", "");

    const body = await (await GET()).json();

    expect(body).toEqual(LOCAL_COVERS);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("maps Unsplash photos and keeps the key in a server-side header", async () => {
    vi.stubEnv("UNSPLASH_ACCESS_KEY", "test-access-key");
    fetchMock.mockResolvedValue(new Response(JSON.stringify([photo])));

    const body = await (await GET()).json();

    expect(body).toEqual([
      {
        id: "abc",
        thumbUrl: photo.urls.thumb,
        fullUrl: photo.urls.full,
        linkHtml: photo.links.html,
        userName: "Jane Doe",
        alt: "a lake at dawn",
      },
    ]);
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).not.toContain("test-access-key");
    expect(init.headers.Authorization).toBe("Client-ID test-access-key");
  });

  it("falls back to bundled covers when Unsplash fails", async () => {
    vi.stubEnv("UNSPLASH_ACCESS_KEY", "test-access-key");
    fetchMock.mockResolvedValue(new Response("rate limited", { status: 403 }));

    expect(await (await GET()).json()).toEqual(LOCAL_COVERS);
  });

  it("requires a signed-in user", async () => {
    signOut();

    expect((await GET()).status).toBe(401);
  });
});
