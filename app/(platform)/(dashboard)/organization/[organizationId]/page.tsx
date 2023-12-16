import { auth, OrganizationSwitcher } from "@clerk/nextjs";

const OrganizationPage = () => {
  const { orgId } = auth();

  return (
    <div>
      Organization: {orgId}
    </div>
  );
};

export default OrganizationPage;
