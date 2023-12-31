import React from "react";
import { ICard } from "../types";

interface Props {
  card: ICard | null;
  size?: "micro" | "small" | "large";
}

function Card(props: Props) {
  const { card, size } = props;

  let widthSize = "6vw";
  let imgSrc: "image_small_url" | "image_url" = "image_small_url";
  if (size) {
    switch (size) {
      case "micro":
        widthSize = "3vw";
        imgSrc = "image_small_url";
        break;
      case "large":
        widthSize = "12vw";
        imgSrc = "image_url";
        break;
      default:
        break;
    }
  }

  return card ? (
    <img
      className="unselectable"
      draggable="false"
      style={{ width: widthSize, maxWidth: "14rem" }}
      src={card[imgSrc]}
      alt={card.name}
    />
  ) : (
    <img
      className="unselectable"
      draggable="false"
      style={{ width: widthSize, maxWidth: "14rem" }}
      src="https://images.ygoprodeck.com/images/cards/back_high.jpg"
      alt=""
    />
  );
}

Card.defaultProps = {
  size: "small",
};

export default Card;
