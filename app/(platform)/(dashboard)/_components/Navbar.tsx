import { Plus } from "lucide-react";
import { OrganizationSwitcher, UserButton } from "@clerk/nextjs";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { MobileSidebar } from "./MobileSidebar";
import { FormPopover } from "@/components/Form/FormPopover";

export const Navbar = () => {
  return (
    <nav className="fixed px-4 z-50 top-0 w-full h-14 border-b bg-card flex items-center">
      <MobileSidebar />

      <div className="flex items-center gap-4">
        <Logo />

        <FormPopover align="start" sideOffset={18}>
          <Button size="sm" className="hidden md:inline-flex h-8 px-3" variant="primary">
            <Plus className="h-4 w-4 mr-1" aria-hidden /> Create
          </Button>
        </FormPopover>

        <FormPopover>
          <Button variant="primary" size="sm" className="md:hidden h-8 w-8 p-0" aria-label="Create board">
            <Plus className="h-4 w-4" aria-hidden />
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

        <UserButton />
      </div>
    </nav>
  );
};
