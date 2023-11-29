import { auth, currentUser } from "@clerk/nextjs/server";
import { ACTION, ENTITY_TYPE } from "@/lib/generated/prisma/enums";

import { db } from "@/lib/db";

interface CreateAuditLogProps {
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  action: ACTION;
}

type ClerkUser = NonNullable<Awaited<ReturnType<typeof currentUser>>>;

// Users without a first or last name were logged as "null null".
export const displayName = (user: ClerkUser) =>
  [user.firstName, user.lastName].filter(Boolean).join(" ") ||
  user.username ||
  user.primaryEmailAddress?.emailAddress ||
  "Someone";

export const createAuditLog = async (props: CreateAuditLogProps) => {
  try {
    const { orgId } = await auth();
    const user = await currentUser();

    if (!orgId || !user) {
      throw new Error("User not found!");
    }

    const { entityId, entityTitle, entityType, action } = props;

    await db.auditLog.create({
      data: {
        orgId,
        entityId,
        entityType,
        entityTitle,
        action,
        userId: user.id,
        userImage: user.imageUrl,
        userName: displayName(user),
      },
    });
  } catch (error) {
    console.log("[AUDIT_LOG_ERROR]", error);
  }
};
