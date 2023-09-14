import React from "react";
import { useDrag } from "react-dnd";
import { DeckBuilderLoc, ICard } from "../../types";
import Card from "../Card.component";

interface Props {
  card: ICard;
  sectionName: DeckBuilderLoc;
}

function DragableCard(props: Props) {
  const { card, sectionName } = props;

  const [, drag] = useDrag(() => ({
    type: "Card",
    item: { card, sectionName },
  }), []);

  return (
    <div
      ref={drag}
      key={card.uuid}
      role="button"
      tabIndex={0}
    >
      <Card card={card} size="micro" />
    </div>
  );
}

export default DragableCard;
