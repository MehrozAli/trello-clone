import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook",
]);
// Route handlers answer 401 themselves instead of redirecting fetch() calls.
const isApiRoute = createRouteMatcher(["/api/(.*)"]);
const isOrgSelection = createRouteMatcher(["/select-org(.*)"]);

export default clerkMiddleware(
  async (auth, req) => {
    const { userId, orgId, redirectToSignIn } = await auth();

    if (!userId) {
      if (isPublicRoute(req) || isApiRoute(req)) {
        return NextResponse.next();
      }

      return redirectToSignIn({ returnBackUrl: req.url });
    }

    if (req.nextUrl.pathname === "/") {
      const path = orgId ? `/organization/${orgId}` : "/select-org";

      return NextResponse.redirect(new URL(path, req.url));
    }

    if (!orgId && !isOrgSelection(req) && !isPublicRoute(req) && !isApiRoute(req)) {
      return NextResponse.redirect(new URL("/select-org", req.url));
    }
  },
  {
    // Makes the org in the URL the active org before any server code runs,
    // so pages and actions never read data for a stale organisation.
    organizationSyncOptions: {
      organizationPatterns: ["/organization/:id", "/organization/:id/(.*)"],
    },
  }
);

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
