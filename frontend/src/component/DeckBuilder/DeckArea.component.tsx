/* eslint-disable no-underscore-dangle */
import React, {
  Dispatch, SetStateAction,
} from "react";

import { useDrop } from "react-dnd";
import { getCardTypeNumber } from "../../service";
import DragableCard from "./DragableCard.component";
import { DeckBuilderLoc, ICard } from "../../types";
import { canBeDropIn } from "./service";
import Icon from "../../frontendComponent/Icon.components";

interface DropItem {
  card: ICard;
  sectionName: DeckBuilderLoc;
}

interface Props {
  deck: ICard[];
  moveCardHandler: (c: ICard, from: DeckBuilderLoc, to: DeckBuilderLoc) => void;
  setInfoCard: Dispatch<SetStateAction<ICard | null>>;
  sectionName: DeckBuilderLoc;
}

function DeckArea(props: Props) {
  const {
    deck, moveCardHandler, setInfoCard, sectionName,
  } = props;

  const [{ canDrop }, drop] = useDrop(
    () => ({
      accept: "Card",
      item: { sectionName },
      collect: (monitor) => ({
        canDrop: !!monitor.canDrop(),
      }),
      canDrop: (item: DropItem) => canBeDropIn(item.card, item.sectionName, sectionName),
      drop: (item) => {
        moveCardHandler(item.card, item.sectionName, sectionName);
      },
    }),
    [deck, moveCardHandler],
  );

  return (
    <div className={`card-area ${sectionName}`}>
      <div className="cards-list" ref={drop}>
        {deck
          .slice(0)
          .sort(
            (a, b) => getCardTypeNumber(a._type) - getCardTypeNumber(b._type),
          )
          .sort((a, b) => a.level - b.level)
          .map((card) => (
            <div
              key={card.uuid}
              onMouseEnter={() => setInfoCard(card)}
              className="cards-list-card"
              role="button"
              tabIndex={0}
            >
              <DragableCard
                key={card.uuid}
                card={card}
                sectionName={sectionName}
              />
            </div>
          ))}
      </div>
      {canDrop
      && (
      <div className="deck-can-drop">
        <div className="deck-can-drop-icon">
          <Icon icon="chevron-bottom" />
        </div>
      </div>
      )}
    </div>
  );
}

export default DeckArea;
