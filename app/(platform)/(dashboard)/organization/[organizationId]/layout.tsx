import { PropsWithChildren } from "react";
import { auth } from "@clerk/nextjs/server";

import { OrgControl } from "./_components/OrgControl";

const toTitle = (slug: string) =>
  slug
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");

export async function generateMetadata() {
  const { orgSlug } = await auth();

  return { title: toTitle(orgSlug || "organisation") };
}

const OrganizationLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default OrganizationLayout;
