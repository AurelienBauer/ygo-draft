import React from "react";
import Icon from "../frontendComponent/Icon.components";
import { downloadDeck } from "../service";
import { ICard } from "../types";

interface Props {
  type?: "icon" | "button";
  deck: ICard[];
  filename: string;
}

const DownloadDeckButton = (props: Props) => {
  const { type, deck, filename } = props;

  return type === "icon" ? (
    <button
      onClick={() => downloadDeck(filename, deck)}
      className="btn download-deck-icon"
    >
      <Icon icon="import" strokeColor="#b6b6b6" />
    </button>
  ) : (
    <div>
      <button className="btn btn-outline-primary download-deck-btn" onClick={() => downloadDeck(filename, deck)}>
        <Icon icon="import" />
        Download the Deck
      </button>
    </div>
  );
};

export default DownloadDeckButton;
