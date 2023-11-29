// Stand-in for @clerk/nextjs/server in demo builds (see next.config.js).
// A cookie set by the demo sign-in page decides whether you are signed in;
// nothing here talks to Clerk.
import { cookies } from "next/headers";
import { NextResponse, type NextFetchEvent, type NextRequest } from "next/server";

import { DEMO_COOKIE, DEMO_ORG, DEMO_USER } from "./identity";

const session = (signedIn: boolean, url = "http://localhost/") => ({
  userId: signedIn ? DEMO_USER.id : null,
  orgId: signedIn ? DEMO_ORG.id : null,
  orgSlug: signedIn ? DEMO_ORG.slug : null,
  redirectToSignIn: () => NextResponse.redirect(new URL("/sign-in", url)),
});

export const auth = async () =>
  session((await cookies()).get(DEMO_COOKIE)?.value === "1");

export const currentUser = async () => ((await auth()).userId ? DEMO_USER : null);

type Handler = (
  auth: () => Promise<ReturnType<typeof session>>,
  req: NextRequest
) => Promise<Response | void> | Response | void;

export const clerkMiddleware =
  (handler: Handler, _options?: unknown) =>
  async (req: NextRequest, _event: NextFetchEvent) =>
    (await handler(
      async () => session(req.cookies.get(DEMO_COOKIE)?.value === "1", req.url),
      req
    )) ?? NextResponse.next();

export const createRouteMatcher = (patterns: string[]) => {
  const matchers = patterns.map((pattern) => new RegExp(`^${pattern}$`));

  return (req: NextRequest) => matchers.some((re) => re.test(req.nextUrl.pathname));
};
