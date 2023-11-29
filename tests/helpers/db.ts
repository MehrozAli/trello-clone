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
