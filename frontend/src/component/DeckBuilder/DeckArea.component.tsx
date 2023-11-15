/* eslint-disable no-underscore-dangle */
import React, {
  Dispatch, SetStateAction,
} from "react";

import { useDrop } from "react-dnd";
import { filterCards, groupCards, orderCards } from "../../service";
import DragableCard from "./DragableCard.component";
import { DeckBuilderFilter, DeckBuilderLoc, ICard } from "../../types";
import Icon from "../../frontendComponent/Icon.components";
import { canBeDropIn } from "../../Games/BoosterOpening/service";

interface DropItem {
  card: ICard;
  sectionName: DeckBuilderLoc;
}

interface Props {
  deck: ICard[];
  moveCardHandler: (c: ICard, from: DeckBuilderLoc, to: DeckBuilderLoc) => void;
  setInfoCard: Dispatch<SetStateAction<ICard | null>>;
  sectionName: DeckBuilderLoc;
  searchFilters?: DeckBuilderFilter;
}

function DeckArea(props: Props) {
  const {
    deck, moveCardHandler, setInfoCard, sectionName, searchFilters,
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
        {groupCards(orderCards(filterCards(deck, searchFilters ?? {
          search: "", level: "", type: "", race: "", attribute: "",
        })))
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
              <div className="cards-list-card-number-over">
                {card.number > 1 && (<div>{card.number}</div>)}
              </div>
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

DeckArea.defaultProps = {
  searchFilters: {
    search: "", level: "", type: "", race: "", attribute: "",
  },
};

export default DeckArea;
