import React, { useEffect, useState } from "react";
import { Store } from "react-notifications-component";
import { useTranslation } from "react-i18next";
import BoosterGameService from "./service/BoosterGameService";
import { DeckBuilderLoc, ICard } from "../../types";
import DeckBuilder from "../../component/DeckBuilder/DeckBuilder.component";
import { canBeDropIn } from "./service";

interface Props {
  bgservice: BoosterGameService;
}

function BoosterGameBuilding(props: Props) {
  const { bgservice } = props;

  const { t } = useTranslation();

  const [deck, setDeck] = useState<ICard[]>([]);
  const [extraDeck, setExtraDeck] = useState<ICard[]>([]);
  const [stock, setStock] = useState<ICard[]>([]);
  const [bookmarked, setBookmarked] = useState<ICard[]>([]);

  const onMoveCard = (c: ICard, from: DeckBuilderLoc, to: DeckBuilderLoc) => {
    if (canBeDropIn(c, from, to)) {
      bgservice.socket.moveCard(c.uuid, from, to).then(() => {
        switch (from) {
          case "deck":
            setDeck(deck.filter((deckCard: ICard) => deckCard.uuid !== c.uuid));
            break;
          case "extraDeck":
            setExtraDeck(extraDeck.filter((extraCard: ICard) => extraCard.uuid !== c.uuid));
            break;
          case "bookmarked":
            setBookmarked(bookmarked.filter((bookedCard: ICard) => bookedCard.uuid !== c.uuid));
            break;
          case "stock":
            setStock(stock.filter((stockCard: ICard) => stockCard.uuid !== c.uuid));
            break;
          default:
            break;
        }

        switch (to) {
          case "deck":
            setDeck([...deck, c]);
            break;
          case "extraDeck":
            setExtraDeck([...extraDeck, c]);
            break;
          case "bookmarked":
            setBookmarked([...bookmarked, c]);
            break;
          case "stock":
            setStock([...stock, c]);
            break;
          default:
            break;
        }
      }).catch(() => {
        Store.addNotification({
          title: "Card Limit",
          message: t("The maximum number for this card has been reached."),
          type: "info",
          insert: "bottom",
          container: "bottom-right",
          animationIn: ["animate__animated", "animate__fadeIn"],
          animationOut: ["animate__animated", "animate__fadeOut"],
          dismiss: {
            duration: 5000,
            onScreen: true,
          },
        });
      });
    }
  };

  useEffect(() => {
    if (bgservice.socket) {
      bgservice.socket.deckBuildingCurrentState().then((res) => {
        setDeck(res.deck);
        setExtraDeck(res.extraDeck);
        setStock(res.stock);
        setBookmarked(res.bookmarked);
      });
    }
  }, [bgservice.socket]);

  return (
    <div>
      <DeckBuilder
        deck={deck}
        stock={stock}
        extraDeck={extraDeck}
        bookmarked={bookmarked}
        onMoveCard={onMoveCard}
      />
    </div>
  );
}

export default BoosterGameBuilding;
