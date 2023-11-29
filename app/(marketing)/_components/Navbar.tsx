import Link from "next/link";

import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo className="flex" />

        <nav className="flex items-center gap-2" aria-label="Account">
          <Button size="sm" variant="ghost" asChild>
            <Link href="/sign-in" prefetch={false}>Sign in</Link>
          </Button>

          <Button size="sm" variant="primary" asChild>
            <Link href="/sign-up" prefetch={false}>Start free</Link>
          </Button>
        </nav>
      </div>
    </header>
  );
};
