import { PropsWithChildren } from "react";

import { Navbar } from "./_components/Navbar";
import { Footer } from "./_components/Footer";

const MarketingLayout = ({ children }: PropsWithChildren) => {
  return (
    <div className="flex min-h-full flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

export default MarketingLayout;
