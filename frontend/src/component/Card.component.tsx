import React from "react";
import { ICard } from "../types";

interface Props {
  card: ICard | null;
  size?: "small" | "large";
}

const Card = (props: Props) => {
  const { card, size } = props;

  let widthSize = "6vw";
  let img_src: "image_small_url" | "image_url" = "image_small_url";
  if (size) {
    switch (size) {
      case "large":
        widthSize = "12vw";
        img_src = "image_url";
        break;
    }
  }

  return card ? (
    <img style={{ width: widthSize, height: "100%" }} src={card[img_src]} />
  ) : (
    <img
      style={{ width: widthSize, height: "100%" }}
      src="https://images.ygoprodeck.com/images/cards/100421010.jpg"
    />
  );
};

export default Card;
