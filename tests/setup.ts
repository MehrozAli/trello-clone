import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Server actions and route handlers never reach Clerk or the Next.js cache in tests.
vi.mock("@clerk/nextjs/server", async () => {
  const { clerkServerMock } = await import("./mocks/clerk");
  return clerkServerMock;
});
vi.mock("next/cache", () => ({ revalidatePath: vi.fn() }));
