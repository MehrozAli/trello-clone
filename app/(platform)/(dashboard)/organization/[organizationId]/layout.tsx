import { PropsWithChildren } from "react";
import { auth } from "@clerk/nextjs";
import { startCase } from "lodash";

import { OrgControl } from "./_components/OrgControl";

export async function generateMetadata() {
  const { orgSlug } = auth();

  return { title: startCase(orgSlug || "organisation") };
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
