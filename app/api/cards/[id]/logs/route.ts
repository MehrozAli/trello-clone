import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ENTITY_TYPE } from "@/lib/generated/prisma/enums";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId, orgId } = await auth();

    if (!userId || !orgId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const auditLogs = await db.auditLog.findMany({
      where: { orgId, entityId: id, entityType: ENTITY_TYPE.Card },
      orderBy: { createdAt: "desc" },
      take: 3,
    });

    return NextResponse.json(auditLogs);
  } catch {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
