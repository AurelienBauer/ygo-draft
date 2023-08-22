import React, { useState } from "react";
import Card from "./Card.component";
import { CardFromPack } from "../types";
import Icon from "../frontendComponent/Icon.components";

interface Props {
  card: CardFromPack,
}

function BoosterCard(props: Props) {
  const { card } = props;

  const [show, setShow] = useState<boolean>(false);

  const handleShowCard = () => {
    setShow(true);
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

  return (show ? (
    <div className="shine">
      <Card card={card} size="large" />
      <div className="rarity-overlay">
        {/* <Icon icon="search" /> */}
        <div className={`${rarityClass}`} />
      </div>
    </div>
  )
    : (
      <div onClick={handleShowCard} onKeyDown={handleShowCard} role="button" tabIndex={0}>
        <Card card={null} size="large" />
      </div>
    ));
}

export default BoosterCard;
