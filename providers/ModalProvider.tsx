"use client";

import { useEffect, useState } from "react";

import { CardModal } from "@/components/modals/CardModal/CardModal";
import { StripeModal } from "@/components/modals/StripeModal/StripeModal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return;
  }

  return (
    <>
      <CardModal />
      <StripeModal />
    </>
  );
};
