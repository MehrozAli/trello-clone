import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { db } from "@/lib/db";
import { ListContainer } from "./_components/ListContainer";

interface Props {
  params: { boardId: string };
}

export default async function BoardPage({ params }: Props) {
  const { boardId } = params;
  const { orgId } = auth();

  if (!orgId) {
    redirect("/select-org");
  }

  const lists = await db.list.findMany({
    where: { boardId, board: { orgId } },
    include: { cards: { orderBy: { order: "asc" } } },
    orderBy: { order: "asc" },
  });

  return (
    <div className="p-4 h-full overflow-x-auto">
      <ListContainer boardId={boardId} lists={lists} />
    </div>
  );
}
