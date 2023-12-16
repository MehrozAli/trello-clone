import { PropsWithChildren } from "react";
import { OrgControl } from "./_components/OrgControl";

const OrganizationLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <OrgControl />
      {children}
    </>
  );
};

export default OrganizationLayout;
