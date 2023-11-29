"use client";

import Image from "next/image";
import { Activity, CreditCard, PanelsTopLeft, Settings } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface Organization {
  id: string;
  slug: string | null;
  imageUrl: string;
  name: string;
}

interface Props {
  isExpanded: boolean;
  isActive: boolean;
  organization: Organization;
  onExpand: (id: string) => void;
}

export const NavItem = ({
  isActive,
  isExpanded,
  organization,
  onExpand,
}: Props) => {
  const pathname = usePathname();
  const router = useRouter();
  const routes = [
    {
      label: "Boards",
      icon: <PanelsTopLeft className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}`,
    },
    {
      label: "Activity",
      icon: <Activity className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/activity`,
    },
    {
      label: "Settings",
      icon: <Settings className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/settings`,
    },
    {
      label: "Billing",
      icon: <CreditCard className="h-4 w-4 mr-2" />,
      href: `/organization/${organization.id}/billing`,
    },
  ];

  const onClick = (href: string) => router.push(href);

  return (
    <AccordionItem value={organization.id} className="border-none">
      <AccordionTrigger
        onClick={() => onExpand(organization.id)}
        className={cn(
          "flex items-center gap-x-2 p-1.5 text-foreground rounded-md hover:bg-secondary transition text-start no-underline hover:no-underline",
          { "bg-primary/10 text-primary": isActive && !isExpanded }
        )}
      >
        <div className="flex items-center gap-x-2">
          <div className="w-7 h-7 relative">
            <Image
              src={organization.imageUrl}
              alt=""
              className="rounded-sm object-cover"
              width={50}
              height={50}
            />
          </div>

          <span className="font-medium text-sm">{organization.name}</span>
        </div>
      </AccordionTrigger>

      <AccordionContent className="p-1 text-foreground">
        {routes.map((route) => (
          <Button
            key={route.href}
            size="sm"
            onClick={() => onClick(route.href)}
            className={cn("w-full font-normal justify-start pl-10 mb-1", {
              "bg-primary/10 text-primary": pathname === route.href,
            })}
            variant="ghost"
          >
            {route.icon}
            {route.label}
          </Button>
        ))}
      </AccordionContent>
    </AccordionItem>
  );
};

NavItem.Skeleton = function Skelton() {
  return (
    <div className="flex items-center gap-x-2">
      <div className="h-10 w-10 relative shrink-0">
        <Skeleton className="h-full w-full absolute" />
      </div>
      <Skeleton className="h-10 w-full" />
    </div>
  );
};
