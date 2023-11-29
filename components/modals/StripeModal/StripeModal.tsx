"use client";

import { toast } from "sonner";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useStripeModal } from "@/hooks/useStripeModal";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { stripeRedirect } from "@/actions/stripeRedirect";
import { MAX_FREE_BOARDS } from "@/constants/boards";

export const StripeModal = () => {
  const stripeModal = useStripeModal();

  const { execute, loading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (err) => toast.error(err),
  });

  return (
    <Dialog open={stripeModal.isOpen} onOpenChange={stripeModal.onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="h-28 bg-[url('/covers/arcs.svg')] bg-cover bg-center" aria-hidden />

        <div className="mx-auto space-y-5 p-6">
          <DialogTitle className="font-display text-2xl">Upgrade to Taskify Pro</DialogTitle>

          <p className="text-sm text-muted-foreground">
            Free workspaces hold {MAX_FREE_BOARDS} boards. Pro lifts that limit for
            the whole workspace. Billing runs through Stripe Checkout and can be
            managed or cancelled from the Billing page.
          </p>

          <Button disabled={loading} onClick={() => execute({})} variant="primary" className="w-full">
            Continue to checkout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
