import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DeckBuilderLoc, ICard } from "../../types";

import DeckExplorerSideInfo from "../DeckExplorer/DeckExplorerSideInfo.component";
import DeckArea from "./DeckArea.component";
import DownloadDeckButton from "../DownloadDeckButton.component";
import BoosterDownloadButton from "../../Games/BoosterOpening/BoosterDownloadButton.component";
import { GameContext, GameContextType } from "../Game/GameContext";

interface Props {
  deck: ICard[];
  extraDeck: ICard[];
  stock: ICard[];
  bookmarked: ICard[];
  onMoveCard: (c: ICard, from: DeckBuilderLoc, to: DeckBuilderLoc) => void;
}

function DeckBuilder(props: Props) {
  const {
    deck, extraDeck, stock, bookmarked, onMoveCard,
  } = props;

  const { t } = useTranslation();

  const [infoCard, setInfoCard] = useState<ICard | null>(null);

  const { profile } = React.useContext(
    GameContext,
  ) as GameContextType;

  const draftFileName = `${new Date().toJSON().slice(0, 10)}-Draft-${profile?.name ?? "unknown"}`;
  const deckName = `${new Date().toJSON().slice(0, 10)}-${profile?.name ?? "unknown"}`;

  return (
    <div className="flex deck-builder mt-4">
      <div>
        <div className="mb-2 d-flex justify-content-between">
          <DownloadDeckButton type="button" deck={[...deck, ...extraDeck]} filename={deckName} />
          <BoosterDownloadButton
            draft={({
              deck,
              extraDeck,
              stock,
              bookmarked,
            })}
            filename={draftFileName}
          />
        </div>
        <DeckExplorerSideInfo selectedCard={infoCard} />
      </div>
      <div className="deck-explorer deck-section">
        <h5>
          {t("Main Deck")}
          {" "}
          {deck.length}
          {" "}
          / 40-60
        </h5>
        <DeckArea deck={deck} moveCardHandler={onMoveCard} setInfoCard={setInfoCard} sectionName="deck" />
        <h5>
          {t("Extra Deck")}
          {" "}
          {extraDeck.length}
          {" "}
          / 15
        </h5>
        <DeckArea deck={extraDeck} moveCardHandler={onMoveCard} setInfoCard={setInfoCard} sectionName="extraDeck" />
      </div>
      <div className="deck-explorer">
        <h5>
          {t("Bookmarked")}
          {" "}
          {bookmarked.length}
        </h5>
        <DeckArea deck={bookmarked} moveCardHandler={onMoveCard} setInfoCard={setInfoCard} sectionName="bookmarked" />
        <h5>
          {t("Stock")}
          {" "}
          {stock.length}
        </h5>
        <DeckArea deck={stock} moveCardHandler={onMoveCard} setInfoCard={setInfoCard} sectionName="stock" />
      </div>
    </div>
  );
}

export default DeckBuilder;
