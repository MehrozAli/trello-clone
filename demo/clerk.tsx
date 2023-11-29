"use client";

// Stand-in for @clerk/nextjs components and hooks in demo builds.
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { PropsWithChildren } from "react";

import { DEMO_COOKIE, DEMO_ORG, DEMO_USER } from "./identity";

const ORG_HOME = `/organization/${DEMO_ORG.id}`;

export const ClerkProvider = ({ children }: PropsWithChildren<Record<string, unknown>>) => children;

export const useOrganization = () => ({ isLoaded: true, organization: DEMO_ORG });

export const useOrganizationList = (_options?: unknown) => ({
  isLoaded: true,
  setActive: async (_params: unknown) => {},
  userMemberships: { isLoading: false, data: [{ organization: DEMO_ORG }] },
});

export const OrganizationSwitcher = (_props: Record<string, unknown>) => (
  <Link
    href={ORG_HOME}
    className="flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium hover:bg-muted"
  >
    <Image src={DEMO_ORG.imageUrl} alt="" width={24} height={24} className="rounded-sm" />
    <span className="hidden sm:inline">{DEMO_ORG.name}</span>
  </Link>
);

export const UserButton = (_props: Record<string, unknown>) => {
  const router = useRouter();

  const signOut = () => {
    document.cookie = `${DEMO_COOKIE}=; Max-Age=0; path=/`;
    router.push("/");
    router.refresh();
  };

  return (
    <button
      type="button"
      onClick={signOut}
      title="Sign out of the demo"
      aria-label="Sign out of the demo"
      className="flex items-center gap-2 rounded-full pr-2 text-xs text-muted-foreground hover:bg-muted"
    >
      <Image src={DEMO_USER.imageUrl} alt="" width={32} height={32} className="rounded-full" />
      <span className="hidden sm:inline">Demo · sign out</span>
    </button>
  );
};

const DemoGate = ({ heading }: { heading: string }) => {
  const router = useRouter();

  const enter = () => {
    document.cookie = `${DEMO_COOKIE}=1; path=/; SameSite=Lax`;
    router.push(ORG_HOME);
    router.refresh();
  };

  return (
    <div className="w-full max-w-sm rounded-xl border bg-card p-8 text-center shadow-sm">
      <h1 className="font-display text-2xl">{heading}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This build runs in demo mode: Clerk is replaced by a local stand-in and you
        join the sample workspace as {DEMO_USER.firstName} {DEMO_USER.lastName}.
      </p>
      <button
        type="button"
        onClick={enter}
        className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Enter the demo workspace
      </button>
    </div>
  );
};

export const SignIn = () => <DemoGate heading="Sign in" />;
export const SignUp = () => <DemoGate heading="Create an account" />;
export const OrganizationList = (_props: Record<string, unknown>) => (
  <DemoGate heading="Choose a workspace" />
);

export const OrganizationProfile = (_props: Record<string, unknown>) => (
  <section className="w-full rounded-xl border bg-card p-6">
    <h2 className="font-display text-xl">{DEMO_ORG.name}</h2>
    <p className="mt-2 text-sm text-muted-foreground">
      Members, invitations and roles are managed by Clerk&apos;s OrganizationProfile
      component in a real deployment. Demo mode shows this placeholder instead.
    </p>
  </section>
);
