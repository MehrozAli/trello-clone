import { PlusIcon } from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./MobileSidebar";
import { FormPopover } from "@/components/Form/FormPopover";

export const Navbar = () => {
  return (
    <nav className="fixed px-4 z-50 top-0 w-full h-14 border-b shadow-sm bg-white flex items-center">
      <MobileSidebar />

      <div className="flex items-center gap-4">
        <div className="hidden md:flex">
          <Logo />
        </div>

        <FormPopover align="start" sideOffset={18}>
          <Button
            size="sm"
            className="rounded-sm hidden md:block h-auto py-1.5 px-2"
            variant="primary"
          >
            Create
          </Button>
        </FormPopover>

        <FormPopover>
          <Button
            variant="primary"
            size="sm"
            className="rounded-sm md:hidden block"
          >
            <PlusIcon className="h-4 w-4" />
          </Button>
        </FormPopover>
      </div>

      <div className="ml-auto flex items-center gap-x-2">
        <OrganizationSwitcher
          hidePersonal
          afterCreateOrganizationUrl="/organization/:id"
          afterLeaveOrganizationUrl="/select-org"
          afterSelectOrganizationUrl="/organization/:id"
          appearance={{
            elements: {
              rootBox: {
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              },
            },
          }}
        />

        <UserButton afterSignOutUrl="/" />
      </div>
    </nav>
  );
};
