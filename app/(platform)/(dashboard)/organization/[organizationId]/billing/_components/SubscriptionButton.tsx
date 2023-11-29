"use client";

import { toast } from "sonner";

import { stripeRedirect } from "@/actions/stripeRedirect";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { useStripeModal } from "@/hooks/useStripeModal";

interface SubscriptionButtonProps {
  isPro: boolean;
}

export const SubscriptionButton = ({ isPro }: SubscriptionButtonProps) => {
  const stripeModal = useStripeModal();
  const { execute, loading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (err) => toast.error(err),
  });

  const handleClick = () => {
    if (isPro) {
      execute({});
    } else {
      stripeModal.onOpen();
    }
  };

  return (
    <Button onClick={handleClick} variant="primary" disabled={loading}>
      {isPro ? "Manage Subscription" : "Upgrade to Pro"}
    </Button>
  );
};
