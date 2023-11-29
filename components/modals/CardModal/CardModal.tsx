"use client";

import { useQuery } from "@tanstack/react-query";
import type { AuditLog } from "@/lib/generated/prisma/client";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useCardModal } from "@/hooks/useCardModal";
import { CardWithList } from "@/types";
import { fetcher } from "@/lib/fetcher";

import { Header } from "./Header";
import { Description } from "./Description";
import { Actions } from "./Actions";
import { Activity } from "./Activity";

export const CardModal = () => {
  const id = useCardModal((state) => state.id);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const { data: cardData } = useQuery<CardWithList>({
    queryKey: ["card", id],
    queryFn: () => fetcher(`/api/cards/${id}`),
    enabled: Boolean(id),
  });

  const { data: auditLogs } = useQuery<AuditLog[]>({
    queryKey: ["card-logs", id],
    queryFn: () => fetcher(`/api/cards/${id}/logs`),
    enabled: Boolean(id),
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle className="sr-only">{cardData?.title ?? "Card details"}</DialogTitle>
        {!cardData ? <Header.Skeleton /> : <Header card={cardData} />}

        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className="col-span-3">
            <div className="w-full space-y-6">
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description card={cardData} />
              )}

              {!auditLogs ? (
                <Activity.Skeleton />
              ) : (
                <Activity items={auditLogs} />
              )}
            </div>
          </div>

          {!cardData ? <Actions.Skeleton /> : <Actions card={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};
