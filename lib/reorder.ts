import type { ListWithCards } from "@/types";

export type Position = { droppableId: string; index: number };
export type CardPosition = { id: string; listId: string; order: number };

const move = <T>(items: T[], from: number, to: number) => {
  const result = [...items];
  const [moved] = result.splice(from, 1);
  result.splice(to, 0, moved);
  return result;
};

export const reorderLists = (
  lists: ListWithCards[],
  from: number,
  to: number
): ListWithCards[] =>
  move(lists, from, to).map((list, index) => ({ ...list, order: index }));

/**
 * Moves a card within or between lists without mutating the input.
 * Returns the new lists plus the positions of every card in the lists that
 * changed, so the server can persist both the source and destination list.
 */
export const moveCard = (
  lists: ListWithCards[],
  source: Position,
  destination: Position
): { lists: ListWithCards[]; changed: CardPosition[] } | null => {
  const sourceList = lists.find((list) => list.id === source.droppableId);
  const destinationList = lists.find(
    (list) => list.id === destination.droppableId
  );

  if (!sourceList || !destinationList || !sourceList.cards[source.index]) {
    return null;
  }

  const renumber = (cards: ListWithCards["cards"], listId: string) =>
    cards.map((card, index) => ({ ...card, listId, order: index }));

  let nextSource: ListWithCards["cards"];
  let nextDestination: ListWithCards["cards"];

  if (sourceList.id === destinationList.id) {
    nextSource = renumber(
      move(sourceList.cards, source.index, destination.index),
      sourceList.id
    );
    nextDestination = nextSource;
  } else {
    const remaining = [...sourceList.cards];
    const [moved] = remaining.splice(source.index, 1);
    const target = [...destinationList.cards];
    target.splice(destination.index, 0, moved);

    nextSource = renumber(remaining, sourceList.id);
    nextDestination = renumber(target, destinationList.id);
  }

  const nextLists = lists.map((list) => {
    if (list.id === sourceList.id) return { ...list, cards: nextSource };
    if (list.id === destinationList.id) return { ...list, cards: nextDestination };
    return list;
  });

  const changedCards =
    sourceList.id === destinationList.id
      ? nextSource
      : [...nextSource, ...nextDestination];

  return {
    lists: nextLists,
    changed: changedCards.map(({ id, listId, order }) => ({ id, listId, order })),
  };
};
