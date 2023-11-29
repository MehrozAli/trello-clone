import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

export const Logo = ({ className }: { className?: string }) => {
  return (
    <Link
      href="/"
      className={cn(
        "items-center gap-x-2 rounded-md transition hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className ?? "hidden md:flex"
      )}
    >
      <Image src="/logo.svg" alt="" height={28} width={28} />
      <span className="font-display text-xl font-semibold text-foreground">Taskify</span>
    </Link>
  );
};
