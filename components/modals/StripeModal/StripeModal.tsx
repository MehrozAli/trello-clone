"use client";

import Image from "next/image";
import { toast } from "sonner";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useStripeModal } from "@/hooks/useStripeModal";
import { Button } from "@/components/ui/button";
import { useAction } from "@/hooks/useAction";
import { stripeRedirect } from "@/actions/stripeRedirect";

export const StripeModal = () => {
  const stripeModal = useStripeModal();

  const { execute, loading } = useAction(stripeRedirect, {
    onSuccess: (data) => {
      window.location.href = data;
    },
    onError: (err) => toast.error(err),
  });

  const onClick = () => {
    execute({});
  };

  return (
    <Dialog open={stripeModal.isOpen} onOpenChange={stripeModal.onClose}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <div className="aspect-video relative flex items-center justify-center">
          <Image src="/stripe.png" alt="hero" className="object-cover" fill />
        </div>

        <div className="text-neutral-700 mx-auto space-y-6 p-6">
          <h2 className="font-semibold text-xl">
            Upgrade to Taskify Pro today!
          </h2>

          <p className="font-semibold text-xs text-neutral-600">
            Explore the best of Taskify
          </p>

          <div className="pl-3">
            <ul className="text-sm list-disc">
              <li>Unlimited Boards</li>
              <li>Advanced Checklist</li>
              <li>Admin and Security Features</li>
              <li>And more!</li>
            </ul>
          </div>

          <Button
            disabled={loading}
            onClick={onClick}
            variant="primary"
            className="w-full"
          >
            Upgrade
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
