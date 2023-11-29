import { db } from "@/lib/db";

export const resetDb = () =>
  db.$executeRawUnsafe(
    'TRUNCATE "Card", "List", "Board", "AuditLog", "OrgLimit", "OrgSubscription" CASCADE'
  );

export const createBoard = (orgId: string, title = "Roadmap") =>
  db.board.create({
    data: {
      orgId,
      title,
      imageId: "cover-1",
      imageThumbUrl: "/covers/cover-1.svg",
      imageFullUrl: "/covers/cover-1.svg",
      imageLinkHtml: "/covers/cover-1.svg",
      imageUserName: "Taskify",
    },
  });

export const createList = (boardId: string, title: string, order: number) =>
  db.list.create({ data: { boardId, title, order } });

export const createCard = (listId: string, title: string, order: number) =>
  db.card.create({ data: { listId, title, order } });

export const COVER =
  "cover-1|/covers/cover-1.svg|/covers/cover-1.svg|https://unsplash.com/|Taskify";

export const makePro = (orgId: string) =>
  db.orgSubscription.create({
    data: {
      orgId,
      stripePriceId: "price_test",
      stripeCurrentPeriodEnd: new Date(Date.now() + 7 * 86_400_000),
    },
  });
