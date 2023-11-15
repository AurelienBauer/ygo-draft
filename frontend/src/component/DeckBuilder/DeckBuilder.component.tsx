import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { DeckBuilderFilter, DeckBuilderLoc, ICard } from "../../types";

import DeckExplorerSideInfo from "../DeckExplorer/DeckExplorerSideInfo.component";
import DownloadDeckButton from "../DownloadDeckButton.component";
import BoosterDownloadButton from "../../Games/BoosterOpening/BoosterDownloadButton.component";
import { GameContext, GameContextType } from "../Game/GameContext";
import DeckBuilderSearchFields from "./DeckBuilderSearchFields.component";
import DeckArea from "./DeckArea.component";

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
  const [searchFilters, setSearchFilters] = useState<DeckBuilderFilter>({
    search: "", level: "", type: "", race: "", attribute: "",
  });

  const { profile, lang } = React.useContext(
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
              lang,
              cards: {
                deck: deck.map((c) => c.id),
                extraDeck: extraDeck.map((c) => c.id),
                stock: stock.map((c) => c.id),
                bookmarked: bookmarked.map((c) => c.id),
              },
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
        <DeckBuilderSearchFields setSearchFilter={setSearchFilters} />
        <h5>
          {t("Bookmarked")}
          {" "}
          {bookmarked.length}
        </h5>
        <DeckArea deck={bookmarked} moveCardHandler={onMoveCard} setInfoCard={setInfoCard} sectionName="bookmarked" searchFilters={searchFilters} />
        <h5>
          {t("Stock")}
          {" "}
          {stock.length}
        </h5>
        <DeckArea deck={stock} moveCardHandler={onMoveCard} setInfoCard={setInfoCard} sectionName="stock" searchFilters={searchFilters} />
      </div>
    </div>
  );
}

export default DeckBuilder;
