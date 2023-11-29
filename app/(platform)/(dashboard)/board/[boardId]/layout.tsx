import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { PropsWithChildren } from "react";

import { db } from "@/lib/db";
import { BoardNavbar } from "./_components/BoardNavbar";

interface BoardPageLayoutProps {
  params: Promise<{ boardId: string }>;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ boardId: string }>;
}) {
  const { orgId } = await auth();
  const { boardId } = await params;

  if (!orgId) {
    return { title: "Board" };
  }

  const board = await db.board.findUnique({ where: { id: boardId, orgId } });

  return { title: board?.title || "Board" };
}

export default async function BoardPageLayout({
  children,
  params,
}: PropsWithChildren<BoardPageLayoutProps>) {
  const { orgId } = await auth();
  const { boardId } = await params;

  if (!orgId) {
    redirect("/select-org");
  }

  const board = await db.board.findUnique({ where: { id: boardId, orgId } });

  if (!board) {
    notFound();
  }

  return (
    <div
      className="relative h-full bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${board.imageFullUrl})` }}
    >
      <BoardNavbar board={board} />
      <div className="absolute inset-0 bg-black/10" />
      <main className="relative pt-28 h-full">{children}</main>
    </div>
  );
}
