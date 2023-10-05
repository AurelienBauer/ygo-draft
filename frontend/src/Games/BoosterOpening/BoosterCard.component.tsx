import React, { useState } from "react";
import Card from "../../component/Card.component";
import { CardFromPackOpening, ICard } from "../../types";
import Icon from "../../frontendComponent/Icon.components";

interface Props {
  card: CardFromPackOpening,
  show: boolean,
  handleOpenCardDetail: (c: ICard) => void,
  handleBookmarkACard: (cardUUID: string) => void,
}

function BoosterCard(props: Props) {
  const {
    card, show, handleOpenCardDetail, handleBookmarkACard,
  } = props;

  const [isBookMarked, setIsBookMarked] = useState(false);

  const myHandleBookMark = () => {
    setIsBookMarked(!isBookMarked);
    handleBookmarkACard(card.uuid);
  };

  const myHandleOpenCardDetail = () => {
    handleOpenCardDetail(card);
  };

  let rarityClass = "";
  switch (card.rarity) {
    case "Rare":
      rarityClass = "rare";
      break;
    case "Super Rare":
      rarityClass = "rare super-rare";
      break;
    case "Ultra Rare":
      rarityClass = "rare ultra-rare";
      break;
    case "Secret Rare":
      rarityClass = "rare secret-rare";
      break;
    case "Common":
      break;
    default:
      console.log(`New rarity "${card.rarity}"`);
  }

  return (
    <div className="flip-card">
      <div className={`flip-card-inner booster-card ${show ? "show" : ""}`}>
        <div className="flip-card-front shine">
          <Card card={card} size="large" />
          <div className="rarity-overlay">
            <div className={`${rarityClass}`} />
          </div>
          <div className={`booster-bookmark-overlay ${isBookMarked ? "selected" : ""}`}>
            <div
              className="booster-bookmark"
              onClick={myHandleBookMark}
              onKeyDown={myHandleBookMark}
              role="button"
              tabIndex={0}
            >
              <Icon icon="bookmark" />
            </div>
          </div>
          <div className="booster-search-overlay">
            <div
              className="booster-search"
              onClick={myHandleOpenCardDetail}
              onKeyDown={myHandleOpenCardDetail}
              role="button"
              tabIndex={0}
            >
              <Icon icon="search" />
            </div>
          </div>
        </div>
        <div className="flip-card-back">
          <Card card={null} size="large" />
        </div>
      </div>
    </div>
  );
}

export default BoosterCard;
