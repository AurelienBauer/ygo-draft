/* eslint-disable no-underscore-dangle */
import React, { useState } from "react";
import { ICard } from "../../types";
import Card from "../Card.component";
import DeckExplorerSideInfo from "./DeckExplorerSideInfo.component";
import DownloadDeckButton from "../DownloadDeckButton.component";
import CardsTypeDistribution from "./CardsTypeDistribution.component";

interface Props {
  deck: ICard[];
  deckName: string;
}

const typeSort = [
  {
    name: "Trap Card",
    index: 3,
  },
  {
    name: "Spell Card",
    index: 2,
  },
  {
    name: "Effect Monster",
    index: 1,
  },
  {
    name: "Normal Monster",
    index: 1,
  },
  {
    name: "Flip Effect Monster",
    index: 1,
  },
];

function DeckExplorer(props: Props) {
  const { deck, deckName } = props;

  const [selectedCard, setSelectedCard] = useState<ICard | null>(null);
  const [hoverCard, setHoverCard] = useState<ICard | null>(null);

  const handleSelectedCard = (c: ICard) => {
    if (c.uuid === selectedCard?.uuid) {
      setSelectedCard(null);
    } else {
      setSelectedCard(c);
    }
  };

  const getCardTypeNumber = (typeName: string): number => {
    const type = typeSort.find((t) => t.name === typeName);
    if (!type) {
      return 0;
    }
    return type.index;
  };

  return (
    <div className="deck-explorer">
      <div className="cards-list">
        {deck
          .slice(0)
          .sort(
            (a, b) => getCardTypeNumber(a._type) - getCardTypeNumber(b._type),
          )
          .sort((a, b) => a.level - b.level)
          .map((card) => (
            <div
              key={card.uuid}
              onClick={() => handleSelectedCard(card)}
              onKeyDown={() => handleSelectedCard(card)}
              onMouseEnter={() => setHoverCard(card)}
              className={`cards-list-card ${
                card.uuid === selectedCard?.uuid ? "cards-list-selected" : ""
              }`}
              role="button"
              tabIndex={0}
            >
              <Card card={card} size="small" />
            </div>
          ))}
      </div>
      <div className="side-info">
        <DeckExplorerSideInfo selectedCard={selectedCard ?? hoverCard} />
        <CardsTypeDistribution deck={deck} />
        <DownloadDeckButton type="icon" deck={deck} filename={deckName} />
      </div>
    </div>
  );
}

export default DeckExplorer;
