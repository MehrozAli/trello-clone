import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

// Vitest runs without globals, so Testing Library cannot register this itself.
afterEach(() => {
  cleanup();
});

// Server actions and route handlers never reach Clerk or the Next.js cache in tests.
vi.mock("@clerk/nextjs/server", async () => {
  const { clerkServerMock } = await import("./mocks/clerk");
  return clerkServerMock;
});
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
