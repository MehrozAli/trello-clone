"use client";

import { CardModal } from "@/components/modals/CardModal/CardModal";
import { StripeModal } from "@/components/modals/StripeModal/StripeModal";

export const ModalProvider = () => {
  return (
    <>
      <CardModal />
      <StripeModal />
    </>
  );
};
