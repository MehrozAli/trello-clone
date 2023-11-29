import type { Card, List } from "@/lib/generated/prisma/client";

export type ListWithCards = List & { cards: Card[] };
export type CardWithList = Card & { list: List };
