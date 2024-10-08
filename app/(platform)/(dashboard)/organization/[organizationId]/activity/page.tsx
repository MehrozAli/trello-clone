import { Suspense } from "react";

import { Separator } from "@/components/ui/separator";
import { checkSubscription } from "@/lib/subscription";

import { Info } from "../_components/Info";
import { ActivityList } from "./_components/ActivityList";

const ActivityPage = async () => {
  const isPro = await checkSubscription();

  return (
    <div className="w-full">
      <Info isPro={isPro} />
      <Separator className="my-2" />

      <Suspense fallback={<ActivityList.Skeleton />}>
        <ActivityList />
      </Suspense>
    </div>
  );
};

export default ActivityPage;
