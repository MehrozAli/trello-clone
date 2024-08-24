"use client";

import { PropsWithChildren } from "react";

export const ListWrapper = ({ children }: PropsWithChildren) => {
  return <li className="shrink-0 h-full w-[272px] select-none">{children}</li>;
};
