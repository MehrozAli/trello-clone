import { auth } from "@clerk/nextjs/server";

import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma/client";

/**
 * Claims one board slot for the org in a single statement.
 *
 * The old check-then-increment let parallel requests all pass the check
 * before any of them incremented. Here the row lock taken by
 * INSERT .. ON CONFLICT DO UPDATE makes concurrent callers queue, and the
 * WHERE clause is re-checked against the latest count. Pass `limit: null`
 * for paid orgs: their boards are still counted so a lapsed plan sees the
 * real number.
 */
export const claimBoardSlot = async (
  tx: Prisma.TransactionClient,
  orgId: string,
  limit: number | null
) => {
  const rows = await tx.$queryRaw<{ count: number }[]>`
    INSERT INTO "OrgLimit" ("id", "orgId", "count", "createdAt", "updatedAt")
    VALUES (gen_random_uuid()::text, ${orgId}, 1, now(), now())
    ON CONFLICT ("orgId") DO UPDATE
      SET "count" = "OrgLimit"."count" + 1, "updatedAt" = now()
      WHERE ${limit}::int IS NULL OR "OrgLimit"."count" < ${limit}::int
    RETURNING "count"`;

  return rows.length > 0;
};

export const releaseBoardSlot = (tx: Prisma.TransactionClient, orgId: string) =>
  tx.orgLimit.updateMany({
    where: { orgId, count: { gt: 0 } },
    data: { count: { decrement: 1 } },
  });

export const getAvailableCount = async () => {
  const { orgId } = await auth();

  if (!orgId) {
    return 0;
  }

  const orgLimit = await db.orgLimit.findUnique({ where: { orgId } });

  return orgLimit ? orgLimit.count : 0;
};
